export type Language = 'es' | 'en';

export const translations = {
  es: {
    // Navbar
    home: 'Inicio',
    pricing: 'Precios',
    login: 'Iniciar sesión',
    logout: 'Cerrar sesión',
    // Hero
    hero_title: 'Tu psicólogo virtual, disponible 24/7',
    hero_subtitle: 'Confidencial y consciente de lo humano',
    cta_free: 'Prueba Gratis',
    // Features
    features_title: 'Cómo te ayudamos',
    feature_available: 'Disponible 24/7',
    feature_available_desc: 'Siempre aquí cuando nos necesites',
    feature_confidential: 'Totalmente confidencial',
    feature_confidential_desc: 'Tus conversaciones son privadas y seguras',
    feature_personalized: 'Personalizado para ti',
    feature_personalized_desc: 'Ajusta el tono y estilo de la terapia',
    // Auth
    auth_login: 'Iniciar sesión',
    auth_signup: 'Registrarse',
    auth_email: 'Correo electrónico',
    auth_password: 'Contraseña',
    auth_continue_google: 'Continuar con Google',
    auth_have_account: '¿Ya tienes una cuenta?',
    auth_need_account: '¿Necesitas una cuenta?',
    auth_click_here: 'Haz clic aquí',
    auth_welcome: 'Bienvenido a psicolog.ia',
    auth_subtitle: 'Tu espacio seguro para bienestar mental',
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
    error_auth: 'Error de autenticación. Por favor, intenta de nuevo.',
    error_invalid_email: 'Correo electrónico inválido',
    error_password_short: 'La contraseña debe tener al menos 6 caracteres',
    error_required: 'Este campo es requerido',
    // Success
    success_signup: '¡Cuenta creada! Redirigiendo...',
    success_login: '¡Bienvenido de vuelta!',
  },
  en: {
    // Navbar
    home: 'Home',
    pricing: 'Pricing',
    login: 'Log In',
    logout: 'Log Out',
    // Hero
    hero_title: 'Your virtual psychologist, available 24/7',
    hero_subtitle: 'Confidential and human-aware',
    cta_free: 'Try for Free',
    // Features
    features_title: 'How we help you',
    feature_available: 'Available 24/7',
    feature_available_desc: 'Always here when you need us',
    feature_confidential: 'Fully confidential',
    feature_confidential_desc: 'Your conversations are private and secure',
    feature_personalized: 'Personalized for you',
    feature_personalized_desc: 'Adjust the tone and style of therapy',
    // Auth
    auth_login: 'Log In',
    auth_signup: 'Sign Up',
    auth_email: 'Email',
    auth_password: 'Password',
    auth_continue_google: 'Continue with Google',
    auth_have_account: 'Already have an account?',
    auth_need_account: 'Need an account?',
    auth_click_here: 'Click here',
    auth_welcome: 'Welcome to psicolog.ia',
    auth_subtitle: 'Your safe space for mental wellness',
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
    error_auth: 'Authentication error. Please try again.',
    error_invalid_email: 'Invalid email address',
    error_password_short: 'Password must be at least 6 characters',
    error_required: 'This field is required',
    // Success
    success_signup: 'Account created! Redirecting...',
    success_login: 'Welcome back!',
  }
};

export const useTranslation = (lang: Language) => {
  return (key: keyof typeof translations.es) => translations[lang][key];
};
