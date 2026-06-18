import { motion } from "framer-motion";
import { Sparkles, Target, Cpu, Users, ChevronRight, Zap } from "lucide-react";

const stats = [
  { n: "500+", l: "Topics", icon: <Sparkles size={24} className="text-accent" /> },
  { n: "24/7",  l: "Coaching", icon: <Cpu size={24} className="text-primary" /> },
  { n: "98%",   l: "Accuracy", icon: <Target size={24} className="text-primary" /> },
  { n: "Elite", l: "Pedagogy", icon: <Zap size={24} className="text-accent" fill="currentColor" /> },
];

const team = [
  { initials: "JD", name: "John Doe",       role: "Founder & Architect",  color: "#1A237E" },
  { initials: "AS", name: "Alice Smith",    role: "AI Lead",             color: "#4852D9" },
  { initials: "BW", name: "Bob Wilson",     role: "Design Lead",         color: "#FFD700" },
];

function About() {
  return (
    <div className="min-h-screen bg-bg py-32 px-6 relative overflow-hidden">
      
      {/* Background Decorations */}
      <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px]"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-24">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[0.65rem] font-black tracking-widest uppercase mb-8"
            >
                <Sparkles size={14} className="text-accent" fill="currentColor" />
                The LinguaCoach Mission
            </motion.div>
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display text-6xl md:text-8xl font-black text-primary tracking-tight leading-[0.95] mb-10"
            >
                Reimagining How <br />
                The World <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Communicates.</span>
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-text-sec text-lg leading-relaxed max-w-2xl mx-auto"
            >
                LinguaCoach AI was built to bridge the gap between "knowing words" and "mastering communication." We use advanced AI to help you think, speak, and connect in any language.
            </motion.p>
        </div>

        {/* Vision Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-32">
            <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white border border-border p-12 rounded-[2.5rem] shadow-2xl shadow-primary/5"
            >
               <h3 className="text-2xl font-black text-primary mb-6 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-accent text-sm">01</div>
                 The Vision
               </h3>
               <p className="text-text-sec leading-relaxed text-lg">
                 Language is more than just grammar. It's the ability to articulate complex ideas and connect emotionally. Our vision is to provide every learner with an elite personal coach that's available 24/7.
               </p>
            </motion.div>
            <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white border border-border p-12 rounded-[2.5rem] shadow-2xl shadow-primary/5"
            >
               <h3 className="text-2xl font-black text-primary mb-6 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-accent text-sm">02</div>
                 The Technology
               </h3>
               <p className="text-text-sec leading-relaxed text-lg">
                 Powered by Gemini 1.5 Flash, our engine analyzes your logical flow, syntax, and persuasive impact. We don't just correct your errors; we help you refine your voice in any language you choose.
               </p>
            </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-32">
          {stats.map((s, i) => (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                key={s.l} 
                className="bg-white border border-border p-10 rounded-[2rem] text-center shadow-lg hover:shadow-primary/10 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-bg flex items-center justify-center mx-auto mb-6">
                {s.icon}
              </div>
              <div className="text-4xl font-black text-primary tracking-tight mb-2">{s.n}</div>
              <div className="text-[0.65rem] text-text-sec uppercase tracking-[0.2em] font-black">{s.l}</div>
            </motion.div>
          ))}
        </div>

        {/* Team Area */}
        <div className="text-center mb-16">
            <h3 className="font-display text-4xl font-black text-primary tracking-tight mb-4">Meet the Architects</h3>
            <p className="text-text-sec font-medium">The minds building the future of language learning.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {team.map((t, i) => (
            <motion.div 
                whileHover={{ y: -5 }}
                key={t.name} 
                className="bg-white border border-border p-10 rounded-[2.5rem] text-center shadow-xl shadow-primary/5 group"
            >
              <div 
                className="w-20 h-20 rounded-2xl mx-auto mb-8 flex items-center justify-center text-xl font-black transition-all group-hover:rotate-6 shadow-lg shadow-primary/10"
                style={{ backgroundColor: `${t.color}10`, color: t.color, border: `1px solid ${t.color}20` }}
              >
                {t.initials}
              </div>
              <h4 className="text-xl font-bold text-primary mb-2">{t.name}</h4>
              <p className="text-[0.65rem] text-text-sec uppercase tracking-[0.2em] font-black mb-6">{t.role}</p>
              <div className="flex justify-center">
                 <button className="text-primary hover:text-accent transition-colors"><ChevronRight size={20} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default About;