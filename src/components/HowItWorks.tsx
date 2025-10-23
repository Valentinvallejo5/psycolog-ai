import { UserPlus, Sliders, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "1. Sign Up",
      description: "Create your account in seconds. Your privacy is our priority—no judgments, just support.",
      gradient: "from-primary/20 via-primary/15 to-accent/10",
      iconBg: "bg-gradient-to-br from-primary/30 to-primary/20",
      glow: "shadow-[0_8px_32px_rgba(201,166,255,0.2)]",
    },
    {
      icon: Sliders,
      title: "2. Customize",
      description: "Adjust tone, mood, and interaction style to match how you feel right now.",
      gradient: "from-accent/20 via-accent/15 to-primary/10",
      iconBg: "bg-gradient-to-br from-accent/40 to-accent/25",
      glow: "shadow-[0_8px_32px_rgba(255,216,242,0.25)]",
    },
    {
      icon: Sparkles,
      title: "3. Start Your Journey",
      description: "Connect with your AI therapist 24/7. Real support, whenever you need it.",
      gradient: "from-primary/25 via-accent/20 to-primary/15",
      iconBg: "bg-gradient-to-br from-primary/35 to-accent/30",
      glow: "shadow-[0_8px_32px_rgba(201,166,255,0.25)]",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as any,
      },
    },
  };

  return (
    <div className="space-y-8">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-bold text-center lg:text-left"
      >
        How It Works
      </motion.h2>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className={`relative group p-8 rounded-3xl bg-gradient-to-br ${step.gradient} backdrop-blur-xl border border-white/30 ${step.glow} hover:shadow-[0_16px_48px_rgba(201,166,255,0.35)] transition-shadow duration-300`}
            >
              {/* Layered glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent opacity-50" />
              
              <div className="relative space-y-4">
                <motion.div 
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className={`w-16 h-16 rounded-full ${step.iconBg} flex items-center justify-center backdrop-blur-md shadow-inner relative`}
                >
                  {/* Inner glow */}
                  <div className="absolute inset-0 rounded-full bg-white/20 blur-sm" />
                  <Icon className="w-8 h-8 text-primary relative z-10" />
                </motion.div>
                
                <h3 className="text-xl font-bold tracking-tight">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed tracking-tight">
                  {step.description}
                </p>
              </div>
              
              {/* Hover overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-white/0"
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};
