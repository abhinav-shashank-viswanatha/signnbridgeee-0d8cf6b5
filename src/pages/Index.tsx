import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StatusIndicator from "@/components/signbridge/StatusIndicator";
import LanguageSelector from "@/components/signbridge/LanguageSelector";
import ActionButton from "@/components/signbridge/ActionButton";
import AudioVisualizer from "@/components/signbridge/AudioVisualizer";
import CameraFeed from "@/components/signbridge/CameraFeed";
import TextInput from "@/components/signbridge/TextInput";
import OutputStage from "@/components/signbridge/OutputStage";

type Mode = "speech" | "sign" | "text";
type AppState = "idle" | "listening" | "analyzing" | "translating";

const demoTranslations: Record<string, string> = {
  "Hello, how are you?": "Hola, ¿cómo estás?",
  "Thank you very much": "Muchas gracias",
  "Good morning": "Buenos días",
  "Nice to meet you": "Encantado de conocerte",
};

const Index = () => {
  const [mode, setMode] = useState<Mode>("speech");
  const [appState, setAppState] = useState<AppState>("idle");
  const [sourceLang, setSourceLang] = useState("English");
  const [targetLang, setTargetLang] = useState("Spanish");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  const simulateTranslation = useCallback((input?: string) => {
    setIsTranslating(true);
    setAppState("translating");
    
    setTimeout(() => {
      if (input && demoTranslations[input]) {
        setTranslatedText(demoTranslations[input]);
      } else if (input) {
        setTranslatedText(`[${targetLang}] ${input}`);
      } else if (mode === "speech") {
        setTranslatedText("Hola, ¿cómo puedo ayudarte hoy?");
      } else if (mode === "sign") {
        setTranslatedText("Hello, I understand your sign language.");
      }
      setIsTranslating(false);
      setAppState("idle");
    }, 1800);
  }, [mode, targetLang]);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setAppState("idle");
    setTranslatedText("");
  };

  const handleSpeechToggle = () => {
    if (appState === "listening") {
      setAppState("idle");
      simulateTranslation();
    } else {
      setAppState("listening");
      // Auto-stop after 3s demo
      setTimeout(() => {
        setAppState("idle");
        simulateTranslation();
      }, 3000);
    }
  };

  const handleSignToggle = () => {
    if (appState === "analyzing") {
      setAppState("idle");
      simulateTranslation();
    } else {
      setAppState("analyzing");
      setTimeout(() => {
        setAppState("idle");
        simulateTranslation();
      }, 3500);
    }
  };

  const handleTextSubmit = (text: string) => {
    simulateTranslation(text);
  };

  const handleInputClick = () => {
    if (mode === "speech") handleSpeechToggle();
    else if (mode === "sign") handleSignToggle();
  };

  return (
    <div className="min-h-svh bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="px-6 lg:px-8 py-5 flex justify-between items-center border-b border-border">
        <h1 className="text-xl font-semibold tracking-tight">SignBridge</h1>
        <div className="flex items-center gap-3">
          <StatusIndicator state={appState} />
          <div className="hidden sm:block">
            <LanguageSelector
              source={sourceLang}
              target={targetLang}
              onSourceChange={setSourceLang}
              onTargetChange={setTargetLang}
            />
          </div>
        </div>
      </header>

      {/* Mobile language selector */}
      <div className="sm:hidden px-6 py-3 border-b border-border flex justify-center">
        <LanguageSelector
          source={sourceLang}
          target={targetLang}
          onSourceChange={setSourceLang}
          onTargetChange={setTargetLang}
        />
      </div>

      {/* Main Stage */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 lg:p-8">
        {/* Input Stage */}
        <motion.section
          layout
          className="relative rounded-2xl bg-card overflow-hidden shadow-card min-h-[300px] lg:min-h-[400px] cursor-pointer"
          onClick={mode !== "text" ? handleInputClick : undefined}
          whileHover={mode !== "text" ? { scale: 1.005 } : undefined}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Active ring */}
          {(appState === "listening" || appState === "analyzing") && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 rounded-2xl ring-2 ring-primary animate-breathe pointer-events-none z-10"
            />
          )}

          {/* Mode label */}
          <div className="absolute top-4 left-4 z-10">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              {mode === "speech" && "Speech Input"}
              {mode === "sign" && "Sign Language Input"}
              {mode === "text" && "Text Input"}
            </span>
          </div>

          {/* Tap hint */}
          {mode !== "text" && appState === "idle" && (
            <div className="absolute bottom-4 left-0 right-0 text-center z-10">
              <span className="text-xs text-muted-foreground">
                Tap to {mode === "speech" ? "start listening" : "start tracking"}
              </span>
            </div>
          )}

          <div className="pt-10 pb-8 h-full">
            <AnimatePresence mode="wait">
              {mode === "speech" && (
                <motion.div
                  key="speech"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <AudioVisualizer active={appState === "listening"} />
                </motion.div>
              )}
              {mode === "sign" && (
                <motion.div
                  key="sign"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <CameraFeed active={appState === "analyzing" || appState === "translating"} />
                </motion.div>
              )}
              {mode === "text" && (
                <motion.div
                  key="text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <TextInput active onSubmit={handleTextSubmit} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Output Stage */}
        <section className="rounded-2xl bg-background shadow-card min-h-[300px] lg:min-h-[400px]">
          <OutputStage translatedText={translatedText} isTranslating={isTranslating} />
        </section>
      </main>

      {/* Bottom Dock */}
      <nav className="px-6 lg:px-8 py-6 flex justify-center gap-3">
        <ActionButton icon="mic" label="Speech" active={mode === "speech"} onClick={() => handleModeChange("speech")} />
        <ActionButton icon="camera" label="Sign" active={mode === "sign"} onClick={() => handleModeChange("sign")} />
        <ActionButton icon="keyboard" label="Text" active={mode === "text"} onClick={() => handleModeChange("text")} />
      </nav>
    </div>
  );
};

export default Index;
