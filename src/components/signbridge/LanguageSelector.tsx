import { ChevronDown, ArrowLeftRight } from "lucide-react";
import { useState } from "react";

const languages = ["English", "ASL", "Spanish", "French", "Arabic", "Mandarin"];

interface LanguageSelectorProps {
  source: string;
  target: string;
  onSourceChange: (lang: string) => void;
  onTargetChange: (lang: string) => void;
}

const LanguageSelector = ({ source, target, onSourceChange, onTargetChange }: LanguageSelectorProps) => {
  const [showSource, setShowSource] = useState(false);
  const [showTarget, setShowTarget] = useState(false);

  const handleSwap = () => {
    onSourceChange(target);
    onTargetChange(source);
  };

  return (
    <div className="flex items-center gap-1">
      <div className="relative">
        <button
          onClick={() => { setShowSource(!showSource); setShowTarget(false); }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-foreground hover:bg-card transition-colors duration-200"
        >
          {source}
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
        {showSource && (
          <div className="absolute top-full mt-1 left-0 z-50 bg-background shadow-card rounded-lg py-1 min-w-[140px]">
            {languages.map((l) => (
              <button
                key={l}
                onClick={() => { onSourceChange(l); setShowSource(false); }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-card transition-colors ${l === source ? "text-primary font-medium" : "text-foreground"}`}
              >
                {l}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleSwap}
        className="p-1.5 rounded-md hover:bg-card transition-colors duration-200 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftRight className="h-3.5 w-3.5" />
      </button>

      <div className="relative">
        <button
          onClick={() => { setShowTarget(!showTarget); setShowSource(false); }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-foreground hover:bg-card transition-colors duration-200"
        >
          {target}
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
        {showTarget && (
          <div className="absolute top-full mt-1 right-0 z-50 bg-background shadow-card rounded-lg py-1 min-w-[140px]">
            {languages.map((l) => (
              <button
                key={l}
                onClick={() => { onTargetChange(l); setShowTarget(false); }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-card transition-colors ${l === target ? "text-primary font-medium" : "text-foreground"}`}
              >
                {l}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;
