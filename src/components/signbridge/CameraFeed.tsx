import { motion } from "framer-motion";
import { Camera, VideoOff } from "lucide-react";

interface CameraFeedProps {
  active: boolean;
}

const CameraFeed = ({ active }: CameraFeedProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      {active ? (
        <>
          {/* Simulated camera feed area */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-[320px] aspect-[3/4] rounded-xl bg-foreground/5 flex items-center justify-center overflow-hidden"
          >
            {/* Skeleton tracking overlay simulation */}
            <svg viewBox="0 0 200 280" className="w-3/4 h-3/4 opacity-30">
              {/* Head */}
              <circle cx="100" cy="40" r="20" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
              {/* Body */}
              <line x1="100" y1="60" x2="100" y2="160" stroke="hsl(var(--primary))" strokeWidth="2" />
              {/* Arms */}
              <motion.line
                x1="100" y1="90" x2="40" y2="130"
                stroke="hsl(var(--primary))" strokeWidth="2"
                animate={{ x2: [40, 50, 30, 40], y2: [130, 110, 140, 130] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.line
                x1="100" y1="90" x2="160" y2="130"
                stroke="hsl(var(--primary))" strokeWidth="2"
                animate={{ x2: [160, 150, 170, 160], y2: [130, 120, 110, 130] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Hands */}
              <motion.circle
                cx="40" cy="130" r="8" fill="hsl(var(--primary))" opacity="0.5"
                animate={{ cx: [40, 50, 30, 40], cy: [130, 110, 140, 130] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.circle
                cx="160" cy="130" r="8" fill="hsl(var(--primary))" opacity="0.5"
                animate={{ cx: [160, 150, 170, 160], cy: [130, 120, 110, 130] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Legs */}
              <line x1="100" y1="160" x2="70" y2="240" stroke="hsl(var(--primary))" strokeWidth="2" />
              <line x1="100" y1="160" x2="130" y2="240" stroke="hsl(var(--primary))" strokeWidth="2" />
            </svg>

            {/* Corner brackets */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-primary rounded-tl-sm" />
            <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-primary rounded-tr-sm" />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-primary rounded-bl-sm" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-primary rounded-br-sm" />
          </motion.div>
          <p className="text-xs font-mono text-muted-foreground">Gesture tracking active</p>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <VideoOff className="h-8 w-8 opacity-30" />
          <p className="text-sm">Camera inactive</p>
        </div>
      )}
    </div>
  );
};

export default CameraFeed;
