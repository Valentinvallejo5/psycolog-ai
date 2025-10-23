import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HowItWorks } from "@/components/HowItWorks";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-muted to-background py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              psicolog.ia - Your space for{" "}
              <span className="text-primary">mental clarity</span>.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              Accessible, professional online therapy designed for your life. Start your journey to well-being today.
            </p>
            <Button variant="hero" size="lg" asChild className="text-base">
              <Link to="/auth">Start Your Free Trial</Link>
            </Button>
          </div>

          <div className="relative">
            <HowItWorks />
          </div>
        </div>
      </div>
    </section>
  );
};
