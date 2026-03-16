import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Mic, Type, Hand, Globe, Zap, Shield } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const features = [
  { icon: Mic, title: "Speech Recognition", desc: "Real-time voice-to-text powered by Web Speech API" },
  { icon: Hand, title: "Sign Language", desc: "Camera-based gesture tracking and recognition" },
  { icon: Type, title: "Text Translation", desc: "Instant multilingual text translation" },
  { icon: Globe, title: "30+ Languages", desc: "Support for global and regional languages" },
  { icon: Zap, title: "Real-Time", desc: "Instant processing with zero perceptible delay" },
  { icon: Shield, title: "Privacy First", desc: "All processing happens locally in your browser" },
];

const Home = () => (
  <div className="overflow-hidden">
    {/* Hero */}
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 pt-20">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6"
        >
          <motion.div
            custom={0}
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-breathe" />
            AI-Powered Communication Platform
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]"
          >
            Breaking barriers{" "}
            <span className="gradient-text">between human communication</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            className="max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed"
          >
            SignBridge translates between speech, text, and sign language in real-time — enabling seamless communication for deaf, speech-impaired, and hearing individuals.
          </motion.p>

          <motion.div custom={3} variants={fadeUp} className="flex flex-wrap justify-center gap-4 mt-4">
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm shadow-glow hover:opacity-90 transition-opacity"
            >
              Try Live Demo <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/features"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl glass text-foreground font-semibold text-sm hover:bg-muted transition-colors"
            >
              Explore Features
            </Link>
          </motion.div>

          {/* Visual demo preview */}
          <motion.div
            custom={4}
            variants={fadeUp}
            className="mt-16 w-full max-w-4xl glass rounded-2xl p-1 shadow-glow"
          >
            <div className="rounded-xl bg-card/80 p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Mic, label: "Speech", sublabel: '"Hello, how are you?"' },
                { icon: Zap, label: "AI Processing", sublabel: "Translating..." },
                { icon: Type, label: "Text Output", sublabel: '"Hola, ¿cómo estás?"' },
              ].map((step, i) => (
                <motion.div
                  key={step.label}
                  className="flex flex-col items-center gap-3 p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + i * 0.3 }}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${i === 1 ? "gradient-primary" : "bg-muted"}`}>
                    <step.icon className={`h-5 w-5 ${i === 1 ? "text-primary-foreground" : "text-muted-foreground"}`} />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{step.label}</span>
                  <span className="text-xs text-muted-foreground font-mono">{step.sublabel}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* Features grid */}
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            One platform, every voice
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Bridging speech, text, and sign language with cutting-edge AI technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group glass rounded-2xl p-6 hover:shadow-glow transition-shadow duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center glass rounded-3xl p-12 lg:p-16 shadow-glow">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Ready to bridge communication?
        </h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
          Experience real-time translation between speech, text, and sign language — all in your browser.
        </p>
        <Link
          to="/demo"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-opacity"
        >
          Launch Demo <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  </div>
);

export default Home;
