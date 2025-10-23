import { Clock, Lock, User, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Support whenever you need it.",
  },
  {
    icon: Lock,
    title: "Confidentiality",
    description: "Your privacy is our priority.",
  },
  {
    icon: User,
    title: "Personalization",
    description: "A therapy journey tailored to you.",
  },
  {
    icon: Heart,
    title: "Well-being Techniques",
    description: "Integrated tools for mindfulness.",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            A therapy journey tailored to you
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover a new way to access professional mental health support, designed to fit your lifestyle and needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-border bg-gradient-to-b from-card to-muted hover:shadow-[var(--shadow-soft)] transition-[var(--transition-smooth)]"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
