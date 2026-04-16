import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const cursorRef = useRef(null);

  useEffect(() => {
    // Custom Cursor Logic
    const cursor = cursorRef.current;
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animateCursor = () => {
      let lerpX = (mouseX - cursorX) * 0.15;
      let lerpY = (mouseY - cursorY) * 0.15;
      cursorX += lerpX;
      cursorY += lerpY;
      if (cursor) {
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
      }
      requestAnimationFrame(animateCursor);
    };

    window.addEventListener('mousemove', onMouseMove);
    animateCursor();

    // Intersection Observer for Reveal Animations
    const observerOptions = { threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <div className="landing-premium">
      {/* Custom Styles for this page */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Instrument+Serif:ital@0;1&display=swap');

        .landing-premium {
          --bg: #07070B;
          --surface: #0F0F17;
          --border: rgba(255, 255, 255, 0.06);
          --accent: #E8512A;
          --accent-2: #9B72F5;
          --text: #EDEDEC;
          --muted: #6B6B7A;
          --ff-display: 'Instrument Serif', serif;
          --ff-ui: 'DM Sans', sans-serif;
          background-color: var(--bg);
          color: var(--text);
          font-family: var(--ff-ui);
          overflow-x: hidden;
        }

        #custom-cursor-home {
          position: fixed;
          width: 8px;
          height: 8px;
          background-color: var(--accent);
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000;
          mix-blend-mode: difference;
          transform: translate(-50%, -50%);
        }

        .noise-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9999;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        .container-p { max-width: 1200px; margin: 0 auto; padding: 0 40px; }
        
        .hero-home { height: 100vh; display: flex; flex-direction: column; items-center justify-center; text-align: center; position: relative; }
        
        .hero-tag { border: 1px solid var(--border); padding: 6px 14px; border-radius: 999px; font-size: 0.7rem; letter-spacing: 0.15em; color: var(--muted); margin-bottom: 48px; }
        
        .hero-title-h { font-family: var(--ff-display); font-size: clamp(4.5rem, 11vw, 11rem); line-height: 0.85; margin-bottom: 40px; }
        .hero-word { display: block; opacity: 0; filter: blur(12px); transform: translateY(20px); font-style: italic; animation: blurUp 1.2s forwards cubic-bezier(0.2, 0.8, 0.2, 1); }
        .word1 { transform: translateX(-40px); }
        .word2 { background: linear-gradient(90deg, var(--accent), var(--accent-2)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation-delay: 0.25s !important; }
        .word3 { color: var(--accent); transform: translateX(80px); animation-delay: 0.5s !important; }

        @keyframes blurUp { to { opacity: 1; filter: blur(0); transform: translateY(0); } }

        .reveal { opacity: 0; transform: translateY(30px); transition: all 1s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .reveal.active { opacity: 1; transform: translateY(0); }

        .bento-grid-p { display: grid; grid-template-columns: repeat(12, 1fr); gap: 24px; }
        .bento-card-p { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 40px; transition: all 0.4s ease; }
        .bento-card-p:hover { border-color: rgba(232, 81, 42, 0.3); transform: scale(1.01); }

        .marquee-h { overflow: hidden; padding: 40px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .marquee-inner { display: flex; gap: 80px; width: max-content; animation: marquee-anim 30s linear infinite; }
        @keyframes marquee-anim { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

        .steps-p { display: grid; grid-template-columns: repeat(3, 1fr); gap: 60px; margin-top: 60px; }
      `}</style>

      <div id="custom-cursor-home" ref={cursorRef}></div>
      <div className="noise-overlay"></div>

      {/* --- HERO --- */}
      <section className="hero-home container-p">
        <div className="hero-tag">⬡ AI-POWERED DEBATE TRAINING</div>
        <h1 className="hero-title-h">
          <span className="hero-word word1">ARGUE.</span>
          <span className="hero-word word2">THINK.</span>
          <span className="hero-word word3">WIN.</span>
        </h1>
        <p className="hero-subtext text-muted max-w-[480px] mx-auto opacity-0 animate-[fadeIn_1s_forwards_0.8s]">
          Practice debate with an AI opponent that pushes back, scores your logic, and makes you sharper — every single round.
        </p>
        <div className="flex gap-6 mt-12 justify-center opacity-0 animate-[fadeIn_1s_forwards_1s]">
          <button onClick={() => navigate("/signup")} className="btn-primary">Reserve Your Spot →</button>
          <button onClick={() => { document.getElementById('how-p').scrollIntoView({behavior: 'smooth'}) }} className="btn-ghost">See how it works →</button>
        </div>
      </section>

      {/* --- MARQUEE --- */}
      <div className="marquee-h">
        <div className="marquee-inner">
          {[1, 2].map(i => (
            <div key={i} className="flex gap-20 text-muted font-medium text-sm">
              <span>TRUSTED BY 400+ STUDENTS ACROSS 12 INSTITUTIONS</span>
              <span>HARVARD DEBATE SOCIETY</span>
              <span>OXFORD UNION</span>
              <span>STANFORD ACQUISITION</span>
              <span>YALE DISPUTE</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- FEATURES --- */}
      <section className="py-32 container-p" id="features">
        <div className="reveal mb-20 max-w-xl">
          <span className="caption">What you get</span>
          <h2 className="text-5xl font-display italic">Everything you need to dominate any debate.</h2>
        </div>

        <div className="bento-grid-p">
          <div className="bento-card-p col-span-12 md:col-span-7 row-span-2 reveal">
            <span className="text-accent text-[0.7rem] font-bold tracking-widest mb-4 block uppercase">01</span>
            <h3 className="text-2xl font-bold mb-4">AI Opponent</h3>
            <p className="text-muted text-sm">Argues any side of any topic with real, structured arguments — no easy wins.</p>
            <div className="mt-10 space-y-4">
               <div className="p-4 rounded-xl border border-border bg-white/5 text-[0.8rem] border-l-2 border-l-accent">Your point on universal income assumes a fixed labor supply. Have you considered the velocity of capital?</div>
               <div className="p-4 rounded-xl border border-border bg-accent text-white text-[0.8rem] ml-auto max-w-[80%]">Capital velocity increases but productivity might stagnate.</div>
            </div>
          </div>
          <div className="bento-card-p col-span-12 md:col-span-5 reveal">
            <span className="text-accent text-[0.7rem] font-bold tracking-widest mb-4 block uppercase">02</span>
            <h3 className="text-2xl font-bold mb-4">Live Scoring</h3>
            <p className="text-muted text-sm">Instant feedback on logic, structure, and persuasion.</p>
            <div className="mt-8 space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-[0.7rem] text-muted"><span>Logic</span><span>87%</span></div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-accent to-accent-2" style={{width:'87%'}}></div></div>
                </div>
            </div>
          </div>
          <div className="bento-card-p col-span-12 md:col-span-5 reveal">
            <span className="text-accent text-[0.7rem] font-bold tracking-widest mb-4 block uppercase">03</span>
            <h3 className="text-2xl font-bold mb-4">Topic Library</h3>
            <div className="flex flex-wrap gap-2 mt-6">
                {["Climate Policy", "AI Ethics", "Space X", "UBI"].map(t => <span key={t} className="px-3 py-1 rounded-full border border-border bg-white/5 text-[0.7rem]">{t}</span>)}
            </div>
          </div>
        </div>
      </section>

      {/* --- STEPS --- */}
      <section className="py-32 container-p" id="how-p">
        <div className="reveal text-center mb-20">
          <span className="caption">The Process</span>
          <h2 className="text-5xl font-display italic">From topic to triumph in 3 steps.</h2>
        </div>
        <div className="steps-p">
            {[
                { n: "1", i: "📚", t: "Choose", d: "Pick a topic from our deep library." },
                { n: "2", i: "⚔️", t: "Debate", d: "Go head-to-head with a sharp AI." },
                { n: "3", i: "📈", t: "Optimize", d: "Get a granular logic score." }
            ].map((s, idx) => (
                <div key={idx} className="reveal text-center" style={{transitionDelay: `${idx * 0.2}s`}}>
                    <div className="w-20 h-20 bg-surface border border-border rounded-2xl flex items-center justify-center text-3xl mx-auto mb-8 relative">
                        <span className="absolute text-5xl font-black text-white/5 -top-4">{s.n}</span>
                        {s.i}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{s.t}</h3>
                    <p className="text-muted text-sm px-10">{s.d}</p>
                </div>
            ))}
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-32 container-p">
          <div className="reveal rounded-[32px] bg-[#0C0C14] border border-border p-20 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-radial-gradient from-accent/5 to-transparent pointer-events-none"></div>
              <h2 className="text-6xl font-display italic mb-6">Ready to sharpen your mind?</h2>
              <p className="text-muted mb-10">Join 400+ students on the early access waitlist.</p>
              <button onClick={() => navigate("/signup")} className="btn-primary">Get Early Access →</button>
          </div>
      </section>

      <footer className="border-t border-border py-20 container-p">
          <div className="flex justify-between items-start">
              <div>
                  <div className="font-bold tracking-[3px] text-accent mb-2">AI COACH</div>
                  <p className="text-muted text-xs">Built for serious thinkers.</p>
              </div>
              <div className="flex gap-20">
                  <div className="space-y-4">
                      <div className="text-[0.6rem] uppercase tracking-widest text-white">Product</div>
                      <a href="#features" className="block text-muted text-xs">Features</a>
                      <a href="#how-p" className="block text-muted text-xs">How it Works</a>
                  </div>
              </div>
          </div>
      </footer>
    </div>
  );
}

export default Home;