const stats = [
  { n: "500+", l: "Topics", icon: "📝" },
  { n: "24/7",  l: "Available", icon: "⏰" },
  { n: "AI",    l: "Feedback", icon: "🧠" },
  { n: "Free",  l: "Early Access", icon: "🎁" },
];

const team = [
  { initials: "JD", name: "John Doe",       role: "Founder & Dev",  color: "var(--c-accent)" },
  { initials: "AS", name: "Alice Smith",    role: "AI & Research",  color: "var(--c-accent2)" },
  { initials: "BW", name: "Bob Wilson",     role: "Design & UX",    color: "var(--c-accent3)" },
];

function About() {
  return (
    <div className="animate-fadeUp min-h-screen flex flex-col items-center justify-center py-24 px-6">
      <div className="w-full max-w-[900px]">

        <div className="text-center mb-16">
            <div className="pill mb-6">About the project</div>
            <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] tracking-tight leading-[0.95] mb-8 text-t1 font-bold italic">
              BUILT FOR LEARNERS<br />WHO THINK <span className="gradient-text">DEEPER</span>
            </h1>
            <p className="text-t2 text-[1.1rem] leading-[1.8] max-w-[600px] mx-auto">
              Master any language through AI-powered critical thinking, 
              persuasive writing, and real-time coaching.
            </p>
        </div>

        <div className="glass-card p-12 mb-16">
            <div className="grid md:grid-cols-1 gap-10">
                <div>
                   <h3 className="text-xl font-bold text-t1 mb-4 flex items-center gap-3">
                     <span className="w-8 h-8 rounded-lg bg-acc/10 flex items-center justify-center text-acc text-sm">01</span>
                     Our Vision
                   </h3>
                   <p className="text-t2 text-[0.95rem] leading-[1.8] mb-6">
                     Language is more than just grammar and vocabulary. It's the ability to articulate complex ideas, 
                     defend positions, and connect emotionally with others. We built this tool to bridge the 
                     gap between "knowing words" and "mastering communication."
                   </p>
                </div>
                <div>
                   <h3 className="text-xl font-bold text-t1 mb-4 flex items-center gap-3">
                     <span className="w-8 h-8 rounded-lg bg-acc2/10 flex items-center justify-center text-acc2 text-sm">02</span>
                     AI Powered
                   </h3>
                   <p className="text-t2 text-[0.95rem] leading-[1.8]">
                     Using state-of-the-art models like Gemini 1.5 Flash, our coach analyzes not just your 
                     syntax, but the logical flow and persuasive impact of your speech. It's like having 
                      a professional rhetoric coach in your pocket 24/7.
                   </p>
                </div>
            </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 my-20">
          {stats.map((s) => (
            <div key={s.l} className="glass-card py-10 px-4 text-center group hover:bg-glow transition-all">
              <div className="text-[2rem] mb-3 group-hover:scale-110 transition-transform">{s.icon}</div>
              <div className="font-display text-[2.5rem] text-t1 tracking-tight font-bold italic">{s.n}</div>
              <div className="text-[0.65rem] text-t3 uppercase tracking-[2px] mt-2 font-bold">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Team Area Centralized */}
        <div className="text-center mb-12">
            <h3 className="font-display text-[2rem] tracking-tight mb-2 text-t1 font-bold italic">Meet the Architects</h3>
            <p className="text-t3 text-sm">The minds behind the AI Language Coach</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {team.map((t) => (
            <div key={t.initials} className="glass-card p-8 text-center group">
              <div 
                className="w-16 h-16 rounded-2xl flex-shrink-0 mx-auto mb-6 flex items-center justify-center text-lg font-bold transition-all group-hover:rotate-6"
                style={{ background: `${t.color}15`, color: t.color, border: `1px solid ${t.color}30` }}
              >
                {t.initials}
              </div>
              <h4 className="text-[1rem] font-bold text-t1 mb-1">{t.name}</h4>
              <p className="text-[0.75rem] text-t3 uppercase tracking-[1px] font-bold">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default About;