import { UserPlus, Sliders, Sparkles } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "1. Sign Up",
      description: "Create your account in seconds. Your privacy is our priority—no judgments, just support.",
      color: "from-primary/20 to-primary/10",
      iconBg: "bg-primary/20",
    },
    {
      icon: Sliders,
      title: "2. Customize",
      description: "Adjust tone, mood, and interaction style to match how you feel right now.",
      color: "from-accent/20 to-accent/10",
      iconBg: "bg-accent/30",
    },
    {
      icon: Sparkles,
      title: "3. Start Your Journey",
      description: "Connect with your AI therapist 24/7. Real support, whenever you need it.",
      color: "from-primary/30 to-accent/20",
      iconBg: "bg-primary/30",
    },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl md:text-3xl font-bold text-center lg:text-left">
        How It Works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={index}
              className={`relative group p-6 rounded-3xl bg-gradient-to-br ${step.color} backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="space-y-4">
                <div className={`w-16 h-16 rounded-full ${step.iconBg} flex items-center justify-center backdrop-blur-md`}>
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed tracking-tight">
                  {step.description}
                </p>
              </div>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
