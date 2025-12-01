/**
 * Hook para generar mensaje inicial del bot basado en el estado de ánimo,
 * tono de conversación y modo de interacción del usuario.
 */

import { User } from '@supabase/supabase-js';

type Mood = 'good_mood' | 'bad_mood';
type Tone = 'friendly' | 'professional';
type Mode = 'give_advice' | 'just_listen';
type Language = 'es' | 'en';

/**
 * Obtiene el nombre de display del usuario para personalización
 */
export const getUserDisplayName = (user: User | null): string => {
  if (!user) return '';
  // Intentar obtener nombre de metadata (Google OAuth)
  const fullName = user.user_metadata?.full_name;
  if (fullName) return fullName.split(' ')[0]; // Solo primer nombre
  // Fallback: usar parte del email antes de @
  return user.email?.split('@')[0] || 'amigo';
};

export function getInitialBotMessage(
  mood: Mood,
  tone: Tone,
  mode: Mode,
  language: Language = 'es'
): string {
  if (language === 'en') {
    return getEnglishMessage(mood, tone, mode);
  }
  return getSpanishMessage(mood, tone, mode);
}

function getSpanishMessage(mood: Mood, tone: Tone, mode: Mode): string {
  const badMoodFriendly = [
    "Hola. Vi que estás pasando un momento difícil hoy. Estoy acá con vos, sin apuro y sin juicio.",
    "Gracias por acercarte. No estás solo en esto, y podemos ir paso a paso.",
    "Sé que hoy puede costar. Ya estar acá es un montón. Contame, ¿qué es lo que más te pesa en este momento?",
    "Hola. Acá podés hablar sin miedo, a tu ritmo. ¿Qué es lo que más te está pesando hoy?",
    "Te escucho. No estás solo en esto. Contame qué necesitás sacar de adentro.",
  ];

  const badMoodProfessional = [
    "Hola. Entiendo que está atravesando un momento complejo. Estoy aquí para escucharlo y acompañarlo sin juicio.",
    "Gracias por confiar en este espacio. Podemos trabajar esto juntos, a su ritmo.",
    "Comprendo que hoy puede resultar difícil. ¿Qué es lo que más le preocupa en este momento?",
    "Bienvenido. Este es un espacio seguro para expresar lo que necesite. ¿Por dónde le gustaría comenzar?",
  ];

  const goodMoodFriendly = [
    "¡Hola! Me alegra saber que estás con buen ánimo. ¿Querés que pensemos juntos algún próximo paso o meta?",
    "¡Bienvenido! Estar de buen humor es una gran base para conversar o planear algo útil.",
    "¡Qué bueno verte por acá con buena energía! ¿Hay algo que quieras explorar o trabajar hoy?",
    "¡Hola! Qué lindo empezar con buena onda. ¿En qué te puedo acompañar hoy?",
    "¡Hola! Me encanta tu energía. ¿Querés charlar de algo específico o simplemente ver hacia dónde fluye la conversación?",
  ];

  const goodMoodProfessional = [
    "Hola. Me alegra verlo en un buen momento. ¿Hay algo específico en lo que desee trabajar hoy?",
    "Bienvenido. Su energía positiva es un excelente punto de partida. ¿En qué puedo asistirlo?",
    "Hola. Es positivo comenzar desde este lugar. ¿Qué le gustaría explorar o desarrollar hoy?",
    "Bienvenido. ¿Hay algún objetivo o tema que le gustaría abordar en esta sesión?",
  ];

  if (mood === 'bad_mood') {
    const messages = tone === 'friendly' ? badMoodFriendly : badMoodProfessional;
    return messages[Math.floor(Math.random() * messages.length)];
  } else {
    const messages = tone === 'friendly' ? goodMoodFriendly : goodMoodProfessional;
    return messages[Math.floor(Math.random() * messages.length)];
  }
}

function getEnglishMessage(mood: Mood, tone: Tone, mode: Mode): string {
  const badMoodFriendly = [
    "Hey. I can see you're going through a tough time right now. I'm here with you, no rush and no judgment.",
    "Thanks for reaching out. You're not alone in this, and we can take it step by step.",
    "I know today might be hard. Just being here is already a lot. Tell me, what's weighing on you the most right now?",
    "Hi. You can speak freely here, at your own pace. What's been weighing on you today?",
    "I'm listening. You're not alone. Tell me what you need to get off your chest.",
  ];

  const badMoodProfessional = [
    "Hello. I understand you're going through a challenging time. I'm here to listen and support you without judgment.",
    "Thank you for trusting this space. We can work through this together, at your pace.",
    "I understand today might be difficult. What concerns you the most right now?",
    "Welcome. This is a safe space to express whatever you need. Where would you like to begin?",
  ];

  const goodMoodFriendly = [
    "Hi! I'm glad to hear you're in a good mood. Want to think together about some next steps or goals?",
    "Welcome! Being in a good mood is a great foundation for talking or planning something useful.",
    "So good to see you here with positive energy! Is there something you'd like to explore or work on today?",
    "Hey! Great to start with good vibes. How can I support you today?",
    "Hi! I love your energy. Want to talk about something specific or just see where the conversation flows?",
  ];

  const goodMoodProfessional = [
    "Hello. I'm pleased to see you in a good place. Is there something specific you'd like to work on today?",
    "Welcome. Your positive energy is an excellent starting point. How may I assist you?",
    "Hello. It's positive to begin from this place. What would you like to explore or develop today?",
    "Welcome. Is there a goal or topic you'd like to address in this session?",
  ];

  if (mood === 'bad_mood') {
    const messages = tone === 'friendly' ? badMoodFriendly : badMoodProfessional;
    return messages[Math.floor(Math.random() * messages.length)];
  } else {
    const messages = tone === 'friendly' ? goodMoodFriendly : goodMoodProfessional;
    return messages[Math.floor(Math.random() * messages.length)];
  }
}

/**
 * Genera un mensaje de "bienvenido de nuevo" cuando se detecta una nueva sesión
 */
export function getReturningUserMessage(
  mood: Mood,
  tone: Tone,
  language: Language = 'es',
  previousSummary?: string
): string {
  if (language === 'en') {
    return getEnglishReturningMessage(mood, tone, previousSummary);
  }
  return getSpanishReturningMessage(mood, tone, previousSummary);
}

function getSpanishReturningMessage(mood: Mood, tone: Tone, previousSummary?: string): string {
  if (mood === 'bad_mood') {
    const messages = tone === 'friendly' 
      ? [
          "Hola de nuevo. Vi que estabas pasando un mal momento la última vez. ¿Querés que sigamos desde ahí o preferís empezar desde cero?",
          "Hola otra vez. Sé que las cosas estaban difíciles cuando hablamos. ¿Cómo venís ahora? ¿Retomamos o arrancamos de nuevo?",
          "Te veo por acá de nuevo. La última vez charlamos sobre cosas que te estaban pesando. ¿Seguimos desde ahí?",
        ]
      : [
          "Bienvenido nuevamente. En nuestra última conversación mencionó que atravesaba un momento complejo. ¿Desea continuar desde allí?",
          "Hola otra vez. ¿Cómo se encuentra ahora? ¿Le gustaría retomar donde quedamos o prefiere comenzar con algo nuevo?",
        ];
    return messages[Math.floor(Math.random() * messages.length)];
  } else {
    const messages = tone === 'friendly'
      ? [
          "¡Qué bueno tenerte de vuelta! ¿Seguimos desde donde dejamos o querés charlar de algo nuevo?",
          "¡Hola otra vez! Me alegra verte con mejor ánimo. ¿Retomamos la charla anterior o empezamos algo nuevo?",
          "¡Bienvenido de vuelta! ¿Cómo venís? ¿Seguimos con lo que veníamos hablando o arrancamos de cero?",
        ]
      : [
          "Bienvenido nuevamente. Me alegra verlo en un mejor momento. ¿Desea continuar con lo que estábamos trabajando?",
          "Hola otra vez. ¿Prefiere retomar nuestra conversación anterior o abordar un tema nuevo?",
        ];
    return messages[Math.floor(Math.random() * messages.length)];
  }
}

function getEnglishReturningMessage(mood: Mood, tone: Tone, previousSummary?: string): string {
  if (mood === 'bad_mood') {
    const messages = tone === 'friendly'
      ? [
          "Hey again. I saw you were going through a tough time last time. Want to continue from there or start fresh?",
          "Hi again. I know things were difficult when we last talked. How are you doing now? Should we pick up where we left off?",
          "I see you're back. Last time we talked about things that were weighing on you. Want to continue from there?",
        ]
      : [
          "Welcome back. In our last conversation, you mentioned going through a challenging time. Would you like to continue from there?",
          "Hello again. How are you feeling now? Would you like to resume where we left off or start with something new?",
        ];
    return messages[Math.floor(Math.random() * messages.length)];
  } else {
    const messages = tone === 'friendly'
      ? [
          "Great to have you back! Should we continue where we left off or talk about something new?",
          "Hi again! Glad to see you in better spirits. Pick up our previous chat or start something new?",
          "Welcome back! How are you? Continue with what we were discussing or start fresh?",
        ]
      : [
          "Welcome back. I'm pleased to see you in a better place. Would you like to continue what we were working on?",
          "Hello again. Would you prefer to resume our previous conversation or address a new topic?",
        ];
    return messages[Math.floor(Math.random() * messages.length)];
  }
}
