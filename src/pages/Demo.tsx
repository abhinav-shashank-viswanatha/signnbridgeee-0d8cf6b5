import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Camera, Type, Volume2, Hand, ChevronDown, ArrowLeftRight, Loader2, Square } from "lucide-react";

type InputMode = "text" | "speech" | "sign";
type OutputMode = "text" | "speech" | "sign";
type Status = "ready" | "listening" | "detecting" | "translating";

const languages = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese",
  "Arabic", "Hindi", "Bengali", "Tamil", "Telugu", "Mandarin",
  "Japanese", "Korean", "Russian", "Dutch", "Turkish", "Vietnamese",
  "Thai", "Indonesian", "Malay", "Swahili", "Urdu", "Punjabi",
  "Marathi", "Gujarati", "Kannada", "Malayalam", "ASL",
];

// Simple demo translations
const demoTranslations: Record<string, Record<string, string>> = {
  Spanish: { "hello": "hola", "thank you": "gracias", "good morning": "buenos días", "how are you": "¿cómo estás?", "goodbye": "adiós", "please": "por favor", "yes": "sí", "no": "no" },
  French: { "hello": "bonjour", "thank you": "merci", "good morning": "bonjour", "how are you": "comment allez-vous?", "goodbye": "au revoir", "please": "s'il vous plaît", "yes": "oui", "no": "non" },
  Hindi: { "hello": "नमस्ते", "thank you": "धन्यवाद", "good morning": "सुप्रभात", "how are you": "आप कैसे हैं?", "goodbye": "अलविदा", "please": "कृपया", "yes": "हाँ", "no": "नहीं" },
  Arabic: { "hello": "مرحبا", "thank you": "شكرا", "good morning": "صباح الخير", "how are you": "كيف حالك؟", "goodbye": "مع السلامة" },
  German: { "hello": "hallo", "thank you": "danke", "good morning": "guten morgen", "how are you": "wie geht es ihnen?", "goodbye": "auf wiedersehen" },
  Japanese: { "hello": "こんにちは", "thank you": "ありがとう", "good morning": "おはようございます", "how are you": "お元気ですか？" },
  Korean: { "hello": "안녕하세요", "thank you": "감사합니다", "good morning": "좋은 아침", "how are you": "어떻게 지내세요?" },
};

const simpleTranslate = (text: string, targetLang: string): string => {
  const dict = demoTranslations[targetLang];
  if (!dict) return `[${targetLang}] ${text}`;
  const lower = text.toLowerCase().replace(/[?.!,]/g, "").trim();
  return dict[lower] || `[${targetLang}] ${text}`;
};

const signGestures = ["Hello 👋", "Thank you 🙏", "Yes 👍", "No ✋", "Please 🤲", "Help 🆘"];

const Demo = () => {
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [outputMode, setOutputMode] = useState<OutputMode>("text");
  const [sourceLang, setSourceLang] = useState("English");
  const [targetLang, setTargetLang] = useState("Spanish");
  const [status, setStatus] = useState<Status>("ready");
  const [inputText, setInputText] = useState("");
  const [transcript, setTranscript] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showTargetDropdown, setShowTargetDropdown] = useState(false);

  const recognitionRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Web Speech API
  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setTranscript("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      let interimTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onerror = () => {
      setStatus("ready");
    };

    recognition.onend = () => {
      setStatus("ready");
    };

    recognitionRef.current = recognition;
    recognition.start();
    setStatus("listening");
    setTranscript("");
    setTranslatedText("");
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setStatus("ready");
  }, []);

  // Camera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStatus("detecting");
      // Simulate sign detection
      const interval = setInterval(() => {
        const gesture = signGestures[Math.floor(Math.random() * signGestures.length)];
        setTranscript(gesture);
      }, 3000);
      return () => clearInterval(interval);
    } catch {
      setTranscript("Camera access denied or not available.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStatus("ready");
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // Translation
  const handleTranslate = useCallback(() => {
    const textToTranslate = inputMode === "text" ? inputText : transcript;
    if (!textToTranslate.trim()) return;

    setStatus("translating");
    setTimeout(() => {
      const result = simpleTranslate(textToTranslate, targetLang);
      setTranslatedText(result);
      setStatus("ready");

      if (outputMode === "speech") {
        const utterance = new SpeechSynthesisUtterance(result);
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
      }
    }, 800);
  }, [inputMode, inputText, transcript, targetLang, outputMode]);

  const handleSwapLangs = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };

  const statusConfig: Record<Status, { color: string; label: string }> = {
    ready: { color: "bg-muted-foreground", label: "Ready" },
    listening: { color: "bg-primary", label: "Listening..." },
    detecting: { color: "bg-primary", label: "Detecting signs..." },
    translating: { color: "bg-accent-live", label: "Translating..." },
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="py-12 px-6 min-h-[calc(100svh-4rem)]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
            Live Translation Demo
          </h1>
          <p className="text-muted-foreground">
            Speak, type, or sign — and get instant translations in any mode.
          </p>
        </motion.div>

        {/* Status + Language bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-8"
        >
          {/* Status */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass font-mono text-xs">
            <span className="relative flex h-2 w-2">
              {status !== "ready" && <span className={`absolute inset-0 rounded-full ${currentStatus.color} animate-pulse-ring`} />}
              <span className={`relative rounded-full h-2 w-2 ${currentStatus.color} ${status !== "ready" ? "animate-breathe" : "opacity-40"}`} />
            </span>
            <span className="text-muted-foreground">{currentStatus.label}</span>
          </div>

          {/* Language selector */}
          <div className="flex items-center gap-1">
            <div className="relative">
              <button
                onClick={() => { setShowSourceDropdown(!showSourceDropdown); setShowTargetDropdown(false); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg glass text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                {sourceLang} <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              {showSourceDropdown && (
                <div className="absolute top-full mt-1 left-0 z-50 glass-strong rounded-xl py-2 min-w-[160px] max-h-64 overflow-y-auto shadow-card">
                  {languages.map((l) => (
                    <button key={l} onClick={() => { setSourceLang(l); setShowSourceDropdown(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${l === sourceLang ? "text-primary font-medium" : "text-foreground"}`}
                    >{l}</button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={handleSwapLangs} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeftRight className="h-4 w-4" />
            </button>
            <div className="relative">
              <button
                onClick={() => { setShowTargetDropdown(!showTargetDropdown); setShowSourceDropdown(false); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg glass text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                {targetLang} <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              {showTargetDropdown && (
                <div className="absolute top-full mt-1 right-0 z-50 glass-strong rounded-xl py-2 min-w-[160px] max-h-64 overflow-y-auto shadow-card">
                  {languages.map((l) => (
                    <button key={l} onClick={() => { setTargetLang(l); setShowTargetDropdown(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${l === targetLang ? "text-primary font-medium" : "text-foreground"}`}
                    >{l}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Main panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* INPUT PANEL */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="glass rounded-2xl overflow-hidden"
          >
            {/* Input mode tabs */}
            <div className="flex border-b border-border">
              {([
                { mode: "text" as InputMode, icon: Type, label: "Text" },
                { mode: "speech" as InputMode, icon: Mic, label: "Speech" },
                { mode: "sign" as InputMode, icon: Camera, label: "Sign" },
              ]).map((tab) => (
                <button
                  key={tab.mode}
                  onClick={() => {
                    if (status === "listening") stopListening();
                    if (status === "detecting") stopCamera();
                    setInputMode(tab.mode);
                    setTranscript("");
                    setTranslatedText("");
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors ${
                    inputMode === tab.mode
                      ? "text-primary border-b-2 border-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Input content */}
            <div className="p-6 min-h-[300px] flex flex-col">
              <AnimatePresence mode="wait">
                {inputMode === "text" && (
                  <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col gap-4">
                    <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Type your message</label>
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Start typing here..."
                      className="flex-1 min-h-[180px] p-4 rounded-xl bg-card text-foreground text-base resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/50 transition-shadow"
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleTranslate(); } }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Press <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[11px]">Enter</kbd> to translate
                    </p>
                  </motion.div>
                )}

                {inputMode === "speech" && (
                  <motion.div key="speech" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center gap-6">
                    <div className="flex items-center justify-center gap-[3px] h-20">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-[3px] rounded-full bg-primary"
                          animate={status === "listening" ? { height: [8, Math.random() * 48 + 12, 8], opacity: [0.4, 1, 0.4] } : { height: 4, opacity: 0.15 }}
                          transition={status === "listening" ? { duration: 0.6 + Math.random() * 0.6, repeat: Infinity, repeatType: "reverse", delay: i * 0.04 } : { duration: 0.3 }}
                        />
                      ))}
                    </div>
                    <button
                      onClick={status === "listening" ? stopListening : startListening}
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                        status === "listening"
                          ? "gradient-primary shadow-glow"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {status === "listening" ? <MicOff className="h-6 w-6 text-primary-foreground" /> : <Mic className="h-6 w-6 text-muted-foreground" />}
                    </button>
                    <p className="text-sm text-muted-foreground">
                      {status === "listening" ? "Listening — tap to stop" : "Tap the microphone to start"}
                    </p>
                    {transcript && (
                      <div className="w-full p-4 rounded-xl bg-card text-foreground text-sm">
                        <span className="text-xs text-muted-foreground block mb-1">Transcript:</span>
                        {transcript}
                      </div>
                    )}
                  </motion.div>
                )}

                {inputMode === "sign" && (
                  <motion.div key="sign" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center gap-4">
                    <div className="relative w-full max-w-[320px] aspect-video rounded-xl bg-card overflow-hidden">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      {!streamRef.current && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Camera className="h-10 w-10 text-muted-foreground/30" />
                        </div>
                      )}
                      {status === "detecting" && (
                        <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-primary/80 text-primary-foreground text-xs font-mono">
                          LIVE
                        </div>
                      )}
                    </div>
                    <button
                      onClick={status === "detecting" ? stopCamera : startCamera}
                      className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        status === "detecting"
                          ? "gradient-primary text-primary-foreground shadow-glow"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                    >
                      {status === "detecting" ? (
                        <span className="flex items-center gap-2"><Square className="h-4 w-4" /> Stop Camera</span>
                      ) : (
                        <span className="flex items-center gap-2"><Camera className="h-4 w-4" /> Start Camera</span>
                      )}
                    </button>
                    {transcript && (
                      <div className="w-full p-4 rounded-xl bg-card text-foreground text-sm">
                        <span className="text-xs text-muted-foreground block mb-1">Detected gesture:</span>
                        {transcript}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* OUTPUT PANEL */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl overflow-hidden"
          >
            {/* Output mode tabs */}
            <div className="flex border-b border-border">
              {([
                { mode: "text" as OutputMode, icon: Type, label: "Text" },
                { mode: "speech" as OutputMode, icon: Volume2, label: "Speech" },
                { mode: "sign" as OutputMode, icon: Hand, label: "Sign" },
              ]).map((tab) => (
                <button
                  key={tab.mode}
                  onClick={() => setOutputMode(tab.mode)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors ${
                    outputMode === tab.mode
                      ? "text-primary border-b-2 border-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Output content */}
            <div className="p-6 min-h-[300px] flex flex-col">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">
                Translation Output — {outputMode}
              </span>

              <div className="flex-1 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {status === "translating" ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3">
                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                      <span className="text-sm text-muted-foreground">Translating...</span>
                    </motion.div>
                  ) : translatedText ? (
                    <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full">
                      {outputMode === "text" && (
                        <p className="text-2xl lg:text-3xl font-medium text-foreground leading-relaxed" style={{ textWrap: "balance" } as React.CSSProperties}>
                          {translatedText}
                        </p>
                      )}
                      {outputMode === "speech" && (
                        <div className="flex flex-col items-center gap-4">
                          <p className="text-xl font-medium text-foreground text-center">{translatedText}</p>
                          <button
                            onClick={() => {
                              const u = new SpeechSynthesisUtterance(translatedText);
                              u.rate = 0.9;
                              speechSynthesis.speak(u);
                            }}
                            className="px-6 py-3 rounded-xl gradient-primary text-primary-foreground font-medium flex items-center gap-2 shadow-glow hover:opacity-90 transition-opacity"
                          >
                            <Volume2 className="h-5 w-5" /> Play Audio
                          </button>
                        </div>
                      )}
                      {outputMode === "sign" && (
                        <div className="flex flex-col items-center gap-4">
                          <div className="text-6xl animate-float">🤟</div>
                          <p className="text-lg font-medium text-foreground">{translatedText}</p>
                          <p className="text-xs text-muted-foreground">Sign language animation representation</p>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.p key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl text-muted-foreground/40 text-center">
                      Translation will appear here...
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Translate button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex justify-center mt-8"
        >
          <button
            onClick={handleTranslate}
            disabled={status === "translating" || (!inputText.trim() && !transcript.trim())}
            className="px-10 py-4 rounded-xl gradient-primary text-primary-foreground font-semibold text-base shadow-glow hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {status === "translating" ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> Translating...</>
            ) : (
              <>Translate</>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Demo;
