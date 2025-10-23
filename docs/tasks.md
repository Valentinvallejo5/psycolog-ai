# psicolog.ia – Tasks & Implementation Roadmap

**Source of Truth**: This document defines the exact sequence, scope, and technical specs for building psicolog.ia.

---

## ✅ Phase 1: Foundation & Infrastructure

### Task 1.1: Enable Lovable Cloud
**Status**: Pending  
**Priority**: Critical  
**Dependencies**: None

**Action**:
- Enable Lovable Cloud to provision backend (PostgreSQL, Auth, Storage, Edge Functions)
- Confirm Cloud is active before proceeding with any backend tasks

**Validation**:
- Cloud tab visible in Lovable dashboard
- Database accessible
- Auth provider enabled

---

### Task 1.2: Database Schema Setup
**Status**: Pending  
**Priority**: Critical  
**Dependencies**: 1.1

**Tables to Create**:

#### 1.2.1: `profiles` table
```sql
-- User profile metadata
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  language_preference text not null default 'es' check (language_preference in ('es', 'en')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

-- RLS: Users can only read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, language_preference)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'language_preference', 'es')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

#### 1.2.2: `user_roles` table
```sql
-- Roles enum
create type public.app_role as enum ('user', 'admin');

-- User roles table
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null default 'user',
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Security definer function to check roles
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- Auto-assign 'user' role on signup
create or replace function public.assign_default_role()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_roles (user_id, role)
  values (new.id, 'user');
  return new;
end;
$$;

create trigger on_user_role_assignment
  after insert on auth.users
  for each row execute procedure public.assign_default_role();
```

#### 1.2.3: `subscription_plans` table
```sql
-- Subscription tiers
create type public.plan_type as enum ('free', 'monthly', 'annual');

create table public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  plan plan_type not null default 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.subscription_plans enable row level security;

-- RLS: Users can view their own subscription
create policy "Users can view own subscription"
  on public.subscription_plans for select
  using (auth.uid() = user_id);

-- Auto-create free plan on signup
create or replace function public.create_default_subscription()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.subscription_plans (user_id, plan)
  values (new.id, 'free');
  return new;
end;
$$;

create trigger on_subscription_created
  after insert on auth.users
  for each row execute procedure public.create_default_subscription();
```

#### 1.2.4: `chat_messages` table
```sql
-- Chat history
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamp with time zone default now()
);

create index idx_chat_messages_user_id on public.chat_messages(user_id);
create index idx_chat_messages_created_at on public.chat_messages(created_at);

alter table public.chat_messages enable row level security;

-- RLS: Users can only access their own messages
create policy "Users can view own messages"
  on public.chat_messages for select
  using (auth.uid() = user_id);

create policy "Users can insert own messages"
  on public.chat_messages for insert
  with check (auth.uid() = user_id);
```

#### 1.2.5: `slider_preferences` table
```sql
-- Slider settings (saved only for paid users)
create table public.slider_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  tone integer not null default 50 check (tone >= 0 and tone <= 100),
  mood integer not null default 50 check (mood >= 0 and mood <= 100),
  interaction integer not null default 50 check (interaction >= 0 and interaction <= 100),
  updated_at timestamp with time zone default now()
);

alter table public.slider_preferences enable row level security;

-- RLS: Users can view/update their own preferences
create policy "Users can view own preferences"
  on public.slider_preferences for select
  using (auth.uid() = user_id);

create policy "Users can upsert own preferences"
  on public.slider_preferences for insert
  with check (auth.uid() = user_id);

create policy "Users can update own preferences"
  on public.slider_preferences for update
  using (auth.uid() = user_id);
```

#### 1.2.6: `conversation_summaries` table
```sql
-- Long-term memory for paid users
create table public.conversation_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  summary_text text not null,
  topic_tags text[],
  mood_trajectory jsonb,
  key_facts text[],
  created_at timestamp with time zone default now()
);

create index idx_summaries_user_id on public.conversation_summaries(user_id);

alter table public.conversation_summaries enable row level security;

-- RLS: Users can view their own summaries
create policy "Users can view own summaries"
  on public.conversation_summaries for select
  using (auth.uid() = user_id);
```

---

### Task 1.3: Configure Google OAuth
**Status**: Pending  
**Priority**: High  
**Dependencies**: 1.1

**Action**:
- User will configure Google Cloud Console OAuth client
- User will provide Client ID and Secret
- Add Client ID/Secret to Lovable Cloud secrets via Supabase dashboard
- Configure Supabase Auth provider settings
- Set authorized redirect URLs to:
  - `https://<PROJECT_ID>.supabase.co/auth/v1/callback`
  - Preview URL + `/auth/callback`
  - Production domain + `/auth/callback`

**Reference**: See `<supabase-google-auth>` section in knowledge base

---

### Task 1.4: Enable Stripe Integration
**Status**: Pending  
**Priority**: High  
**Dependencies**: 1.1

**Action**:
- Enable Stripe integration in Lovable
- User will provide Stripe Secret Key
- Create products in Stripe:
  - Monthly Plan: $5.99/month
  - Annual Plan: $49.99/year
- Store Stripe Product IDs and Price IDs as secrets

**Validation**:
- Stripe products visible in Stripe Dashboard
- Secrets stored securely

---

### Task 1.5: Enable Lovable AI
**Status**: Pending  
**Priority**: Critical  
**Dependencies**: 1.1

**Action**:
- Enable Lovable AI integration
- Confirm `LOVABLE_API_KEY` is auto-provisioned in secrets
- Default model: `google/gemini-2.5-flash`

**Validation**:
- AI gateway accessible at `https://ai.gateway.lovable.dev/v1/chat/completions`

---

## ✅ Phase 2: Authentication & User Management

### Task 2.1: Build Auth UI (`/auth` page)
**Status**: In Progress (basic structure exists)  
**Priority**: High  
**Dependencies**: 1.1, 1.3

**Requirements**:
- Split layout: Left side = form, Right side = hero image
- Support both **Login** and **Signup** in tabs or toggle
- Email/password fields with validation (use zod)
- Google OAuth button
- Language toggle (ES/EN) in top-right corner
- "Already have an account?" / "Need an account?" toggle
- Redirect to `/chat` on successful auth
- Display friendly error messages (user already exists, invalid credentials, etc.)
- **CRITICAL**: Set `emailRedirectTo: window.location.origin` in signup

**Implementation Notes**:
```tsx
// Email/password signup
const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${window.location.origin}/`,
    data: {
      language_preference: currentLanguage // 'es' or 'en'
    }
  }
});

// Google OAuth
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/chat`
  }
});
```

**Bilingual Labels**:
| Key | ES | EN |
|-----|----|----|
| Login | Iniciar sesión | Log In |
| Sign Up | Registrarse | Sign Up |
| Email | Correo electrónico | Email |
| Password | Contraseña | Password |
| Continue with Google | Continuar con Google | Continue with Google |

**Files to Update**:
- `src/pages/Auth.tsx`
- Create `src/lib/i18n.ts` for translation helper

---

### Task 2.2: Add Auth State Management
**Status**: Pending  
**Priority**: High  
**Dependencies**: 2.1

**Action**:
- Create `src/hooks/useAuth.tsx` to manage session state
- Store **both** user and session objects
- Use `supabase.auth.onAuthStateChange` to listen for auth events
- Use `supabase.auth.getSession()` on mount

**Implementation**:
```tsx
// src/hooks/useAuth.tsx
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to auth changes FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, session, loading };
};
```

---

### Task 2.3: Add Protected Route Logic
**Status**: Pending  
**Priority**: High  
**Dependencies**: 2.2

**Action**:
- Protect `/chat` route - redirect to `/auth` if not logged in
- Auto-redirect logged-in users from `/auth` to `/chat`

**Implementation**:
```tsx
// src/components/ProtectedRoute.tsx
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  
  return <>{children}</>;
};

// In App.tsx
<Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
```

---

## ✅ Phase 3: Chat Interface & AI Integration

### Task 3.1: Build Edge Function for AI Chat
**Status**: Pending  
**Priority**: Critical  
**Dependencies**: 1.5, 2.2

**File**: `supabase/functions/chat/index.ts`

**Features**:
- Accept user message + conversation history
- Fetch user's subscription plan and slider preferences
- Fetch last N messages from `chat_messages` table
- Build dynamic system prompt based on:
  - Language preference
  - Tone slider (0-100: friendly → professional)
  - Mood slider (0-100: empathetic → celebratory)
  - Interaction mode (0-100: listening → advising)
- Call Lovable AI with streaming enabled
- Save user + assistant messages to DB
- Enforce message limits for free users (50 total)
- Return streaming response

**System Prompt Template**:
```typescript
const buildSystemPrompt = (lang: string, tone: number, mood: number, interaction: number) => {
  const isFriendly = tone < 50;
  const isGoodMood = mood > 50;
  const isAdvising = interaction > 50;

  const baseLang = lang === 'es' 
    ? 'Eres un psicólogo virtual empático y profesional. Respondes en español.'
    : 'You are an empathetic and professional virtual psychologist. Respond in English.';

  const toneGuidance = isFriendly
    ? 'Usa un tono amigable, cálido y cercano. Puedes usar emojis ocasionalmente.'
    : 'Usa un tono profesional, claro y respetuoso. Mantén formalidad.';

  const moodGuidance = isGoodMood
    ? 'El usuario está de buen ánimo. Celebra sus logros y refuerza lo positivo.'
    : 'El usuario puede estar pasando un momento difícil. Sé muy empático, valida sus emociones.';

  const interactionGuidance = isAdvising
    ? 'Ofrece consejos prácticos y sugerencias concretas.'
    : 'Escucha activamente. Haz preguntas abiertas. No des consejos a menos que te lo pidan.';

  return `${baseLang}\n\n${toneGuidance}\n${moodGuidance}\n${interactionGuidance}`;
};
```

**Free User Message Limit Logic**:
```typescript
// Check message count
const { count } = await supabase
  .from('chat_messages')
  .select('*', { count: 'exact', head: true })
  .eq('user_id', userId);

if (plan === 'free' && count >= 50) {
  return new Response(
    JSON.stringify({ error: 'Message limit reached. Upgrade to continue.' }),
    { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
```

**Edge Function Code Snippet**:
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { message } = await req.json();
    const authHeader = req.headers.get("authorization");
    
    // Get user from auth token
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { authorization: authHeader! } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    // Fetch user data
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('language_preference')
      .eq('id', user.id)
      .single();

    const { data: subscription } = await supabaseClient
      .from('subscription_plans')
      .select('plan')
      .eq('user_id', user.id)
      .single();

    const { data: preferences } = await supabaseClient
      .from('slider_preferences')
      .select('tone, mood, interaction')
      .eq('user_id', user.id)
      .single();

    // Check message count for free users
    const { count } = await supabaseClient
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (subscription?.plan === 'free' && count >= 50) {
      return new Response(
        JSON.stringify({ error: 'upgrade_required', message: 'You've reached the 50 message limit. Upgrade to continue.' }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch conversation history
    const { data: history } = await supabaseClient
      .from('chat_messages')
      .select('role, content')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(20); // Last 20 messages for context

    // Build system prompt
    const systemPrompt = buildSystemPrompt(
      profile?.language_preference || 'es',
      preferences?.tone || 50,
      preferences?.mood || 50,
      preferences?.interaction || 50
    );

    // Save user message
    await supabaseClient
      .from('chat_messages')
      .insert({ user_id: user.id, role: 'user', content: message });

    // Call Lovable AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...(history || []),
          { role: "user", content: message }
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please contact support." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    // Stream response back (save assistant message after streaming completes on client side)
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
```

**Update `supabase/config.toml`**:
```toml
[functions.chat]
verify_jwt = true
```

---

### Task 3.2: Update Chat UI to Use Edge Function
**Status**: Pending  
**Priority**: High  
**Dependencies**: 3.1

**File**: `src/pages/Chat.tsx`

**Changes**:
- Replace mock AI response with real streaming from edge function
- Fetch user's slider preferences on mount (if paid user)
- Load last 20 messages from DB on mount
- Send message to edge function
- Handle streaming response token-by-token
- Save assistant response to DB after streaming completes
- Handle 402 error (upgrade required) with upgrade modal/toast
- Handle 429 error (rate limit) with toast

**Streaming Logic**:
```tsx
const sendMessage = async (text: string) => {
  const userMsg = { role: 'user', content: text, id: Date.now() };
  setMessages(prev => [...prev, userMsg]);
  setInput('');
  setIsLoading(true);

  try {
    const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ message: text }),
    });

    if (resp.status === 402) {
      toast({ title: "Upgrade Required", description: "You've reached your message limit. Upgrade to continue." });
      setIsLoading(false);
      return;
    }

    if (!resp.ok || !resp.body) throw new Error("Failed to start stream");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantContent = "";

    const upsertAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
        }
        return [...prev, { role: "assistant", content: assistantContent, id: Date.now() }];
      });
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) upsertAssistant(content);
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    // Save assistant message to DB
    await supabase.from('chat_messages').insert({
      user_id: user.id,
      role: 'assistant',
      content: assistantContent
    });

    setIsLoading(false);
  } catch (e) {
    console.error(e);
    toast({ title: "Error", description: "Failed to send message" });
    setIsLoading(false);
  }
};
```

---

### Task 3.3: Add Slider Persistence for Paid Users
**Status**: Pending  
**Priority**: Medium  
**Dependencies**: 3.2

**Action**:
- On slider change, debounce and upsert to `slider_preferences` table (only if paid user)
- Load preferences from DB on mount (only if paid user)
- Display toast/message if free user tries to persist: "Upgrade to save your preferences"

**Implementation**:
```tsx
const savePreferences = async (tone: number, mood: number, interaction: number) => {
  if (plan !== 'free') {
    await supabase.from('slider_preferences').upsert({
      user_id: user.id,
      tone,
      mood,
      interaction
    });
  }
};

// Debounce slider changes
useEffect(() => {
  const timer = setTimeout(() => {
    savePreferences(tone[0], mood[0], interaction[0]);
  }, 1000);
  return () => clearTimeout(timer);
}, [tone, mood, interaction]);
```

---

## ✅ Phase 4: Payments & Plan Gating

### Task 4.1: Integrate Stripe Checkout
**Status**: Pending  
**Priority**: High  
**Dependencies**: 1.4

**Action**:
- Create edge function `supabase/functions/create-checkout/index.ts`
- Generate Stripe Checkout session for monthly or annual plan
- Redirect user to Stripe Checkout
- Handle successful payment via webhook

**Edge Function**:
```typescript
import Stripe from 'https://esm.sh/stripe@14.21.0';

serve(async (req) => {
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' });
  
  const { priceId } = await req.json(); // monthly or annual price ID
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${req.headers.get('origin')}/chat?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.headers.get('origin')}/pricing`,
  });

  return new Response(JSON.stringify({ url: session.url }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

---

### Task 4.2: Add Stripe Webhook Handler
**Status**: Pending  
**Priority**: High  
**Dependencies**: 4.1

**Action**:
- Create edge function `supabase/functions/stripe-webhook/index.ts`
- Listen for `checkout.session.completed` and `customer.subscription.updated`
- Update `subscription_plans` table with plan type and Stripe IDs

**Implementation**:
```typescript
serve(async (req) => {
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();
  
  const event = stripe.webhooks.constructEvent(body, sig, Deno.env.get('STRIPE_WEBHOOK_SECRET')!);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerId = session.customer;
    const subscriptionId = session.subscription;
    
    // Update subscription_plans table
    await supabase
      .from('subscription_plans')
      .update({
        plan: session.metadata.plan, // 'monthly' or 'annual'
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        current_period_start: new Date(session.subscription_data.current_period_start * 1000),
        current_period_end: new Date(session.subscription_data.current_period_end * 1000)
      })
      .eq('user_id', session.metadata.user_id);
  }

  return new Response(JSON.stringify({ received: true }));
});
```

---

### Task 4.3: Update Pricing Page CTAs
**Status**: Pending  
**Priority**: Medium  
**Dependencies**: 4.1

**Action**:
- Change pricing page CTAs to trigger Stripe Checkout
- For logged-in users: call edge function directly
- For visitors: redirect to `/auth` first

**Implementation**:
```tsx
const handleSubscribe = async (priceId: string) => {
  if (!user) {
    navigate('/auth');
    return;
  }

  const { data } = await supabase.functions.invoke('create-checkout', {
    body: { priceId }
  });

  if (data?.url) window.location.href = data.url;
};
```

---

## ✅ Phase 5: Bilingual Support

### Task 5.1: Create i18n Translation System
**Status**: Pending  
**Priority**: Medium  
**Dependencies**: None

**File**: `src/lib/i18n.ts`

**Implementation**:
```tsx
export type Language = 'es' | 'en';

export const translations = {
  es: {
    // Navbar
    home: 'Inicio',
    pricing: 'Precios',
    login: 'Iniciar sesión',
    // Hero
    hero_title: 'Tu psicólogo virtual, disponible 24/7',
    hero_subtitle: 'Confidencial y consciente de lo humano',
    cta_free: 'Prueba Gratis',
    // Features
    features_title: 'Cómo te ayudamos',
    feature_available: 'Disponible 24/7',
    feature_confidential: 'Totalmente confidencial',
    feature_personalized: 'Personalizado para ti',
    // Chat
    chat_placeholder: 'Escribe tu mensaje...',
    chat_tone: 'Tono de conversación',
    chat_mood: 'Estado de ánimo',
    chat_interaction: 'Modo de interacción',
    tone_friendly: 'Amigable 👯‍♀️',
    tone_professional: 'Profesional 🎓',
    mood_bad: 'Mal humor 😞',
    mood_good: 'Buen humor 😊',
    interaction_listen: 'Solo escuchar 🗣️',
    interaction_advise: 'Dar consejos 💡',
    // Errors
    error_limit: 'Has alcanzado el límite de 50 mensajes. Actualiza para continuar.',
    error_rate: 'Demasiadas solicitudes. Intenta más tarde.',
  },
  en: {
    // Navbar
    home: 'Home',
    pricing: 'Pricing',
    login: 'Log In',
    // Hero
    hero_title: 'Your virtual psychologist, available 24/7',
    hero_subtitle: 'Confidential and human-aware',
    cta_free: 'Try for Free',
    // Features
    features_title: 'How we help you',
    feature_available: 'Available 24/7',
    feature_confidential: 'Fully confidential',
    feature_personalized: 'Personalized for you',
    // Chat
    chat_placeholder: 'Type your message...',
    chat_tone: 'Conversation Tone',
    chat_mood: 'User Mood',
    chat_interaction: 'Interaction Mode',
    tone_friendly: 'Friendly 👯‍♀️',
    tone_professional: 'Professional 🎓',
    mood_bad: 'Bad mood 😞',
    mood_good: 'Good mood 😊',
    interaction_listen: 'Just Listen 🗣️',
    interaction_advise: 'Give Advice 💡',
    // Errors
    error_limit: "You've reached the 50 message limit. Upgrade to continue.",
    error_rate: 'Too many requests. Please try again later.',
  }
};

export const useTranslation = (lang: Language) => {
  return (key: keyof typeof translations.es) => translations[lang][key];
};
```

---

### Task 5.2: Add Language Toggle to UI
**Status**: Pending  
**Priority**: Medium  
**Dependencies**: 5.1

**Action**:
- Add language toggle to Navbar
- Persist language preference to `profiles` table
- Update all static text to use `t()` helper

---

## ✅ Phase 6: Polish & Optimization

### Task 6.1: Add Loading States
**Status**: Pending  
**Priority**: Low  
**Dependencies**: 3.2

**Action**:
- Add skeleton loaders for chat messages
- Show typing indicator while AI is responding
- Display progress for file uploads (future)

---

### Task 6.2: Accessibility Audit
**Status**: Pending  
**Priority**: Medium  
**Dependencies**: All UI tasks

**Checklist**:
- [ ] All sliders have ARIA labels
- [ ] Chat input has proper label
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Language attribute set on `<html>` tag

---

### Task 6.3: Add Legal Pages
**Status**: Pending  
**Priority**: Low  
**Dependencies**: None

**Action**:
- Create `/terms` page with bilingual terms of service
- Create `/privacy` page with bilingual privacy policy
- Link from footer

---

## ✅ Phase 7: Testing & Deployment

### Task 7.1: Manual Testing Checklist
**Status**: Pending  
**Priority**: High  
**Dependencies**: All features complete

**Test Scenarios**:
- [ ] New user signup (email + password) in ES
- [ ] New user signup via Google OAuth in EN
- [ ] Free user sends 50 messages → sees upgrade prompt
- [ ] Paid user saves slider preferences → preferences persist after logout/login
- [ ] Slider changes reflect in AI tone/mood/interaction in real-time
- [ ] Language toggle works across all pages
- [ ] Stripe checkout flow (monthly + annual)
- [ ] Mobile responsive design on iOS Safari + Android Chrome

---

### Task 7.2: Deploy to Production
**Status**: Pending  
**Priority**: High  
**Dependencies**: 7.1

**Action**:
- Click "Publish" in Lovable dashboard
- Connect custom domain (if applicable)
- Configure Stripe webhook URL to production domain
- Update Google OAuth redirect URLs to production domain
- Test production deployment end-to-end

---

## 📊 Summary

**Total Tasks**: 26  
**Critical Path**: 1.1 → 1.2 → 1.5 → 3.1 → 3.2 → 4.1 → 7.2  
**Estimated Timeline**: 6 weeks (per implementation.md)

**Next Immediate Action**: Enable Lovable Cloud (Task 1.1)
