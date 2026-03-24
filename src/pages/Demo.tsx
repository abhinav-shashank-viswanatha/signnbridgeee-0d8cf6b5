import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Camera, Type, Volume2, Hand, ChevronDown, ArrowLeftRight, Loader2, Square, Play, Pause, RotateCcw } from "lucide-react";
import { translateText } from "@/utils/translate";

type InputMode = "text" | "speech" | "sign";
type OutputMode = "text" | "speech" | "sign";
type Status = "ready" | "listening" | "detecting" | "translating" | "processing" | "error";

const languageOptions = [
  { label: "English", code: "en" },
  { label: "Spanish", code: "es" },
  { label: "French", code: "fr" },
  { label: "German", code: "de" },
  { label: "Hindi", code: "hi" },
  { label: "Arabic", code: "ar" },
  { label: "Portuguese", code: "pt" },
  { label: "Russian", code: "ru" },
  { label: "Japanese", code: "ja" },
  { label: "Korean", code: "ko" },
  { label: "Italian", code: "it" },
  { label: "Dutch", code: "nl" },
  { label: "Turkish", code: "tr" },
  { label: "Chinese", code: "zh" },
  { label: "Indonesian", code: "id" },
];

const langCodeMap: Record<string, string> = {};
languageOptions.forEach((l) => { langCodeMap[l.label] = l.code; });

// Fallback local dictionary
const demoTranslations: Record<string, Record<string, string>> = {
  Spanish: {
    "hello": "hola", "hi": "hola", "thank you": "gracias", "thanks": "gracias", "bye": "adiós", "goodbye": "adiós",
    "good morning": "buenos días", "good afternoon": "buenas tardes", "good evening": "buenas tardes", "good night": "buenas noches",
    "how are you": "¿cómo estás?", "please": "por favor", "yes": "sí", "no": "no",
    "sorry": "lo siento", "excuse me": "disculpe", "welcome": "bienvenido", "help": "ayuda",
    "i love you": "te quiero", "friend": "amigo", "water": "agua", "food": "comida",
    "my name is": "mi nombre es", "nice to meet you": "encantado de conocerte", "see you later": "hasta luego",
    "i dont understand": "no entiendo", "can you help me": "¿puedes ayudarme?", "where is": "¿dónde está?",
  },
  French: {
    "hello": "bonjour", "hi": "salut", "thank you": "merci", "thanks": "merci", "bye": "au revoir", "goodbye": "au revoir",
    "good morning": "bonjour", "good afternoon": "bon après-midi", "good evening": "bonsoir", "good night": "bonne nuit",
    "how are you": "comment allez-vous?", "please": "s'il vous plaît", "yes": "oui", "no": "non",
    "sorry": "désolé", "excuse me": "excusez-moi", "welcome": "bienvenue", "help": "aide",
    "i love you": "je t'aime", "friend": "ami", "water": "eau", "food": "nourriture",
  },
  Hindi: {
    "hello": "नमस्ते", "hi": "नमस्ते", "thank you": "धन्यवाद", "thanks": "शुक्रिया", "bye": "अलविदा", "goodbye": "अलविदा",
    "good morning": "सुप्रभात", "good afternoon": "शुभ अपराह्न", "good evening": "शुभ संध्या", "good night": "शुभ रात्रि",
    "how are you": "आप कैसे हैं?", "please": "कृपया", "yes": "हाँ", "no": "नहीं",
    "sorry": "माफ़ कीजिए", "excuse me": "क्षमा करें", "welcome": "स्वागत है", "help": "मदद",
    "i love you": "मैं तुमसे प्यार करता हूँ", "friend": "दोस्त", "water": "पानी", "food": "खाना",
  },
  German: {
    "hello": "hallo", "hi": "hallo", "thank you": "danke", "thanks": "danke", "bye": "tschüss", "goodbye": "auf wiedersehen",
    "good morning": "guten morgen", "good afternoon": "guten tag", "good evening": "guten abend", "good night": "gute nacht",
    "how are you": "wie geht es ihnen?", "please": "bitte", "yes": "ja", "no": "nein",
    "sorry": "entschuldigung", "welcome": "willkommen", "help": "hilfe", "i love you": "ich liebe dich",
  },
  Arabic: {
    "hello": "مرحبا", "hi": "أهلاً", "thank you": "شكرا", "thanks": "شكرا", "bye": "مع السلامة", "goodbye": "مع السلامة",
    "good morning": "صباح الخير", "good afternoon": "مساء الخير", "good evening": "مساء الخير", "good night": "تصبح على خير",
    "how are you": "كيف حالك؟", "please": "من فضلك", "yes": "نعم", "no": "لا",
    "sorry": "آسف", "welcome": "أهلاً وسهلاً", "help": "مساعدة", "i love you": "أحبك",
  },
  Japanese: {
    "hello": "こんにちは", "hi": "やあ", "thank you": "ありがとう", "thanks": "ありがとう", "bye": "さようなら", "goodbye": "さようなら",
    "good morning": "おはようございます", "good afternoon": "こんにちは", "good evening": "こんばんは", "good night": "おやすみなさい",
    "how are you": "お元気ですか？", "please": "お願いします", "yes": "はい", "no": "いいえ",
    "sorry": "すみません", "welcome": "ようこそ", "help": "助けて", "i love you": "愛してる",
  },
  Korean: {
    "hello": "안녕하세요", "hi": "안녕", "thank you": "감사합니다", "thanks": "고마워요", "bye": "안녕히 가세요", "goodbye": "안녕히 가세요",
    "good morning": "좋은 아침", "good afternoon": "좋은 오후", "good evening": "좋은 저녁", "good night": "안녕히 주무세요",
    "how are you": "어떻게 지내세요?", "please": "제발", "yes": "네", "no": "아니요",
    "sorry": "죄송합니다", "welcome": "환영합니다", "help": "도와주세요", "i love you": "사랑해요",
  },
};

const localTranslate = (text: string, targetLang: string): string | null => {
  const dict = demoTranslations[targetLang];
  if (!dict) return null;
  const lower = text.toLowerCase().replace(/[?.!,]/g, "").trim();
  return dict[lower] || null;
};

const signGestureSequence = [
  { emoji: "👋", word: "Hello", delay: 0 },
  { emoji: "🙏", word: "Thank you", delay: 1 },
  { emoji: "👍", word: "Yes", delay: 2 },
  { emoji: "✋", word: "No", delay: 3 },
  { emoji: "🤲", word: "Please", delay: 4 },
  { emoji: "🆘", word: "Help", delay: 5 },
  { emoji: "❤️", word: "Love", delay: 6 },
  { emoji: "👊", word: "Strong", delay: 7 },
];

// ----- MediaPipe helpers -----
const MEDIAPIPE_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe";

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

async function loadMediaPipe() {
  await loadScript(`${MEDIAPIPE_CDN}/hands/hands.min.js`);
  await loadScript(`${MEDIAPIPE_CDN}/camera_utils/camera_utils.js`);
}

function detectGesture(landmarks: any[]): string {
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const middleTip = landmarks[12];
  const ringTip = landmarks[16];
  const pinkyTip = landmarks[20];
  const wrist = landmarks[0];

  const indexUp = indexTip.y < landmarks[6].y;
  const middleUp = middleTip.y < landmarks[10].y;
  const ringUp = ringTip.y < landmarks[14].y;
  const pinkyUp = pinkyTip.y < landmarks[18].y;

  const thumbIndexDist = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);

  // 👍 YES — thumb up, all fingers curled
  if (thumbTip.y < wrist.y && !indexUp && !middleUp && !ringUp && !pinkyUp) {
    return "Yes";
  }

  // ✋ HELLO — open palm, all fingers up
  if (indexUp && middleUp && ringUp && pinkyUp) {
    return "Hello";
  }

  // ✌️ PEACE — index + middle up only
  if (indexUp && middleUp && !ringUp && !pinkyUp) {
    return "Peace";
  }

  // ✊ STOP — fist, no fingers up
  if (!indexUp && !middleUp && !ringUp && !pinkyUp) {
    return "Stop";
  }

  // ☝️ ONE — index finger only
  if (indexUp && !middleUp && !ringUp && !pinkyUp) {
    return "One";
  }

  // 👌 OK — thumb + index close together
  if (thumbIndexDist < 0.05) {
    return "OK";
  }

  // 🤟 LOVE — index + pinky up, middle + ring down
  if (indexUp && !middleUp && !ringUp && pinkyUp) {
    return "Love";
  }

  // 🤚 HI — index + middle + ring up, pinky down
  if (indexUp && middleUp && ringUp && !pinkyUp) {
    return "Hi";
  }

  return "";
}

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
  const [errorMsg, setErrorMsg] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [signAnimIndex, setSignAnimIndex] = useState(0);
  const [translationSource, setTranslationSource] = useState<"api" | "local" | "">("");
  const [mediaPipeLoaded, setMediaPipeLoaded] = useState(false);
  const [detectedGesture, setDetectedGesture] = useState("");

  const recognitionRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const handsRef = useRef<any>(null);
  const mpCameraRef = useRef<any>(null);
  const isTranslatingRef = useRef(false);
  const gestureTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Translation API via backend
  const apiTranslate = async (text: string, targetLangLabel: string): Promise<string> => {
    const targetCode = langCodeMap[targetLangLabel] || "es";
    const result = await translateText(text, targetCode);
    console.log("Translation API response:", result);
    if (result === "Translation failed") throw new Error(result);
    return result;
  };

  // Speech recognition
  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setTranscript("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = langCodeMap[sourceLang] || "en-US";

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

    recognition.onerror = () => setStatus("ready");
    recognition.onend = () => setStatus("ready");

    recognitionRef.current = recognition;
    recognition.start();
    setStatus("listening");
    setTranscript("");
    setTranslatedText("");
    setErrorMsg("");
  }, [sourceLang]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setStatus("ready");
  }, []);

  // Camera with MediaPipe Hands
  const startCamera = useCallback(async () => {
    try {
      // Load MediaPipe if not already loaded
      if (!mediaPipeLoaded) {
        setStatus("processing");
        try {
          await loadMediaPipe();
          setMediaPipeLoaded(true);
        } catch (e) {
          console.warn("MediaPipe load failed, using simulated detection", e);
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 640, height: 480 } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStatus("detecting");

      // Try to initialize MediaPipe Hands
      const mpHands = (window as any).Hands;
      const mpCamera = (window as any).Camera;

      if (mpHands && mpCamera && videoRef.current) {
        const hands = new mpHands({
          locateFile: (file: string) => `${MEDIAPIPE_CDN}/hands/${file}`,
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.7,
        });

        hands.onResults((results: any) => {
          // Draw hand landmarks on canvas
          if (canvasRef.current && videoRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) {
              canvasRef.current.width = videoRef.current.videoWidth || 640;
              canvasRef.current.height = videoRef.current.videoHeight || 480;
              ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

              if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                const landmarks = results.multiHandLandmarks[0];

                // Draw connections
                ctx.strokeStyle = "hsl(var(--primary))";
                ctx.lineWidth = 2;
                const connections = [
                  [0,1],[1,2],[2,3],[3,4],
                  [0,5],[5,6],[6,7],[7,8],
                  [5,9],[9,10],[10,11],[11,12],
                  [9,13],[13,14],[14,15],[15,16],
                  [13,17],[17,18],[18,19],[19,20],
                  [0,17]
                ];
                connections.forEach(([a,b]) => {
                  ctx.beginPath();
                  ctx.moveTo(landmarks[a].x * canvasRef.current!.width, landmarks[a].y * canvasRef.current!.height);
                  ctx.lineTo(landmarks[b].x * canvasRef.current!.width, landmarks[b].y * canvasRef.current!.height);
                  ctx.stroke();
                });

                // Draw points
                landmarks.forEach((lm: any) => {
                  ctx.beginPath();
                  ctx.arc(lm.x * canvasRef.current!.width, lm.y * canvasRef.current!.height, 4, 0, 2 * Math.PI);
                  ctx.fillStyle = "hsl(var(--primary))";
                  ctx.fill();
                });

                // Detect gesture
                const gesture = detectGesture(landmarks);
                setDetectedGesture(gesture);
                setTranscript(gesture);

                // Auto-translate after gesture is stable for 2 seconds
                if (gestureTimeoutRef.current) clearTimeout(gestureTimeoutRef.current);
                gestureTimeoutRef.current = setTimeout(() => {
                  setInputText(gesture);
                }, 1500);
              }
            }
          }
        });

        handsRef.current = hands;

        const camera = new mpCamera(videoRef.current, {
          onFrame: async () => {
            if (handsRef.current && videoRef.current) {
              await handsRef.current.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480,
        });

        mpCameraRef.current = camera;
        camera.start();
      } else {
        // Fallback: simulated gesture detection if MediaPipe fails to load
        console.log("Using simulated sign detection (MediaPipe not available)");
        const gestures = ["Hello", "Thank you", "Yes", "No", "Please", "Help"];
        let idx = 0;
        const interval = setInterval(() => {
          const gesture = gestures[idx % gestures.length];
          setDetectedGesture(gesture);
          setTranscript(gesture);
          idx++;
        }, 3000);
        // Store interval for cleanup
        (streamRef.current as any).__fallbackInterval = interval;
      }
    } catch {
      setTranscript("Camera access denied or not available.");
      setStatus("ready");
    }
  }, [mediaPipeLoaded]);

  const stopCamera = useCallback(() => {
    if (mpCameraRef.current) {
      try { mpCameraRef.current.stop(); } catch {}
      mpCameraRef.current = null;
    }
    if (handsRef.current) {
      try { handsRef.current.close(); } catch {}
      handsRef.current = null;
    }
    if (streamRef.current) {
      if ((streamRef.current as any).__fallbackInterval) {
        clearInterval((streamRef.current as any).__fallbackInterval);
      }
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (gestureTimeoutRef.current) clearTimeout(gestureTimeoutRef.current);
    setDetectedGesture("");
    setStatus("ready");
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      if (streamRef.current) {
        if ((streamRef.current as any).__fallbackInterval) clearInterval((streamRef.current as any).__fallbackInterval);
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (mpCameraRef.current) try { mpCameraRef.current.stop(); } catch {}
      if (handsRef.current) try { handsRef.current.close(); } catch {}
      if (gestureTimeoutRef.current) clearTimeout(gestureTimeoutRef.current);
      speechSynthesis.cancel();
    };
  }, []);

  // Sign animation cycling
  useEffect(() => {
    if (outputMode === "sign" && translatedText) {
      const interval = setInterval(() => {
        setSignAnimIndex((prev) => (prev + 1) % signGestureSequence.length);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [outputMode, translatedText]);

  // Translation pipeline
  const handleTranslate = useCallback(async () => {
    if (isTranslatingRef.current) return;
    const textToTranslate = inputMode === "text" ? inputText : transcript;
    if (!textToTranslate.trim()) {
      setErrorMsg("Enter text first");
      setStatus("error");
      setTimeout(() => setStatus("ready"), 2000);
      return;
    }
    if (!navigator.onLine) {
      setErrorMsg("No internet connection");
      setStatus("error");
      setTimeout(() => setStatus("ready"), 2000);
      return;
    }

    isTranslatingRef.current = true;
    setStatus("translating");
    setErrorMsg("");
    setTranslatedText("");

    try {
      const result = await apiTranslate(textToTranslate, targetLang);
      setTranslatedText(result);
      setTranslationSource("api");
      setStatus("ready");
      if (outputMode === "speech") speakText(result);
    } catch {
      const localResult = localTranslate(textToTranslate, targetLang);
      if (localResult) {
        setTranslatedText(localResult);
        setTranslationSource("local");
        setStatus("ready");
        if (outputMode === "speech") speakText(localResult);
      } else {
        setErrorMsg("Translation failed. Try again.");
        setStatus("error");
        setTimeout(() => setStatus("ready"), 2000);
      }
    } finally {
      isTranslatingRef.current = false;
    }
  }, [inputMode, inputText, transcript, sourceLang, targetLang, outputMode]);

  const speakText = (text: string) => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    const targetCode = langCodeMap[targetLang];
    if (targetCode) utterance.lang = targetCode;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    } else if (translatedText) {
      speakText(translatedText);
    }
  };

  const handleSwapLangs = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };

  const handleReset = () => {
    setInputText("");
    setTranscript("");
    setTranslatedText("");
    setErrorMsg("");
    setStatus("ready");
    setTranslationSource("");
    setDetectedGesture("");
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const statusConfig: Record<Status, { color: string; label: string }> = {
    ready: { color: "bg-muted-foreground", label: "Ready" },
    listening: { color: "bg-primary", label: "Listening..." },
    detecting: { color: "bg-primary", label: "Detecting signs..." },
    translating: { color: "bg-accent", label: "Translating..." },
    processing: { color: "bg-secondary", label: "Loading MediaPipe..." },
    error: { color: "bg-destructive", label: "Error" },
  };

  const currentStatus = statusConfig[status];
  const canTranslate = (inputMode === "text" ? inputText.trim() : transcript.trim()) && status !== "translating";

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
                  {languageOptions.map((l) => (
                    <button key={l.code} onClick={() => { setSourceLang(l.label); setShowSourceDropdown(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${l.label === sourceLang ? "text-primary font-medium" : "text-foreground"}`}
                    >
                      {l.label}
                      <span className="ml-2 text-muted-foreground text-xs">{l.code}</span>
                    </button>
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
                  {languageOptions.map((l) => (
                    <button key={l.code} onClick={() => { setTargetLang(l.label); setShowTargetDropdown(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${l.label === targetLang ? "text-primary font-medium" : "text-foreground"}`}
                    >
                      {l.label}
                      <span className="ml-2 text-muted-foreground text-xs">{l.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </motion.div>

        {/* Error message */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex justify-center mb-6"
            >
              <div className="px-4 py-2 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
                {errorMsg}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                    setErrorMsg("");
                    setDetectedGesture("");
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all ${
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
                      placeholder="Start typing here... e.g. Hello, Thank you, Good morning"
                      className="flex-1 min-h-[180px] p-4 rounded-xl bg-card text-foreground text-base resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/50 transition-shadow"
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleTranslate(); } }}
                      disabled={status === "translating"}
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        Press <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[11px]">Enter</kbd> to translate
                      </p>
                      {inputText && (
                        <span className="text-xs text-muted-foreground">{inputText.length} chars</span>
                      )}
                    </div>
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
                      disabled={status === "translating"}
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                        status === "listening"
                          ? "gradient-primary shadow-glow animate-pulse-ring"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {status === "listening" ? <MicOff className="h-6 w-6 text-primary-foreground" /> : <Mic className="h-6 w-6 text-muted-foreground" />}
                    </button>
                    <p className="text-sm text-muted-foreground">
                      {status === "listening" ? "Listening — tap to stop" : "Tap the microphone to start"}
                    </p>
                    {transcript && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full p-4 rounded-xl bg-card text-foreground text-sm"
                      >
                        <span className="text-xs text-muted-foreground block mb-1">Transcript:</span>
                        {transcript}
                      </motion.div>
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
                      <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full pointer-events-none"
                      />
                      {!streamRef.current && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Camera className="h-10 w-10 text-muted-foreground/30" />
                        </div>
                      )}
                      {status === "detecting" && (
                        <>
                          <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-primary/80 text-primary-foreground text-xs font-mono flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                            LIVE
                          </div>
                          {detectedGesture && (
                            <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-background/80 text-foreground text-xs font-mono backdrop-blur-sm">
                              ✋ {detectedGesture}
                            </div>
                          )}
                          <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-md bg-background/70 text-foreground text-xs font-mono text-center backdrop-blur-sm">
                            {detectedGesture ? `Detected: "${detectedGesture}"` : "Detecting signs..."}
                          </div>
                        </>
                      )}
                    </div>
                    <button
                      onClick={status === "detecting" ? stopCamera : startCamera}
                      disabled={status === "translating" || status === "processing"}
                      className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        status === "detecting"
                          ? "gradient-primary text-primary-foreground shadow-glow"
                          : status === "processing"
                          ? "bg-muted text-muted-foreground cursor-wait"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                    >
                      {status === "processing" ? (
                        <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading MediaPipe...</span>
                      ) : status === "detecting" ? (
                        <span className="flex items-center gap-2"><Square className="h-4 w-4" /> Stop Camera</span>
                      ) : (
                        <span className="flex items-center gap-2"><Camera className="h-4 w-4" /> Start Camera</span>
                      )}
                    </button>
                    {transcript && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full p-4 rounded-xl bg-card text-foreground text-sm"
                      >
                        <span className="text-xs text-muted-foreground block mb-1">Detected gesture:</span>
                        {transcript}
                      </motion.div>
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
                  onClick={() => {
                    setOutputMode(tab.mode);
                    if (tab.mode === "speech" && translatedText) {
                      speakText(translatedText);
                    }
                    if (tab.mode !== "speech") {
                      speechSynthesis.cancel();
                      setIsSpeaking(false);
                    }
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all ${
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
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Translation Output — {outputMode}
                </span>
                {translationSource && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    translationSource === "api" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                  }`}>
                    {translationSource === "api" ? "API" : "Offline"}
                  </span>
                )}
              </div>

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
                        <div className="space-y-4">
                          <p className="text-2xl lg:text-3xl font-medium text-foreground leading-relaxed" style={{ textWrap: "balance" } as React.CSSProperties}>
                            {translatedText}
                          </p>
                          <div className="flex items-center gap-2 pt-2">
                            <button
                              onClick={() => speakText(translatedText)}
                              className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                              title="Listen"
                            >
                              <Volume2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => navigator.clipboard.writeText(translatedText)}
                              className="px-3 py-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-xs font-mono"
                              title="Copy"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      )}
                      {outputMode === "speech" && (
                        <div className="flex flex-col items-center gap-6">
                          <p className="text-xl font-medium text-foreground text-center">{translatedText}</p>
                          <div className="flex items-center justify-center gap-[2px] h-12">
                            {Array.from({ length: 32 }).map((_, i) => (
                              <motion.div
                                key={i}
                                className="w-[2px] rounded-full bg-primary"
                                animate={isSpeaking ? { height: [4, Math.random() * 32 + 8, 4], opacity: [0.3, 1, 0.3] } : { height: 4, opacity: 0.2 }}
                                transition={isSpeaking ? { duration: 0.4 + Math.random() * 0.4, repeat: Infinity, repeatType: "reverse", delay: i * 0.03 } : { duration: 0.3 }}
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={toggleSpeech}
                              className="px-6 py-3 rounded-xl gradient-primary text-primary-foreground font-medium flex items-center gap-2 shadow-glow hover:opacity-90 transition-opacity"
                            >
                              {isSpeaking ? <><Pause className="h-5 w-5" /> Pause</> : <><Play className="h-5 w-5" /> Play Audio</>}
                            </button>
                          </div>
                        </div>
                      )}
                      {outputMode === "sign" && (
                        <div className="flex flex-col items-center gap-6">
                          <div className="relative">
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={signAnimIndex}
                                initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
                                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                                exit={{ scale: 0.5, opacity: 0, rotateY: 90 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="text-7xl"
                              >
                                {signGestureSequence[signAnimIndex].emoji}
                              </motion.div>
                            </AnimatePresence>
                          </div>
                          <p className="text-lg font-medium text-foreground">{translatedText}</p>
                          <div className="flex items-center gap-2">
                            {signGestureSequence.slice(0, 6).map((g, i) => (
                              <motion.span
                                key={i}
                                className={`text-2xl cursor-pointer transition-opacity ${i === signAnimIndex % 6 ? "opacity-100" : "opacity-30"}`}
                                whileHover={{ scale: 1.2 }}
                                onClick={() => setSignAnimIndex(i)}
                              >
                                {g.emoji}
                              </motion.span>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">Sign language gesture sequence</p>
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
            disabled={!canTranslate}
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
