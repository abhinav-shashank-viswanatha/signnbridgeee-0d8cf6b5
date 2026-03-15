import { motion } from "framer-motion";
import { Heart, Target, Users, Building2 } from "lucide-react";

const useCases = [
  { icon: Building2, title: "Healthcare", desc: "Enable seamless communication between doctors and deaf or speech-impaired patients during consultations and emergencies." },
  { icon: Users, title: "Education", desc: "Create inclusive classrooms where deaf students can participate equally through real-time sign-to-text translation." },
  { icon: Building2, title: "Government Services", desc: "Make public services accessible to all citizens regardless of their communication abilities." },
  { icon: Heart, title: "Daily Life", desc: "Empower individuals with hearing or speech impairments to communicate freely in everyday situations." },
];

const About = () => (
  <div className="py-20 px-6">
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <span className="text-sm font-medium text-primary mb-3 block">Our Mission</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-6">
          Communication is a <span className="gradient-text">human right</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          SignBridge was built on a simple belief: no one should be excluded from a conversation because of how they communicate. We're using AI to make that belief a reality.
        </p>
      </motion.div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-8"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-3">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            To create a unified communication platform that enables seamless interaction between people who use speech, text, and sign language — breaking down barriers in healthcare, education, government, and daily life.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-8"
        >
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
            <Heart className="h-5 w-5 text-secondary" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-3">Our Vision</h2>
          <p className="text-muted-foreground leading-relaxed">
            A world where communication abilities are never a barrier to opportunity, understanding, or human connection. We envision SignBridge deployed in every hospital, school, and public service facility worldwide.
          </p>
        </motion.div>
      </div>

      {/* Use Cases */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Real-World Impact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {useCases.map((uc, i) => (
            <motion.div
              key={uc.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-6 hover:shadow-glow transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <uc.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">{uc.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{uc.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass rounded-2xl p-12 text-center"
      >
        <h2 className="text-2xl font-bold text-foreground mb-8">By the Numbers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { val: "466M+", label: "People with hearing loss globally" },
            { val: "30+", label: "Languages supported" },
            { val: "3", label: "Communication modes" },
            { val: "<500ms", label: "Translation latency" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold gradient-text mb-2">{s.val}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
);

export default About;
