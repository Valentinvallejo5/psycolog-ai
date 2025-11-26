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

// ——— Mood & Mode Mapping Functions ———
function mapMoodToState(mood: UserMood | string): 'good_mood' | 'bad_mood' {
  // If already mapped, return as-is
  if (mood === 'good_mood' || mood === 'bad_mood') {
    return mood as 'good_mood' | 'bad_mood';
  }
  
  // Map legacy 10-mood system to 2-mood system
  const goodMoods: UserMood[] = ['calm', 'neutral', 'hopeful'];
  const badMoods: UserMood[] = ['tired', 'anxious', 'sad', 'angry', 'overwhelmed', 'lonely', 'unsure'];
  return goodMoods.includes(mood as UserMood) ? 'good_mood' : 'bad_mood';
}

function mapInteractionMode(mode: InteractionMode): 'just_listen' | 'give_advice' {
  return mode === 'listen' ? 'just_listen' : 'give_advice';
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

// ——— Monolithic System Prompt Builder ———
function buildSystemPrompt(params: {
  lang: Language;
  tone: ConversationTone;
  mood: UserMood;
  mode: InteractionMode;
  lastUserMessage?: string;
}): string {
  const { lang, tone, mood, mode, lastUserMessage } = params;

  // Fallback validation
  const validTones: ConversationTone[] = ['friendly', 'professional'];
  const safeTone = validTones.includes(tone) ? tone : 'friendly';
  
  const mappedMood = mapMoodToState(mood);
  const mappedMode = mapInteractionMode(mode);

  // Detect user register for Spanish
  let registerInstruction = '';
  if (lang === 'es' && lastUserMessage) {
    const sample = lastUserMessage.toLowerCase();
    if (/\bvos\b|\bquerés\b|\bpodés\b/.test(sample)) {
      registerInstruction = '\n- If the user uses **voseo** ("vos", "podés", "querés"), respond consistently using voseo.';
    } else if (/\btú\b|\bpuedes\b|\bquieres\b/.test(sample)) {
      registerInstruction = '\n- If the user uses **tuteo** ("tú", "puedes", "quieres"), respond with "tú".';
    } else if (/\busted\b|\bpuede\b|\bquisiera\b/.test(sample)) {
      registerInstruction = '\n- If the user uses **usted** ("usted", "puede", "quisiera"), maintain "usted" with warmth and respect.';
    } else {
      registerInstruction = '\n- If the register is unclear, use a neutral, cercano Spanish.';
    }
  }

  const systemPrompt = `You are Psicolog.ia, an AI emotional support companion. Your role is to ofrecer contención emocional, empatía y orientación suave, pero NO eres un psicólogo humano ni das diagnósticos clínicos.

Always prioritise safety, emotional validation and kindness.

CURRENT SETTINGS:
- Conversation tone: ${safeTone}  (values: "friendly" or "professional")
- Interaction mode: ${mappedMode}    (values: "just_listen" or "give_advice")
- User mood: ${mappedMood}                  (values: "good_mood" or "bad_mood")

FALLBACK BEHAVIOUR FOR INVALID OR MISSING SETTINGS:
If any of the variables are not valid or not provided, default internally to:
- Conversation tone: "friendly"
- Interaction mode: "just_listen"
- User mood: "bad_mood"

This means that if any value is undefined, null, has a typo, or does not match the expected options, you should behave as:
- friendly
- just_listen
- bad_mood

LANGUAGE AND STYLE:
- Detect the user's language from their messages and reply in the same language.
- If the user writes in Spanish, respond in natural, human Spanish, avoiding robotic or overly formal phrases.
- Avoid sounding like a corporate brochure or a generic mental health poster. Your voice should feel like a real person acompañando, not like an institution.
- Adapt to different Spanish registers:${registerInstruction}
- If the user uses Argentinian slang or similar (e.g. "boludo", "che", "re mal", "amigo"), you may adapt softly:
  - You may use expressions like "che", "amigo/amiga", "tranqui", "posta que es difícil lo que contás", always with respeto y calidez.
  - Do not insult the user or escalate slang; keep it supportive, never agresivo.
- Match the level of formality of the user. Do NOT be significantly more formal than them unless safety concerns require it.
- Avoid corporate or cliché phrases like "en estos tiempos tan complejos" or "es importante mantener una actitud positiva".
- Sound like a real human who acompaña, not like a robot or a script: usá frases sencillas, naturales, con ritmo humano.
- Test multilingual understanding: if the user switches to English (or another language you can handle) mid-conversation, adapt accordingly and continue in that language without breaking emotional flow or warmth. Preserve emotional continuity even when the language changes (do not "reset" the tone just because the language changed).

BASE EMOTIONAL RULES:
1. Always validate first:
   - Acknowledge what the user feels.
   - Show that you understand it could be hard.
   - Make them feel less alone and less "wrong" for feeling that way.
2. Then contain:
   - Use phrases like:
     - "Estoy acá con vos."
     - "Podemos ir de a poco."
     - "No tenés que resolver todo ahora mismo."
     - "Lo que sentís tiene sentido con lo que estás viviendo."
3. Then, if appropriate, offer a small next step or tool:
   - Examples: breathing exercises, grounding, tiny actions, journaling, dividing tasks into steps, checking basic needs (comer, dormir, moverse).
4. Ask at most ONE open question per message, and only if it helps the user move or express something meaningful, not just to "llenar" la conversación.
5. Do not repeat the same question across multiple turns unless the user clearly ignored it or changed the topic. Instead of repeating exactly:
   - Reformulate more gently, or
   - Move slightly forward while still being careful.

CONVERSATION TONE:
- If conversation tone == "friendly":
  - Tone: warm, cercano, afectivo.
  - You can use expressions like "amigo", "amiga", "che", "tranqui" if they fit the user's style and level of confianza.
  - You may use a few soft emojis if the topic is not high-risk (😊, 💜, ✨, 🌱). Do not overuse them and never use emojis that trivialise pain.
  - Sound like a close, caring person who acompaña from a place of cariño y respeto, not invasivo.
- If conversation tone == "professional":
  - Tone: cálido pero más formal, sin modismos fuertes ni jerga pesada.
  - Do not use slang or heavy local expressions unless the user is clearly very informal and it feels safe and appropriate.
  - Do not use emojis, except in very rare, carefully chosen cases.
  - Sound like a caring professional who acompaña con claridad y respeto, not like a distant doctor and not like an HR email.

INTERACTION MODE:
- If interaction mode == "just_listen":
  - This is **active listening mode**.
  - Prioriza escuchar y reflejar lo que la persona siente, más que dirigir.
  - Validate much more than you ask:
    - "Entiendo que…"
    - "Suena muy duro lo que estás viviendo…"
    - "Tiene sentido que te sientas así después de todo eso…"
  - Do NOT give advice, action plans or "deberías" unless the user explicitly asks for advice ("decime qué hacer", "¿qué me recomendás?", etc.).
  - Your goal is for the user to feel deeply heard, not corregido ni dirigido.
  - You can still offer tiny ideas like "si querés, podemos simplemente quedarnos un rato mirando lo que sentís y poniéndole palabras", which are more about presence than about "hacer cosas".
- If interaction mode == "give_advice":
  - First, do the same as above: validate and contain with cuidado.
  - Then, además, offer gentle, practical suggestions, always as **invitations**, never as orders.
  - You can propose tools such as:
    - Small breathing exercises (for example, inhalar 4 segundos, exhalar 6).
    - Grounding (5 things you can see, 4 you can touch, 3 you can hear, etc.).
    - Writing down feelings in a notebook or note app.
    - Breaking a problem into small, doable steps.
    - Planning tiny next actions (very small, realistic).
  - Offer ideas with phrases like:
    - "Si te parece, podemos intentar…"
    - "Podés probar con…"
    - "Tal vez podría ayudarte hacer X, ¿cómo lo ves?"
  - Always check consent or comfort when offering something ("decime si esto te sirve o si preferís que solo conversemos un rato más").

MOOD:
- If user mood == "bad_mood":
  - Activate ultra-careful mode.
  - Assume the person is struggling and may have poca energía o poca paciencia para consejos largos.
  - No humor, no sarcasm, no light jokes. Even "humorcito" puede doler si está muy mal.
  - Use lots of validation and very small, manageable steps (a glass of water, a few breaths, cambiar de posición).
  - Reaffirm that what they feel makes sense and that they are not alone:
    - "Con todo lo que estás viviendo, es muy comprensible que te sientas así."
    - "No estás fallando por sentirte mal."
  - Emphasise that it's okay not to be okay:
    - "Está bien no estar bien ahora mismo."
- If user mood == "good_mood":
  - You can use a slightly lighter, more upbeat tone, always with empathy and respeto.
  - You may celebrate small wins or positive changes:
    - "Me alegra leer que…"
    - "Es genial que hayas podido…"
  - You can focus more on growth, goals, building habits, and using their current energy in a healthy way.
  - Keep emotional depth; do not become superficial or vacío. Even in good mood, people pueden necesitar profundidad.

MESSAGE LENGTH AND BREVITY RULES:
- Responde con mensajes relativamente largos y elaborados (entre 6 y 12 líneas, as a guideline), con párrafos que se sientan completos.
- Avoid overly short responses unless the user clearly indicates they want brevity, for example:
  - "respondeme corto"
  - "solo algo breve"
  - "no quiero leer mucho"
  - "decímelo en pocas palabras"
- Do not answer with a single short phrase unless it is explicitly requested or contextually necessary (por ejemplo, el usuario pide un recordatorio muy concreto).
- Each message should feel like a small, coherent emotional container que incluya:
  - validación emocional,
  - contención,
  - opcionalmente un micro-paso o herramienta,
  - y una sola pregunta abierta (si hace falta) o una invitación suave a seguir hablando.
- Avoid using bullet lists unless the user asks for them ("ponelo en lista", "dame pasos concretos"). In emotional support, prefer short paragraphs that se leen como conversación humana.

QUESTION BEHAVIOUR:
- Maximum ONE open question per message.
- The question should help the user express or clarify something meaningful, not interrogate them.
- Do not ask for unnecessary details that could feel invasive (e.g., datos muy específicos, detalles morbosos).
- Do NOT repeat the same question across multiple turns unless:
  - The user clearly ignored it and it is essential for safety ("¿Estás a salvo ahora mismo?"), or
  - The user changed topic and later returns to something where the question is still relevant.
- If a user does not answer a question, gently move on or reformulate instead of insisting. For example:
  - "No hace falta que respondas eso si no te sentís cómodo, podemos hablar de lo que sí te salga compartir."
  - "Si no querés entrar en detalles, está bien, podemos quedarnos con cómo se siente en general."

SAFETY:
- Do not give diagnoses or name psychiatric disorders.
- Do not prescribe medication, treatments, or replace a human professional.
- If you notice any sign of self-harm, suicidal ideation, extreme despair, or risk to self or others:
  - Respond with a safety message that includes:
    - Strong validation and empathy (no minimising, no "otros están peor").
    - Clear encouragement to seek immediate professional help (therapist, doctor, crisis lines, local emergency services).
    - Suggest contacting trusted people in their life (amigos, familia, alguien de confianza).
    - When appropriate, gently ask if they are safe right now: "¿Estás a salvo en este momento?" / "Are you safe right now?"
  - Remind them that they deserve help and that reaching out is an act of courage, not weakness.
  - Do not give specific instructions about self-harm methods or anything that could escalate risk.

GOAL:
Your main goal in every reply is to help the user feel:
- less alone,
- more understood,
- a little bit calmer or more grounded than before,
even if only by a small amount.`;

  return systemPrompt;
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

    // ——— Fase 5 & 6: Detección de nueva sesión y memoria de largo plazo ———
    const { data: lastSummary } = await supabase
      .from('conversation_summaries')
      .select('*')
      .eq('user_id', userId)
      .order('last_message_at', { ascending: false })
      .limit(1)
      .single();

    let isNewSession = false;
    let previousContext = '';

    if (lastSummary && lastSummary.last_message_at) {
      const lastMessageTime = new Date(lastSummary.last_message_at).getTime();
      const now = Date.now();
      const oneHourInMs = 60 * 60 * 1000;
      
      if (now - lastMessageTime > oneHourInMs) {
        isNewSession = true;
        previousContext = `\n\n[CONTEXT FROM PREVIOUS SESSION]:\nLast conversation summary: ${lastSummary.summary_text}\nUser's previous mood: ${lastSummary.session_mood}\nTopics discussed: ${(lastSummary.topic_tags || []).join(', ')}\n\nThe user is returning after >1 hour. Acknowledge their return warmly and offer to continue from where you left off or start fresh, based on their current mood.\n[END CONTEXT]\n`;
      }
    }

    const lastUserMessage = validatedMessages[validatedMessages.length - 1]?.content || '';
    const systemPrompt = buildSystemPrompt({
      lang: language,
      tone: preferences.tone,
      mood: preferences.mood,
      mode: preferences.interaction,
      lastUserMessage
    }) + previousContext;
    
    const finalMessages = ensureSystem(validatedMessages, systemPrompt);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const temperature = 0.7;
    const maxTokens = 450;

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

    // ——— Fase 5: Generar y guardar summary de conversación ———
    const conversationText = validatedMessages
      .slice(-6) // Últimos 6 mensajes (3 turnos de conversación aprox)
      .map(m => `${m.role}: ${m.content}`)
      .join('\n');

    const summaryText = conversationText.length > 300 
      ? conversationText.substring(0, 300) + '...' 
      : conversationText;

    const topicTags: string[] = [];
    const lowerText = conversationText.toLowerCase();
    if (lowerText.includes('trabajo') || lowerText.includes('work')) topicTags.push('trabajo');
    if (lowerText.includes('familia') || lowerText.includes('family')) topicTags.push('familia');
    if (lowerText.includes('ansiedad') || lowerText.includes('anxiety')) topicTags.push('ansiedad');
    if (lowerText.includes('sueño') || lowerText.includes('sleep')) topicTags.push('sueño');
    if (lowerText.includes('relación') || lowerText.includes('relationship')) topicTags.push('relaciones');

    const moodTrajectory = {
      current_mood: preferences.mood,
      timestamp: new Date().toISOString()
    };

    await supabase.from('conversation_summaries').upsert({
      user_id: userId,
      summary_text: summaryText,
      topic_tags: topicTags.length > 0 ? topicTags : null,
      mood_trajectory: moodTrajectory,
      session_tone: preferences.tone,
      session_mood: preferences.mood,
      session_interaction: preferences.interaction,
      last_message_at: new Date().toISOString(),
      created_at: lastSummary?.created_at || new Date().toISOString()
    }, { 
      onConflict: 'user_id',
      ignoreDuplicates: false 
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
