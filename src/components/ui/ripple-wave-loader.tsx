import { motion } from 'framer-motion';

export default function RippleWaveLoader() {
  return (
    <div className="flex items-center space-x-[2px]">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="h-4 w-[3px] rounded-full bg-[#B388EB]"
          animate={{
            scaleY: [0.6, 1.4, 0.6],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}
