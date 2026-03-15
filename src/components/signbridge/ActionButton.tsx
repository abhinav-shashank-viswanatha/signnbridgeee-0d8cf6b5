import { motion } from "framer-motion";
import { Mic, Camera, Keyboard, type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  mic: Mic,
  camera: Camera,
  keyboard: Keyboard,
};

interface ActionButtonProps {
  icon: "mic" | "camera" | "keyboard";
  label: string;
  active: boolean;
  onClick: () => void;
}

const ActionButton = ({ icon, label, active, onClick }: ActionButtonProps) => {
  const Icon = iconMap[icon];

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className={`
        relative flex items-center gap-2.5 min-h-[48px] px-6 py-3 rounded-xl text-sm font-medium
        transition-all duration-200 cursor-pointer
        ${active
          ? "bg-primary text-primary-foreground shadow-active"
          : "bg-card text-foreground shadow-card hover:shadow-active"
        }
      `}
    >
      {active && (
        <motion.span
          layoutId="active-ring"
          className="absolute inset-0 rounded-xl ring-2 ring-primary animate-breathe"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <Icon className="h-4.5 w-4.5" />
      <span>{label}</span>
    </motion.button>
  );
};

export default ActionButton;
