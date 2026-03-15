import { motion, AnimatePresence } from "framer-motion";
import { Volume2 } from "lucide-react";

interface OutputStageProps {
  translatedText: string;
  isTranslating: boolean;
}

const OutputStage = ({ translatedText, isTranslating }: OutputStageProps) => {
  const handleSpeak = () => {
    if (translatedText && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(translatedText);
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col justify-center h-full p-8 lg:p-12">
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          Translation Output
        </span>
        {translatedText && (
          <button
            onClick={handleSpeak}
            className="p-2 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground transition-colors duration-200"
            aria-label="Read translation aloud"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={translatedText || "placeholder"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="flex-1 flex items-center"
        >
          <p
            className={`text-2xl lg:text-3xl font-medium leading-relaxed ${
              translatedText ? "text-foreground" : "text-muted-foreground/40"
            }`}
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {isTranslating ? (
              <span className="flex items-center gap-2">
                <span className="inline-flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-2 h-2 rounded-full bg-primary"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </span>
              </span>
            ) : (
              translatedText || "Start speaking or signing to begin..."
            )}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OutputStage;
