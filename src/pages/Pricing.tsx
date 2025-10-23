import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Freemium",
    price: "$0",
    period: "",
    description: "Start your mental health journey",
    features: [
      "Limited chatbot access",
      "Basic tone customization",
      "Mood tracking",
      "24/7 availability",
      "Private/anonymous",
      "Secure chat",
    ],
    cta: "Try for Free",
    highlighted: false,
  },
  {
    name: "Monthly",
    price: "$5.99",
    period: "/month",
    description: "Full access to all features",
    features: [
      "Unlimited chatbot access",
      "Full customization",
      "Long-term memory",
      "Full access to wellness tools",
      "Priority updates",
    ],
    cta: "Subscribe for $5.99/month",
    highlighted: false,
  },
  {
    name: "Annual",
    price: "$49.99",
    period: "/year",
    badge: "Best Value",
    description: "Save with annual billing",
    features: [
      "All Monthly benefits",
      "Two months free",
      "Priority support",
      "Early access",
      "Referral system",
    ],
    cta: "Choose Annual - $49.99/year",
    highlighted: true,
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="py-20 bg-gradient-to-b from-muted to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Find the Right Plan for Your Journey to Well-being
            </h1>
            <p className="text-lg md:text-xl text-primary max-w-3xl mx-auto">
              Start your path to a healthier mind with a plan that fits your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index}
                className={`relative ${
                  plan.highlighted 
                    ? 'border-2 border-primary shadow-[var(--shadow-glow)]' 
                    : 'border-border'
                } bg-card hover:shadow-[var(--shadow-soft)] transition-[var(--transition-smooth)]`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                    {plan.badge}
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="mb-2">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Button 
                    variant={plan.highlighted ? "hero" : "default"} 
                    className="w-full"
                    asChild
                  >
                    <Link to="/auth">{plan.cta}</Link>
                  </Button>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
