import { motion } from "framer-motion";

interface AudioVisualizerProps {
  active: boolean;
}

const AudioVisualizer = ({ active }: AudioVisualizerProps) => {
  const bars = 24;

  return (
    <div className="flex items-center justify-center h-full gap-[3px]">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-primary"
          animate={
            active
              ? {
                  height: [8, Math.random() * 48 + 12, 8],
                  opacity: [0.4, 1, 0.4],
                }
              : { height: 4, opacity: 0.15 }
          }
          transition={
            active
              ? {
                  duration: 0.6 + Math.random() * 0.6,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.04,
                  ease: [0.4, 0, 0.2, 1],
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
};

export default AudioVisualizer;
