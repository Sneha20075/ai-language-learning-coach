import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: "🧠",
    num: "01",
    title: "Learn",
    desc: "Structured lessons across Grammar, Vocabulary, Culture & Pronunciation — curated per your level.",
    accent: "#0DFFB0",
    path: "/learn"
  },
  {
    icon: "🎴",
    num: "02",
    title: "Flashcards",
    desc: "Smart spaced-repetition flashcards that adapt to what you forget the fastest.",
    accent: "#7C5CFC",
    path: "/flashcards"
  },
  {
    icon: "🎭",
    num: "03",
    title: "Roleplay",
    desc: "Practice real conversations — order food, book a hotel, nail a job interview — with an AI partner.",
    accent: "#FF9F43",
    path: "/ai-coach"
  },
  {
    icon: "📋",
    num: "04",
    title: "Quiz",
    desc: "Test your knowledge with adaptive quizzes and get instant AI-powered feedback.",
    accent: "#0DFFB0",
    path: "/quiz"
  },
  {
    icon: "🔍",
    num: "05",
    title: "Object Detection",
    desc: "Point your camera at anything — AI instantly teaches you the word in your target language.",
    accent: "#7C5CFC",
    path: "/object-detection"
  },
  {
    icon: "📈",
    num: "06",
    title: "Progress",
    desc: "Track XP, streaks, skill radar and badges. See exactly how far you've come.",
    accent: "#FF9F43",
    path: "/progress"
  },
];

const stats = [
  { value: "6", label: "Practice Modes" },
  { value: "50+", label: "Roleplay Scenarios" },
  { value: "AI", label: "Powered Feedback" },
  { value: "∞", label: "Languages" },
];

function Home() {
  const navigate = useNavigate();
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    let mx = 0, my = 0, cx = 0, cy = 0;

    const move = (e) => { mx = e.clientX; my = e.clientY; };
    const animate = () => {
      cx += (mx - cx) * 0.13;
      cy += (my - cy) * 0.13;
      if (cursor) {
        cursor.style.left = cx + "px";
        cursor.style.top  = cy + "px";
      }
      requestAnimationFrame(animate);
    };
    window.addEventListener("mousemove", move);
    animate();

    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add("active")),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));

    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div style={{ fontFamily: "var(--font-sans)", background: "var(--c-bg)", color: "var(--c-text1)", overflowX: "hidden" }}>

      {/* Custom cursor */}
      <div ref={cursorRef} style={{
        position: "fixed",
        width: 10, height: 10,
        background: "#0DFFB0",
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 10000,
        mixBlendMode: "difference",
        transform: "translate(-50%,-50%)",
        transition: "opacity 0.3s",
      }} />

      {/* Noise */}
      <div className="noise" />

      {/* ── HERO ── */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
        {/* Orbs */}
        <div className="orb orb-teal" style={{ top: "-10%", left: "-5%" }} />
        <div className="orb orb-violet" style={{ bottom: "0%", right: "5%" }} />
        <div className="orb orb-amber" style={{ top: "40%", left: "50%" }} />

        <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center", paddingTop: 80 }}>

          <div className="pill" style={{ marginBottom: 36, display: "inline-flex" }}>
            <span style={{ color: "#0DFFB0" }}>✦</span>
            AI-POWERED LANGUAGE LEARNING
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3.5rem, 9vw, 8.5rem)",
            lineHeight: 0.9,
            letterSpacing: "-2px",
            marginBottom: 32,
            fontStyle: "italic",
          }}>
            <span style={{ display: "block", animation: "fadeUp 0.8s both 0.1s", color: "var(--c-text1)" }}>Speak</span>
            <span style={{
              display: "block",
              animation: "fadeUp 0.8s both 0.3s",
              background: "linear-gradient(90deg, #0DFFB0 0%, #7C5CFC 60%, #FF9F43 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>Any Language.</span>
            <span style={{ display: "block", animation: "fadeUp 0.8s both 0.5s", color: "var(--c-text2)" }}>Fluently.</span>
          </h1>

          <p style={{
            maxWidth: 480,
            margin: "0 auto 48px",
            color: "var(--c-text2)",
            fontSize: "1.05rem",
            lineHeight: 1.7,
            animation: "fadeUp 0.8s both 0.7s",
          }}>
            Learn, practice roleplay, take quizzes, and detect objects in your target language — all powered by AI.
          </p>

          <div style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
            animation: "fadeUp 0.8s both 0.9s",
          }}>
            <button onClick={() => navigate("/signup")} className="btn-primary">
              Start for Free →
            </button>
            <button
              onClick={() => document.getElementById("features-sec").scrollIntoView({ behavior: "smooth" })}
              className="btn-outline"
            >
              Explore Features
            </button>
          </div>

          {/* Stats row */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 60,
            marginTop: 80,
            paddingTop: 48,
            borderTop: "1px solid var(--c-border)",
            flexWrap: "wrap",
            animation: "fadeUp 0.8s both 1.1s",
          }}>
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2.2rem",
                  fontWeight: 700,
                  fontStyle: "italic",
                  background: i % 2 === 0
                    ? "linear-gradient(135deg, #0DFFB0, #7C5CFC)"
                    : "linear-gradient(135deg, #FF9F43, #7C5CFC)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>{s.value}</div>
                <div style={{ color: "var(--c-text3)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {[1, 2].map(i => (
            <div key={i} style={{ display: "flex", gap: 80, color: "var(--c-text3)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.15em", alignItems: "center" }}>
              <span>🌍 LEARN ANY LANGUAGE</span>
              <span style={{ color: "#0DFFB0" }}>✦</span>
              <span>🎭 AI ROLEPLAY CONVERSATIONS</span>
              <span style={{ color: "#7C5CFC" }}>✦</span>
              <span>🔍 OBJECT DETECTION</span>
              <span style={{ color: "#FF9F43" }}>✦</span>
              <span>📋 ADAPTIVE QUIZZES</span>
              <span style={{ color: "#0DFFB0" }}>✦</span>
              <span>📈 TRACK YOUR PROGRESS</span>
              <span style={{ color: "#7C5CFC" }}>✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="section" id="features-sec">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 72, maxWidth: 600 }}>
            <div className="pill" style={{ marginBottom: 20 }}>What you get</div>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
              fontStyle: "italic",
              lineHeight: 1.1,
              marginBottom: 16,
            }}>
              Everything you need to<br />
              <span style={{
                background: "linear-gradient(90deg, #0DFFB0, #7C5CFC)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>master a language.</span>
            </h2>
            <p style={{ color: "var(--c-text2)", maxWidth: 440, lineHeight: 1.7 }}>
              Six powerful modes, one seamless experience — designed to make fluency inevitable.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 24,
          }}>
            {features.map((f, i) => (
              <div
                key={i}
                onClick={() => navigate(f.path)}
                className="reveal glass-card"
                style={{
                  padding: 36,
                  transitionDelay: `${i * 0.08}s`,
                  borderTop: `2px solid ${f.accent}22`,
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                {/* subtle glow accent */}
                <div style={{
                  position: "absolute",
                  top: -40, right: -40,
                  width: 160, height: 160,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${f.accent}18 0%, transparent 70%)`,
                  pointerEvents: "none",
                }} />

                <div style={{
                  width: 52, height: 52,
                  borderRadius: 14,
                  background: `${f.accent}18`,
                  border: `1px solid ${f.accent}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  marginBottom: 24,
                }}>
                  {f.icon}
                </div>

                <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", color: f.accent, marginBottom: 8, textTransform: "uppercase" }}>
                  {f.num}
                </div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ color: "var(--c-text2)", fontSize: "0.9rem", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section" id="how-it-works" style={{ background: "var(--c-surface1)" }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: "center", marginBottom: 72 }}>
            <div className="pill" style={{ marginBottom: 20 }}>How it works</div>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
              fontStyle: "italic",
              lineHeight: 1.1,
            }}>
              From zero to fluent<br />
              <span style={{
                background: "linear-gradient(90deg, #FF9F43, #7C5CFC)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>in 3 simple steps.</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40 }}>
            {[
              { n: "01", icon: "🌐", title: "Choose Your Language", desc: "Pick any language you want to learn. Set your level — Beginner, Intermediate, or Advanced." },
              { n: "02", icon: "🚀", title: "Practice Every Day", desc: "Use Learn, Flashcards, Quiz, Roleplay or Object Detection. Even 10 minutes matters." },
              { n: "03", icon: "🏆", title: "Track & Improve", desc: "Your AI coach gives real-time feedback. Watch your skills grow on the Progress dashboard." },
            ].map((step, i) => (
              <div key={i} className="reveal" style={{ transitionDelay: `${i * 0.15}s`, textAlign: "center", padding: "48px 32px" }}>
                <div style={{
                  width: 72, height: 72,
                  borderRadius: 20,
                  background: "var(--c-surface3)",
                  border: "1px solid var(--c-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  margin: "0 auto 28px",
                  position: "relative",
                }}>
                  {step.icon}
                  <span style={{
                    position: "absolute",
                    top: -12, right: -12,
                    width: 28, height: 28,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #0DFFB0, #7C5CFC)",
                    color: "#060810",
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>{step.n}</span>
                </div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: 12 }}>{step.title}</h3>
                <p style={{ color: "var(--c-text2)", fontSize: "0.9rem", lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section">
        <div className="container">
          <div className="reveal" style={{
            background: "linear-gradient(135deg, var(--c-surface2) 0%, var(--c-surface3) 100%)",
            border: "1px solid var(--c-border)",
            borderRadius: 28,
            padding: "80px 60px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Background glows */}
            <div style={{ position: "absolute", top: -80, left: "20%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(13,255,176,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -80, right: "20%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,92,252,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div className="pill" style={{ marginBottom: 24 }}>Get started today</div>
              <h2 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.2rem, 5vw, 4rem)",
                fontStyle: "italic",
                lineHeight: 1.1,
                marginBottom: 20,
              }}>
                Ready to speak a new<br />
                <span style={{
                  background: "linear-gradient(90deg, #0DFFB0 0%, #7C5CFC 50%, #FF9F43 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>language fluently?</span>
              </h2>
              <p style={{ color: "var(--c-text2)", marginBottom: 40, maxWidth: 400, margin: "0 auto 40px", lineHeight: 1.7 }}>
                Join learners who are already using AI to break language barriers — for free.
              </p>
              <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={() => navigate("/signup")} className="btn-primary" style={{ fontSize: "0.95rem", padding: "15px 40px" }}>
                  Start Learning for Free →
                </button>
                <button onClick={() => navigate("/ai-coach")} className="btn-outline">
                  Try AI Coach
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "linear-gradient(135deg, #0DFFB0, #7C5CFC)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#060810", fontWeight: 800, fontSize: "0.75rem",
                }}>AI</div>
                <span style={{ fontWeight: 700, letterSpacing: "3px", color: "var(--c-text1)", fontSize: "0.9rem" }}>LANGUAGE COACH</span>
              </div>
              <p style={{ color: "var(--c-text3)", fontSize: "0.82rem" }}>Built for passionate language learners.</p>
            </div>
            <div style={{ display: "flex", gap: 60 }}>
              <div>
                <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--c-text1)", marginBottom: 16, fontWeight: 700 }}>Product</div>
                {["Features", "How it Works", "AI Coach"].map(l => (
                  <a key={l} href="#features-sec" style={{ display: "block", color: "var(--c-text3)", fontSize: "0.82rem", marginBottom: 10, textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = "var(--c-accent)"}
                    onMouseLeave={e => e.target.style.color = "var(--c-text3)"}
                  >{l}</a>
                ))}
              </div>
              <div>
                <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--c-text1)", marginBottom: 16, fontWeight: 700 }}>Pages</div>
                {[{ l: "Login", p: "/login" }, { l: "Sign Up", p: "/signup" }, { l: "About", p: "/about" }].map(({ l, p }) => (
                  <a key={l} href={p} style={{ display: "block", color: "var(--c-text3)", fontSize: "0.82rem", marginBottom: 10, textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = "var(--c-accent)"}
                    onMouseLeave={e => e.target.style.color = "var(--c-text3)"}
                  >{l}</a>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--c-border)", marginTop: 40, paddingTop: 28, textAlign: "center", color: "var(--c-text3)", fontSize: "0.78rem" }}>
            © 2025 AI Language Coach. Built with ❤️ for language learners worldwide.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;