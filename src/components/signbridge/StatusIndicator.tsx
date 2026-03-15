import { motion } from "framer-motion";

interface StatusIndicatorProps {
  state: "idle" | "listening" | "analyzing" | "translating";
  label?: string;
}

const stateConfig = {
  idle: { color: "bg-muted-foreground", text: "Ready" },
  listening: { color: "bg-primary", text: "Listening..." },
  analyzing: { color: "bg-primary", text: "Analyzing gestures..." },
  translating: { color: "bg-accent-live", text: "Translating..." },
};

const StatusIndicator = ({ state, label }: StatusIndicatorProps) => {
  const config = stateConfig[state];
  const isActive = state !== "idle";

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card font-mono text-xs tracking-tight">
      <span className="relative flex h-2 w-2">
        {isActive && (
          <motion.span
            className={`absolute inset-0 rounded-full ${config.color} animate-pulse-ring`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.color} ${isActive ? "animate-breathe" : "opacity-40"}`} />
      </span>
      <span className="text-muted-foreground tabular-nums">{label || config.text}</span>
    </div>
  );
};

export default StatusIndicator;
