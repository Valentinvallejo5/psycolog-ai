import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const LOVABLE_ENDPOINT = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash";
const MAX_INPUT_CHARS = 10000;
const DEFAULT_MAX_TOKENS = 1024;
const MAX_MESSAGE_LENGTH = 10000;
const ALLOWED_ROLES = ['user', 'assistant', 'system'];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ——— Conversation Guidance Types & Logic ——— 
type ConversationTone = 'friendly' | 'professional';
type UserMood = 'calm' | 'neutral' | 'hopeful' | 'tired' | 'anxious' | 'sad' | 'angry' | 'overwhelmed' | 'lonely' | 'unsure';
type InteractionMode = 'listen' | 'advise';
type Language = 'es' | 'en';
type UserRegister = 'voseo' | 'tuteo' | 'usted' | 'neutral';

const toneGuidance: Record<ConversationTone, string> = {
  friendly: [
    'Validá primero: reconoce emoción, esfuerzo y contexto ("Tiene sentido…", "Gracias por contarme esto…").',
    'Adaptá tu forma de hablar al estilo del usuario: si usa "vos", respondé con voseo; si usa "tú", usá tuteo; si escribe formal, mantené formalidad ligera.',
    'Reflejá palabras clave que la persona usa (sin copiar literal).',
    'Podés usar 0–1 emoji si la persona también los usa y suma contención (🤝, 💜, 🌱). Evitá ironía o sarcasmo.',
    'Mensajes breves (2–4 oraciones). Frases simples. Ritmo amable.',
    'Lenguaje cercano, sin tecnicismos; sin juicios ni minimizaciones.',
    'Cerrá con micro-pregunta o siguiente paso opcional ("¿Querés que lo pensemos juntos?", "¿Probamos algo breve?").'
  ].join(' '),
  professional: 'Tono clínico y respetuoso. Lenguaje claro y preciso, sin jerga ni emojis. Estructura: validación breve → exploración con preguntas abiertas → opción de técnica (CBT/DBT/ACT) solo si la persona la desea. No diagnostiques ni medicalices.',
};

const moodGuidance: Record<UserMood, string> = {
  calm: 'Mantener tono sereno. Profundizar objetivos/valores (ACT).',
  neutral: 'Explorar con preguntas abiertas para clarificar tema (CBT/ACT).',
  hopeful: 'Refuerzo positivo y siguiente paso concreto (CBT).',
  tired: 'Lenguaje suave, micro-acciones y descanso consciente (Mindfulness/ACT).',
  anxious: 'Desescalar, respiración/grounding; reencuadre cognitivo suave (DBT/CBT).',
  sad: 'Validación emocional cálida; activación conductual pequeña (CBT).',
  angry: 'De-escalada, reconocer límites y alternativas; regulación (DBT).',
  overwhelmed: 'Dividir en pasos mínimos; priorizar 1 cosa a la vez (CBT/DBT).',
  lonely: 'Enfoque empático; sugerir opciones de conexión segura (ACT).',
  unsure: 'Exploración guiada para identificar emoción/tema. Evitar suponer; usar preguntas abiertas.'
};

const interactionGuidance: Record<InteractionMode, string> = {
  listen: 'Modo ESCUCHA ACTIVA: priorizá validación y presencia. Preguntas abiertas, reflejo emocional y pausas. No des consejos salvo que te los pidan.',
  advise: 'Modo CONSEJO PRÁCTICO: ofrecé pasos breves, técnicas concretas (CBT/DBT/ACT) y check-ins de consentimiento ("¿Querés que te comparta una idea práctica?").'
};

function detectRegister(sample: string): UserRegister {
  const s = (sample || '').toLowerCase();
  if (/\bvos\b|\bquerés\b|\bpodés\b/.test(s)) return 'voseo';
  if (/\btú\b|\bpuedes\b|\bquieres\b/.test(s)) return 'tuteo';
  if (/\busted\b|\bpuede\b|\bquisiera\b/.test(s)) return 'usted';
  return 'neutral';
}

function registerGuidance(reg: UserRegister): string {
  switch (reg) {
    case 'voseo': return 'Usá voseo ("vos", "podés", "querés").';
    case 'tuteo': return 'Usá tuteo ("tú", "puedes", "quieres").';
    case 'usted': return 'Mantené "usted" con calidez y respeto.';
    default: return 'Usá español neutro, cercano y claro.';
  }
}

function baseLanguageGuidance(lang: Language): string {
  return lang === 'es'
    ? 'Respondé en ESPAÑOL. Evitá diagnósticos; cuidá seguridad y límites. Derivá a recursos de ayuda si detectás riesgo.'
    : 'Respond in ENGLISH. Avoid diagnoses; prioritize safety and boundaries. Offer help resources if you detect risk.';
}

// ——— Message Validation & Sanitization ———
function sanitizeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

function validateMessage(content: unknown, role: unknown): { valid: boolean; error?: string; sanitized?: string } {
  // Validate content type
  if (typeof content !== 'string') {
    return { valid: false, error: 'Message content must be a string' };
  }

  // Validate role
  if (typeof role !== 'string' || !ALLOWED_ROLES.includes(role)) {
    return { valid: false, error: 'Invalid message role' };
  }

  // Trim and check empty
  const trimmed = content.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'Message content cannot be empty' };
  }

  // Check length
  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return { valid: false, error: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters` };
  }

  // Validate character set (allow common unicode ranges)
  const invalidChars = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/;
  if (invalidChars.test(trimmed)) {
    return { valid: false, error: 'Message contains invalid control characters' };
  }

  // Sanitize HTML entities
  const sanitized = sanitizeHtml(trimmed);

  return { valid: true, sanitized };
}

const safetyGuidance = 'Si detectás señales de auto-daño, ideación suicida, violencia o riesgo inminente: 1) valida con mucha contención, 2) evita instrucciones clínicas, 3) sugiere contactar apoyo humano inmediato (líneas de ayuda locales, amigos/familia de confianza, servicios de emergencia). Pregunta si está a salvo ahora.';

function buildSystemPrompt(params: {
  lang: Language;
  tone: ConversationTone;
  mood: UserMood;
  mode: InteractionMode;
  lastUserMessage?: string;
}): string {
  const { lang, tone, mood, mode, lastUserMessage } = params;

  const blocks = [
    baseLanguageGuidance(lang),
    safetyGuidance,
    toneGuidance[tone],
    moodGuidance[mood],
    interactionGuidance[mode],
  ];

  if (lang === 'es' && lastUserMessage) {
    blocks.push(registerGuidance(detectRegister(lastUserMessage)));
  }

  blocks.push(
    'Formato: mensajes breves (2–4 oraciones), claros y empáticos. Usa listas solo si la persona las pide. Finaliza con una micro-pregunta o siguiente paso opcional.'
  );

  return blocks.join('\n\n');
}

function ensureSystem(messages: any[], systemPrompt: string) {
  const hasSystem = messages.some(m => m.role === "system");
  return hasSystem ? messages : [{ role: "system", content: systemPrompt }, ...messages];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: "Use POST" }), { 
      status: 405, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return new Response(JSON.stringify({ error: "Authentication required" }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid authentication" }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const userId = user.id;

    const { messages, params } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages required" }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Validate and sanitize each message
    const validatedMessages = [];
    for (const msg of messages) {
      const validation = validateMessage(msg.content, msg.role);
      if (!validation.valid) {
        console.error('Message validation failed:', validation.error);
        return new Response(JSON.stringify({ 
          error: "Invalid message format",
          details: validation.error
        }), { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }
      validatedMessages.push({
        role: msg.role,
        content: validation.sanitized
      });
    }

    const inputChars = validatedMessages.map((m: any) => m?.content ?? "").join("").length;
    if (inputChars > MAX_INPUT_CHARS) {
      return new Response(JSON.stringify({ 
        text: "Tu mensaje es muy largo. Envíalo en partes o resume lo esencial. / Your message is too long. Send it in parts or summarize." 
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    let preferences = { tone: 'friendly' as ConversationTone, mood: 'neutral' as UserMood, interaction: 'advise' as InteractionMode };
    let language: Language = 'es';

    const { data: profileData } = await supabase
      .from('profiles')
      .select('language_preference')
      .eq('id', userId)
      .single();

    language = (profileData?.language_preference as Language) || 'es';

    const { data: prefData } = await supabase
      .from('slider_preferences')
      .select('tone, mood, interaction')
      .eq('user_id', userId)
      .single();

    if (prefData) {
      preferences = {
        tone: (prefData.tone as ConversationTone) || 'friendly',
        mood: (prefData.mood as UserMood) || 'neutral',
        interaction: (prefData.interaction as InteractionMode) || 'advise'
      };
    }

    const lastUserMessage = validatedMessages[validatedMessages.length - 1]?.content || '';
    const systemPrompt = buildSystemPrompt({
      lang: language,
      tone: preferences.tone,
      mood: preferences.mood,
      mode: preferences.interaction,
      lastUserMessage
    });
    const finalMessages = ensureSystem(validatedMessages, systemPrompt);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const temperature = params?.temperature ?? 0.6;
    const maxTokens = Math.min(params?.maxTokens ?? DEFAULT_MAX_TOKENS, 2048);

    console.log('Calling Lovable AI with model:', MODEL);

    const aiResponse = await fetch(LOVABLE_ENDPOINT, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: finalMessages,
        temperature,
        max_tokens: maxTokens,
        stream: false
      }),
    });

    if (aiResponse.status === 429) {
      return new Response(JSON.stringify({ 
        error: "rate_limit",
        text: language === 'es' 
          ? "Demasiadas solicitudes. Por favor intenta en unos minutos."
          : "Too many requests. Please try again in a few minutes."
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (aiResponse.status === 402) {
      return new Response(JSON.stringify({ 
        error: "credits_exhausted",
        text: language === 'es'
          ? "Límite de créditos alcanzado. Por favor contacta soporte."
          : "Credit limit reached. Please contact support."
      }), {
        status: 402,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("Lovable AI error:", aiResponse.status, errorText);
      return new Response(JSON.stringify({ 
        error: "ai_gateway_error", 
        details: errorText 
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const raw = await aiResponse.json();
    const text = raw?.choices?.[0]?.message?.content ?? "";

    if (!text) {
      return new Response(JSON.stringify({ 
        error: "empty_response",
        text: language === 'es' ? "Sin respuesta del modelo." : "No response from model."
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Store validated and sanitized messages
    const userMessage = validatedMessages[validatedMessages.length - 1];
    if (userMessage?.role === 'user') {
      await supabase.from('chat_messages').insert({
        user_id: userId,
        role: 'user',
        content: userMessage.content
      });
    }

    // Validate and sanitize assistant response before storing
    const assistantValidation = validateMessage(text, 'assistant');
    const sanitizedResponse = assistantValidation.valid ? assistantValidation.sanitized : text;

    await supabase.from('chat_messages').insert({
      user_id: userId,
      role: 'assistant',
      content: sanitizedResponse
    });

    const { data: subscription } = await supabase
      .from('subscription_plans')
      .select('plan')
      .eq('user_id', userId)
      .single();

    if (subscription?.plan === 'free') {
      const { count } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('role', 'user');

      if (count && count >= 50) {
        return new Response(JSON.stringify({
          text,
          meta: { provider: "lovable", model: MODEL, limit_reached: true }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(JSON.stringify({ 
      text, 
      raw, 
      meta: { provider: "lovable", model: MODEL } 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (e) {
    console.error("Server error:", e);
    return new Response(JSON.stringify({ 
      error: "server_error"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
