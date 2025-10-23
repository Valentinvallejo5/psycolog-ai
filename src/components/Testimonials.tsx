import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Alex Doe",
    initials: "AD",
    rating: 5,
    text: "This app has been a game-changer for my mental health. I can connect with my therapist anytime, and the integrated tools have been incredibly helpful.",
  },
  {
    name: "Jamie Smith",
    initials: "JS",
    rating: 5,
    text: "I was hesitant about online therapy, but psicolog.ia made it so easy and comfortable. I feel heard and supported.",
  },
  {
    name: "Sam Wilson",
    initials: "SW",
    rating: 5,
    text: "The platform is incredibly intuitive. Finding a therapist that fits my schedule and needs was surprisingly simple. Highly recommend it.",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Trusted by people like you
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="bg-card border-border hover:shadow-[var(--shadow-soft)] transition-[var(--transition-smooth)]"
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <div className="flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">{testimonial.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
