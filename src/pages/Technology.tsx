import { motion } from "framer-motion";
import { Brain, Eye, Mic, Globe, Cpu, Layers } from "lucide-react";

const techs = [
  {
    icon: Mic,
    title: "Speech Recognition",
    desc: "Leveraging the Web Speech API for browser-native voice transcription. Continuous recognition with interim results provides real-time feedback as the user speaks.",
    details: ["Web Speech API", "Continuous recognition", "Interim results streaming", "Multi-language support"],
  },
  {
    icon: Eye,
    title: "Computer Vision",
    desc: "Camera-based hand tracking and gesture classification using MediaPipe Hands or TensorFlow.js for real-time sign language interpretation.",
    details: ["MediaPipe Hands", "21-point hand landmarks", "Gesture classification", "Real-time 30fps tracking"],
  },
  {
    icon: Brain,
    title: "Natural Language Processing",
    desc: "Automatic language detection and text analysis using character encoding patterns, n-gram frequency, and script detection algorithms.",
    details: ["Auto language detection", "Script identification", "Context analysis", "Tokenization"],
  },
  {
    icon: Globe,
    title: "Machine Translation",
    desc: "Neural machine translation supporting 30+ languages with context-aware output. Falls back to pattern-based translation for offline use.",
    details: ["Neural MT models", "30+ language pairs", "Context preservation", "Fallback offline mode"],
  },
  {
    icon: Cpu,
    title: "Text-to-Speech",
    desc: "Browser-native speech synthesis with customizable voice, rate, and pitch. Supports multiple language voices for natural-sounding output.",
    details: ["Web Speech Synthesis API", "Multiple voices per language", "Rate/pitch control", "Queue management"],
  },
  {
    icon: Layers,
    title: "System Architecture",
    desc: "Three-stage pipeline: Input Capture → AI Processing → Multi-Modal Output. All processing runs client-side for privacy and low latency.",
    details: ["Client-side processing", "Three-stage pipeline", "Modular design", "Privacy-preserving"],
  },
];

const Technology = () => (
  <div className="py-20 px-6">
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <span className="text-sm font-medium text-primary mb-3 block">Under the Hood</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-6">
          The technology <span className="gradient-text">powering SignBridge</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A convergence of Speech Recognition, Computer Vision, NLP, and Machine Translation — working together in real-time.
        </p>
      </motion.div>

      {/* Architecture diagram */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass rounded-2xl p-8 mb-20"
      >
        <h2 className="text-lg font-semibold text-foreground mb-6 text-center">Processing Pipeline</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          {["Input Capture", "Language Detection", "AI Translation", "Multi-Modal Output"].map((step, i) => (
            <div key={step} className="flex items-center gap-4">
              <div className={`px-6 py-3 rounded-xl text-sm font-medium text-center ${
                i === 2 ? "gradient-primary text-primary-foreground" : "bg-muted text-foreground"
              }`}>
                {step}
              </div>
              {i < 3 && <span className="hidden md:block text-muted-foreground text-xl">→</span>}
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {techs.map((tech, i) => (
          <motion.div
            key={tech.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-2xl p-8 hover:shadow-glow transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
              <tech.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-3">{tech.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{tech.desc}</p>
            <div className="flex flex-wrap gap-2">
              {tech.details.map((d) => (
                <span key={d} className="px-2.5 py-1 rounded-md bg-muted text-xs font-medium text-muted-foreground">
                  {d}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default Technology;
