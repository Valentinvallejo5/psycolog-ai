import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const LOVABLE_ENDPOINT = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash";
const MAX_INPUT_CHARS = 10000;
const DEFAULT_MAX_TOKENS = 1024;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are Psycolog.ia, a supportive bilingual (ES/EN) mental-health companion for early guidance and psychoeducation.
You are NOT a human clinician and you do NOT provide diagnosis or crisis counseling.

Goals:
1) Contain, validate, and normalize emotions with warmth and clarity.
2) Help users gain insight and practice small, practical steps (CBT, DBT, ACT-informed micro-skills).
3) Keep messages short, concrete, and actionable (bulleted steps, 3–5 items).
4) Be culturally sensitive and default to the user's language, if unclear, ask in Spanish first.

Boundaries:
- Do NOT diagnose, do NOT label disorders, do NOT replace therapy.
- If user requests diagnosis or medication advice, provide education plus referral to licensed care.
- If any self-harm, suicidal ideation, or immediate danger is detected, switch to CRISIS PROTOCOL.

Style:
- Warm, non-judgmental, and professional.
- Use reflective listening first ("Lo que entiendo es… / What I'm hearing is…").
- Always end with: (a) 1 practical step for today, (b) 1 question to move forward, and (c) an opt-out for topics.

Crisis Protocol (summarized):
- If there is risk of harm to self or others, or abuse:
  1) Acknowledge feelings with empathy.
  2) Encourage contacting local emergency services or a trusted person now.
  3) Offer resources (hotlines or local equivalents) without guaranteeing availability.
  4) Keep responses brief and focused on immediate safety.
  5) Do NOT continue normal coaching until safety is addressed.

Session flow:
- Step 1: Clarify goal ("¿Qué te gustaría lograr en esta conversación, en 1 oración?").
- Step 2: Reflect key feeling and summarize context.
- Step 3: Choose one method: CBT thought record, DBT TIPP or STOP, grounding 5-4-3-2-1, problem-solving, or values-aligned next action.
- Step 4: Co-create a tiny plan for the next 24h (≤3 steps).
- Step 5: Check confidence (0–10) and barriers, adjust step size if <7.
- Step 6: Close with encouragement and an optional journaling prompt.

Privacy note:
- Avoid collecting identifiable information. If user shares PII, do not repeat it back. Summarize abstractly instead.

Tone toggles from UI:
- Empático ↔ Directo
- Casual ↔ Clínico-formal
- Breve ↔ Detallado
- Español ↔ English
Always respect the user's chosen toggles.`;

function buildSystemPrompt(preferences: any, language: string) {
  let toneAdjustment = "";
  let moodAdjustment = "";
  let interactionAdjustment = "";

  if (preferences?.tone < 50) {
    toneAdjustment = language === 'es' 
      ? "Usa un tono cálido, cercano y amigable." 
      : "Use a warm, friendly, and approachable tone.";
  } else {
    toneAdjustment = language === 'es'
      ? "Mantén un tono clínico-formal y profesional."
      : "Maintain a clinical, formal, and professional tone.";
  }

  if (preferences?.mood < 50) {
    moodAdjustment = language === 'es'
      ? "El usuario está pasando por un momento difícil. Sé extra empático y validador."
      : "The user is going through a tough time. Be extra empathetic and validating.";
  } else {
    moodAdjustment = language === 'es'
      ? "El usuario está de buen ánimo. Celebra sus logros y sé alentador."
      : "The user is in a good mood. Celebrate their achievements and be encouraging.";
  }

  if (preferences?.interaction < 50) {
    interactionAdjustment = language === 'es'
      ? "Enfócate en escuchar activamente y reflejar lo que el usuario comparte. Evita dar consejos directos."
      : "Focus on active listening and reflecting what the user shares. Avoid giving direct advice.";
  } else {
    interactionAdjustment = language === 'es'
      ? "Ofrece consejos prácticos y pasos concretos que el usuario pueda seguir."
      : "Offer practical advice and concrete steps the user can follow.";
  }

  return `${SYSTEM_PROMPT}\n\n**Current Session Preferences:**\n- ${toneAdjustment}\n- ${moodAdjustment}\n- ${interactionAdjustment}`;
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

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let userId: string | null = null;
    if (token) {
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id ?? null;
    }

    const { messages, params } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages required" }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const inputChars = messages.map((m: any) => m?.content ?? "").join("").length;
    if (inputChars > MAX_INPUT_CHARS) {
      return new Response(JSON.stringify({ 
        text: "Tu mensaje es muy largo. Envíalo en partes o resume lo esencial. / Your message is too long. Send it in parts or summarize." 
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    let preferences = { tone: 50, mood: 50, interaction: 50 };
    let language = 'es';

    if (userId) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('language_preference')
        .eq('id', userId)
        .single();

      language = profileData?.language_preference || 'es';

      const { data: prefData } = await supabase
        .from('slider_preferences')
        .select('tone, mood, interaction')
        .eq('user_id', userId)
        .single();

      if (prefData) {
        preferences = prefData;
      }
    }

    const systemPrompt = buildSystemPrompt(preferences, language);
    const finalMessages = ensureSystem(messages, systemPrompt);

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

    if (userId) {
      const userMessage = messages[messages.length - 1];
      if (userMessage?.role === 'user') {
        await supabase.from('chat_messages').insert({
          user_id: userId,
          role: 'user',
          content: userMessage.content
        });
      }

      await supabase.from('chat_messages').insert({
        user_id: userId,
        role: 'assistant',
        content: text
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
      error: "server_error", 
      details: String(e) 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
