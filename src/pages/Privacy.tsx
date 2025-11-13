import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

const Privacy = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last updated: January 2025",
      sections: [
        {
          heading: "1. Information We Collect",
          content: "We collect information you provide directly to us when you create an account, use our chat services, and interact with psicolog.ia. This includes your email address, conversation history, and customization preferences (tone, mood settings)."
        },
        {
          heading: "2. How We Use Your Information",
          content: "Your information is used to provide and improve our mental health support services, personalize your experience, maintain session continuity, and ensure the security of your account. We never share your conversations with third parties."
        },
        {
          heading: "3. Data Security",
          content: "We implement industry-standard security measures to protect your personal information and conversation data. All communications are encrypted, and we maintain strict confidentiality protocols."
        },
        {
          heading: "4. Your Rights",
          content: "You have the right to access, update, or delete your personal information at any time. You can export your conversation history or request complete account deletion through your account settings."
        },
        {
          heading: "5. Cookies and Tracking",
          content: "We use essential cookies to maintain your session and remember your preferences (language, customization settings). We do not use tracking cookies for advertising purposes."
        },
        {
          heading: "6. Third-Party Services",
          content: "We use trusted third-party services for authentication (Google OAuth) and infrastructure. These services are bound by their own privacy policies and security standards."
        },
        {
          heading: "7. Changes to This Policy",
          content: "We may update this privacy policy from time to time. We will notify users of any material changes via email or in-app notification."
        },
        {
          heading: "8. Contact Us",
          content: "If you have questions about this privacy policy or how we handle your data, please contact us at privacy@psicolog.ia"
        }
      ]
    },
    es: {
      title: "Política de Privacidad",
      lastUpdated: "Última actualización: Enero 2025",
      sections: [
        {
          heading: "1. Información que Recopilamos",
          content: "Recopilamos información que nos proporcionas directamente cuando creas una cuenta, usas nuestros servicios de chat e interactúas con psicolog.ia. Esto incluye tu dirección de correo electrónico, historial de conversaciones y preferencias de personalización (configuraciones de tono y estado de ánimo)."
        },
        {
          heading: "2. Cómo Usamos tu Información",
          content: "Tu información se utiliza para proporcionar y mejorar nuestros servicios de apoyo en salud mental, personalizar tu experiencia, mantener la continuidad de las sesiones y garantizar la seguridad de tu cuenta. Nunca compartimos tus conversaciones con terceros."
        },
        {
          heading: "3. Seguridad de Datos",
          content: "Implementamos medidas de seguridad estándar de la industria para proteger tu información personal y datos de conversación. Todas las comunicaciones están encriptadas y mantenemos protocolos estrictos de confidencialidad."
        },
        {
          heading: "4. Tus Derechos",
          content: "Tienes derecho a acceder, actualizar o eliminar tu información personal en cualquier momento. Puedes exportar tu historial de conversaciones o solicitar la eliminación completa de tu cuenta a través de la configuración."
        },
        {
          heading: "5. Cookies y Seguimiento",
          content: "Utilizamos cookies esenciales para mantener tu sesión y recordar tus preferencias (idioma, configuraciones de personalización). No utilizamos cookies de seguimiento con fines publicitarios."
        },
        {
          heading: "6. Servicios de Terceros",
          content: "Utilizamos servicios de terceros confiables para autenticación (Google OAuth) e infraestructura. Estos servicios están sujetos a sus propias políticas de privacidad y estándares de seguridad."
        },
        {
          heading: "7. Cambios a Esta Política",
          content: "Podemos actualizar esta política de privacidad de vez en cuando. Notificaremos a los usuarios sobre cualquier cambio material por correo electrónico o notificación en la aplicación."
        },
        {
          heading: "8. Contáctanos",
          content: "Si tienes preguntas sobre esta política de privacidad o cómo manejamos tus datos, contáctanos en privacy@psicolog.ia"
        }
      ]
    }
  };

  const currentContent = content[language as keyof typeof content];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {language === 'es' ? 'Volver al Inicio' : 'Back to Home'}
        </Button>

        <h1 className="text-4xl font-bold mb-4">{currentContent.title}</h1>
        <p className="text-muted-foreground mb-8">{currentContent.lastUpdated}</p>

        <div className="space-y-8">
          {currentContent.sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-2xl font-semibold mb-3">{section.heading}</h2>
              <p className="text-muted-foreground leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
