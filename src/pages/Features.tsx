import { motion } from "framer-motion";
import { Mic, Camera, Type, Volume2, Globe, Brain, ArrowLeftRight, Accessibility, Shield, Zap } from "lucide-react";

const sections = [
  {
    title: "Input Modes",
    items: [
      { icon: Mic, name: "Speech Recognition", desc: "Real-time voice transcription using the Web Speech API. Speak naturally and see your words instantly converted to text, then translated to any target language." },
      { icon: Camera, name: "Sign Language Detection", desc: "Camera-based gesture recognition tracks hand movements and interprets sign language gestures. Supports American Sign Language with expandable vocabulary." },
      { icon: Type, name: "Text Input", desc: "Type in any supported language. Automatic language detection identifies the source language and translates it to your selected target." },
    ],
  },
  {
    title: "Output Modes",
    items: [
      { icon: Type, name: "Text Display", desc: "Clean, readable translated text output with support for bidirectional scripts and right-to-left languages." },
      { icon: Volume2, name: "Speech Synthesis", desc: "Text-to-speech output converts translated text into natural-sounding speech using browser synthesis or cloud voices." },
      { icon: Accessibility, name: "Sign Language Animation", desc: "Visual sign language representation of the translated text with animated gesture sequences." },
    ],
  },
  {
    title: "Platform Capabilities",
    items: [
      { icon: Globe, name: "30+ Languages", desc: "Support for English, Spanish, French, Arabic, Hindi, Mandarin, Japanese, Korean, and many more global and Indian languages." },
      { icon: ArrowLeftRight, name: "Two-Way Translation", desc: "Translate in any direction: Speech ↔ Text ↔ Sign. Every combination is supported for truly inclusive communication." },
      { icon: Brain, name: "AI-Powered NLP", desc: "Automatic language detection, context-aware translation, and intelligent text processing for natural results." },
      { icon: Zap, name: "Real-Time Processing", desc: "Instant translation with streaming results. No waiting — translations appear as fast as you speak or type." },
      { icon: Shield, name: "Privacy & Security", desc: "Speech recognition runs locally in your browser. No audio data is stored or transmitted to external servers." },
    ],
  },
];

const Features = () => (
  <div className="py-20 px-6">
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <span className="text-sm font-medium text-primary mb-3 block">Capabilities</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-6">
          Everything you need for <span className="gradient-text">inclusive communication</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A comprehensive suite of AI-powered tools designed to break every communication barrier.
        </p>
      </motion.div>

      {sections.map((section, si) => (
        <div key={section.title} className="mb-20">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-foreground mb-8"
          >
            {section.title}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.items.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-6 hover:shadow-glow transition-shadow duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{item.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Features;
