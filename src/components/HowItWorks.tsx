import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const steps = [
  {
    title: "1. Sign Up",
    description: "Create your account in seconds. Your privacy is our priority—no judgments, just support.",
    icon: "👤",
    color: "from-purple-100 to-purple-200",
  },
  {
    title: "2. Customize",
    description: "Adjust tone, mood, and interaction style to match how you feel right now.",
    icon: "🎛️",
    color: "from-purple-100 to-purple-200",
  },
  {
    title: "3. Start Your Journey",
    description: "Connect with your AI therapist 24/7. Real support, whenever you need it.",
    icon: "✨",
    color: "from-purple-100 to-purple-200",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as any,
    },
  }),
};

export const HowItWorks = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div className="space-y-8">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-bold text-center lg:text-left tracking-tight"
      >
        How It Works
      </motion.h2>
      <div
        ref={ref}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {steps.map((step, index) => (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={cardVariants}
            whileHover={{
              scale: 1.03,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            className={`rounded-3xl shadow-xl p-8 text-center bg-gradient-to-br ${step.color} dark:from-zinc-800 dark:to-zinc-900 backdrop-blur-lg hover:shadow-2xl transition-shadow duration-300`}
          >
            <motion.div
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
              className="w-16 h-16 flex items-center justify-center mx-auto mb-4 rounded-full bg-white/30 backdrop-blur-md shadow-inner text-3xl"
            >
              {step.icon}
            </motion.div>
            <h3 className="text-xl font-semibold mb-2 tracking-tight">
              {step.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
