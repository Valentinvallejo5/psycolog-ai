import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I get started?",
    answer: "Getting started is easy! Simply create your free account on this page. You'll be guided through a short questionnaire to match you with the right therapist for your needs. You can start messaging your therapist right away.",
  },
  {
    question: "Are the therapists qualified?",
    answer: "Yes, all our therapists are licensed professionals with extensive training in mental health support. They are carefully vetted to ensure they meet our high standards for quality care.",
  },
  {
    question: "Is my information secure?",
    answer: "Absolutely. We use bank-level encryption to protect your data. Your conversations are completely confidential and we never share your information with third parties without your explicit consent.",
  },
  {
    question: "Can I switch therapists?",
    answer: "Yes, you can change therapists at any time. We want you to feel comfortable and supported, so if you don't feel a connection with your current therapist, we'll help you find a better match.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, and PayPal. Your subscription will automatically renew unless you cancel it from your account settings.",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border border-border rounded-lg px-6 bg-card"
            >
              <AccordionTrigger className="text-left hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
