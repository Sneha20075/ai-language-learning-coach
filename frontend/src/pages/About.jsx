const stats = [
  { n: "500+", l: "Topics", icon: "📝" },
  { n: "24/7",  l: "Available", icon: "⏰" },
  { n: "AI",    l: "Feedback", icon: "🧠" },
  { n: "Free",  l: "Early Access", icon: "🎁" },
];

const team = [
  { initials: "JD", name: "John Doe",       role: "Founder & Dev",  color: "acc" },
  { initials: "AS", name: "Alice Smith",    role: "AI & Research",  color: "acc2" },
  { initials: "BW", name: "Bob Wilson",     role: "Design & UX",    color: "acc3" },
];

function About() {
  return (
    <div className="animate-fadeUp">
      <div className="max-w-[780px] mx-auto px-6 py-20">

        <div className="text-[0.7rem] font-semibold tracking-[2px] uppercase text-acc mb-2">
          About the project
        </div>

        <h2 className="font-display text-[clamp(2.2rem,5vw,3.5rem)] tracking-[1px]
                       leading-[1.05] mb-6 text-t1 font-bold">
          BUILT FOR<br />STUDENTS WHO<br /><span className="gradient-text">THINK DEEPER</span>
        </h2>

        <p className="text-t2 text-[0.92rem] leading-[1.85] mb-4">
          Debate sharpens the most important skills you can have — critical thinking,
          confidence, and the ability to communicate clearly under pressure.
          But great practice partners are hard to find.
        </p>
        <p className="text-t2 text-[0.92rem] leading-[1.85] mb-4">
          AI Debate Arena gives every student a tireless, intelligent opponent available anytime.
          Whether you're prepping for a competition or just want to think more clearly,
          we've built it for you.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-12">
          {stats.map((s) => (
            <div key={s.l} className="glass-card py-6 px-4 text-center group">
              <div className="text-[1.5rem] mb-2">{s.icon}</div>
              <div className="font-display text-[2rem] text-acc tracking-[1px] font-bold">{s.n}</div>
              <div className="text-[0.72rem] text-t3 uppercase tracking-[1px] mt-1 font-medium">{s.l}</div>
            </div>
          ))}
        </div>

        <hr className="border-none h-[1px] bg-border my-12" />

        {/* Team */}
        <h3 className="font-display text-[1.5rem] tracking-[2px] mb-6 text-t1 font-bold">THE TEAM</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {team.map((t) => (
            <div key={t.initials} className="glass-card p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl bg-${t.color}/10 flex-shrink-0
                              flex items-center justify-center text-[0.8rem]
                              font-bold text-${t.color}`}>
                {t.initials}
              </div>
              <div>
                <h4 className="text-[0.88rem] font-semibold text-t1">{t.name}</h4>
                <p className="text-[0.75rem] text-t2">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 AI Language Coach. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default About;