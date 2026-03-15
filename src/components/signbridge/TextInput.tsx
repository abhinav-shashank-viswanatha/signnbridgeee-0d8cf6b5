import { useState } from "react";
import { motion } from "framer-motion";
import { CornerDownLeft } from "lucide-react";

interface TextInputProps {
  active: boolean;
  onSubmit: (text: string) => void;
}

const TextInput = ({ active, onSubmit }: TextInputProps) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text.trim());
      setText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!active) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
        <p className="text-sm">Select Text mode to type</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full justify-center px-6 gap-4"
    >
      <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
        Type your message
      </label>
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Start typing..."
          className="w-full min-h-[120px] p-4 rounded-xl bg-background text-foreground text-base resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/50 transition-shadow duration-200"
          autoFocus
        />
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="absolute bottom-3 right-3 p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-30 hover:opacity-90 transition-opacity duration-200"
        >
          <CornerDownLeft className="h-4 w-4" />
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        Press <kbd className="px-1.5 py-0.5 rounded bg-card font-mono text-[11px]">Enter</kbd> to translate
      </p>
    </motion.div>
  );
};

export default TextInput;
