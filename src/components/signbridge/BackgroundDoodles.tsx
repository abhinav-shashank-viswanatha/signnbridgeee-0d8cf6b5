import { motion } from "framer-motion";

const BackgroundDoodles = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
    {/* Glow orbs */}
    <motion.div
      className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/10 animate-glow-pulse"
      animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute top-1/2 -left-48 w-80 h-80 rounded-full bg-secondary/8 animate-glow-pulse"
      style={{ animationDelay: "2s" }}
      animate={{ x: [0, 15, 0], y: [0, 20, 0] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute bottom-20 right-1/4 w-64 h-64 rounded-full bg-accent/6 animate-glow-pulse"
      style={{ animationDelay: "4s" }}
    />

    {/* Subtle doodle elements */}
    <svg className="absolute top-1/4 right-10 w-20 h-20 text-primary/[0.06]" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5">
      {/* Speech bubble */}
      <path d="M10 15 Q10 5, 20 5 L60 5 Q70 5, 70 15 L70 45 Q70 55, 60 55 L30 55 L15 70 L20 55 L20 55 Q10 55, 10 45 Z" />
    </svg>
    <svg className="absolute bottom-1/3 left-16 w-16 h-16 text-secondary/[0.06]" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.5">
      {/* Sound waves */}
      <path d="M20 30 Q20 15, 30 15 Q40 15, 40 30 Q40 45, 30 45 Q20 45, 20 30" />
      <path d="M12 30 Q12 10, 30 10 Q48 10, 48 30 Q48 50, 30 50 Q12 50, 12 30" />
    </svg>
    <svg className="absolute top-2/3 right-1/3 w-14 h-14 text-accent/[0.05]" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.5">
      {/* Hand */}
      <circle cx="28" cy="28" r="22" />
      <path d="M28 14 L28 42 M18 22 L38 34 M38 22 L18 34" />
    </svg>
  </div>
);

export default BackgroundDoodles;
