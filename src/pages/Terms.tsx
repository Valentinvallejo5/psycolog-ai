import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

const Terms = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Terms of Service",
      lastUpdated: "Last updated: January 2025",
      sections: [
        {
          heading: "1. Acceptance of Terms",
          content: "By accessing and using psicolog.ia, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services."
        },
        {
          heading: "2. Service Description",
          content: "psicolog.ia provides AI-powered mental health support through a chat interface. Our service is designed to offer emotional support and guidance, but it is not a replacement for professional medical or psychiatric care."
        },
        {
          heading: "3. User Responsibilities",
          content: "You are responsible for maintaining the confidentiality of your account credentials. You agree to use the service in a lawful manner and not to misuse or abuse the platform. You acknowledge that psicolog.ia is a support tool and not a crisis intervention service."
        },
        {
          heading: "4. Emergency Situations",
          content: "If you are experiencing a mental health emergency or crisis, please contact emergency services immediately (911 in the US, 112 in Europe) or reach out to a crisis helpline. psicolog.ia is not equipped to handle emergency situations."
        },
        {
          heading: "5. Subscription and Payments",
          content: "We offer both free and paid subscription tiers. Paid subscriptions are billed monthly or annually. You may cancel your subscription at any time, but refunds are not provided for partial billing periods."
        },
        {
          heading: "6. Intellectual Property",
          content: "All content, features, and functionality of psicolog.ia are owned by us and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, or distribute our content without permission."
        },
        {
          heading: "7. Limitation of Liability",
          content: "psicolog.ia is provided 'as is' without warranties of any kind. We are not liable for any damages arising from your use of the service. Our AI-powered support is supplementary and should not replace professional mental health care."
        },
        {
          heading: "8. Data Privacy",
          content: "Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information and conversation data."
        },
        {
          heading: "9. Modifications to Service",
          content: "We reserve the right to modify, suspend, or discontinue any aspect of the service at any time with or without notice. We may also update these Terms of Service periodically."
        },
        {
          heading: "10. Termination",
          content: "We reserve the right to terminate or suspend your account for violation of these terms or for any other reason at our discretion. You may also terminate your account at any time through your account settings."
        },
        {
          heading: "11. Contact Information",
          content: "For questions about these Terms of Service, please contact us at support@psicolog.ia"
        }
      ]
    },
    es: {
      title: "Términos de Servicio",
      lastUpdated: "Última actualización: Enero 2025",
      sections: [
        {
          heading: "1. Aceptación de Términos",
          content: "Al acceder y usar psicolog.ia, aceptas y acuerdas estar sujeto a estos Términos de Servicio. Si no estás de acuerdo con estos términos, por favor no uses nuestros servicios."
        },
        {
          heading: "2. Descripción del Servicio",
          content: "psicolog.ia proporciona apoyo en salud mental impulsado por IA a través de una interfaz de chat. Nuestro servicio está diseñado para ofrecer apoyo emocional y orientación, pero no es un reemplazo para atención médica o psiquiátrica profesional."
        },
        {
          heading: "3. Responsabilidades del Usuario",
          content: "Eres responsable de mantener la confidencialidad de las credenciales de tu cuenta. Aceptas usar el servicio de manera legal y no abusar de la plataforma. Reconoces que psicolog.ia es una herramienta de apoyo y no un servicio de intervención en crisis."
        },
        {
          heading: "4. Situaciones de Emergencia",
          content: "Si estás experimentando una emergencia o crisis de salud mental, contacta inmediatamente a los servicios de emergencia (911 en EE.UU., 112 en Europa) o comunícate con una línea de ayuda en crisis. psicolog.ia no está equipado para manejar situaciones de emergencia."
        },
        {
          heading: "5. Suscripciones y Pagos",
          content: "Ofrecemos niveles de suscripción gratuitos y de pago. Las suscripciones de pago se facturan mensual o anualmente. Puedes cancelar tu suscripción en cualquier momento, pero no se proporcionan reembolsos por períodos de facturación parciales."
        },
        {
          heading: "6. Propiedad Intelectual",
          content: "Todo el contenido, características y funcionalidad de psicolog.ia son de nuestra propiedad y están protegidos por leyes de derechos de autor, marcas registradas y otras leyes de propiedad intelectual. No puedes copiar, modificar o distribuir nuestro contenido sin permiso."
        },
        {
          heading: "7. Limitación de Responsabilidad",
          content: "psicolog.ia se proporciona 'tal cual' sin garantías de ningún tipo. No somos responsables de ningún daño que surja del uso del servicio. Nuestro apoyo impulsado por IA es complementario y no debe reemplazar la atención profesional de salud mental."
        },
        {
          heading: "8. Privacidad de Datos",
          content: "Tu privacidad es importante para nosotros. Por favor revisa nuestra Política de Privacidad para entender cómo recopilamos, usamos y protegemos tu información personal y datos de conversación."
        },
        {
          heading: "9. Modificaciones al Servicio",
          content: "Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto del servicio en cualquier momento con o sin previo aviso. También podemos actualizar estos Términos de Servicio periódicamente."
        },
        {
          heading: "10. Terminación",
          content: "Nos reservamos el derecho de terminar o suspender tu cuenta por violación de estos términos o por cualquier otra razón a nuestra discreción. También puedes terminar tu cuenta en cualquier momento a través de la configuración."
        },
        {
          heading: "11. Información de Contacto",
          content: "Para preguntas sobre estos Términos de Servicio, contáctanos en support@psicolog.ia"
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

export default Terms;
