import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const links = [
  { label: "Home",      path: "/" },
  { label: "AI Coach",  path: "/ai-coach" },
  { label: "Scanner",   path: "/object-detection" },
  { label: "About",     path: "/about" },
  { label: "Join Beta", path: "/join-beta" },
  { label: "Contact",   path: "/contact" },
];

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [targetLanguage, setTargetLanguage] = useState(() => localStorage.getItem("targetLanguage") || "Spanish");
  const [isCustomLang, setIsCustomLang] = useState(false);
  const [dark, setDark] = useState(() => !document.documentElement.classList.contains("light"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
    }
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved === "light") setDark(false);
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
    window.location.reload();
  };

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setTargetLanguage(lang);
    localStorage.setItem("targetLanguage", lang);
    window.dispatchEvent(new Event("storage")); // Trigger sync across components
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        transition: "all 0.3s",
        background: scrolled
          ? "rgba(6, 8, 16, 0.88)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      }}
    >
      <div style={{
        maxWidth: 1180,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 48px",
        height: 64,
      }}>

        {/* ── LOGO ── */}
        <div
          onClick={() => navigate("/")}
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none", textDecoration: "none" }}
        >
          <div style={{
            width: 34, height: 34,
            borderRadius: 10,
            background: "linear-gradient(135deg, #0DFFB0 0%, #7C5CFC 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#060810",
            fontWeight: 800,
            fontSize: "0.7rem",
            letterSpacing: "0.5px",
            flexShrink: 0,
          }}>AI</div>
          <span style={{
            fontWeight: 700,
            letterSpacing: "2.5px",
            fontSize: "0.82rem",
            color: "var(--c-text1)",
            textTransform: "uppercase",
          }}>
            Language<span style={{ color: "#0DFFB0" }}>Coach</span>
          </span>
        </div>

        {/* ── DESKTOP NAV ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="desktop-nav">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  padding: "7px 16px",
                  borderRadius: 10,
                  fontSize: "0.84rem",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#0DFFB0" : "var(--c-text2)",
                  background: isActive ? "rgba(13,255,176,0.08)" : "transparent",
                  textDecoration: "none",
                  transition: "all 0.2s",
                  letterSpacing: "0.2px",
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.target.style.color = "var(--c-text1)";
                    e.target.style.background = "var(--c-surface3)";
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.target.style.color = "var(--c-text2)";
                    e.target.style.background = "transparent";
                  }
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* ── RIGHT ACTIONS ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

          {/* Language Selector */}
          {!isCustomLang ? (
            <select 
              value={targetLanguage} 
              onChange={(e) => {
                if (e.target.value === "CUSTOM") {
                  setIsCustomLang(true);
                } else {
                  handleLanguageChange(e);
                }
              }}
              style={{
                background: "var(--c-surface2)",
                border: "1px solid var(--c-border)",
                borderRadius: 8,
                color: "var(--c-text1)",
                fontSize: "0.75rem",
                padding: "4px 8px",
                outline: "none",
                cursor: "pointer"
              }}
            >
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Italian">Italian</option>
              <option value="Japanese">Japanese</option>
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
              <option value="CUSTOM">Other...</option>
            </select>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <input 
                    type="text" 
                    placeholder="Type language..."
                    autoFocus
                    onBlur={(e) => {
                        if (!e.target.value) setIsCustomLang(false);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            const val = e.target.value;
                            if (val) {
                                setTargetLanguage(val);
                                localStorage.setItem("targetLanguage", val);
                                window.dispatchEvent(new Event("storage"));
                                setIsCustomLang(false);
                            }
                        }
                    }}
                    style={{
                        background: "var(--c-surface2)",
                        border: "1px solid var(--c-accent)",
                        borderRadius: 8,
                        color: "var(--c-text1)",
                        fontSize: "0.75rem",
                        padding: "4px 8px",
                        width: 100,
                        outline: "none"
                    }}
                />
                <button onClick={() => setIsCustomLang(false)} style={{ color: 'var(--c-text3)', fontSize: '0.8rem' }}>✕</button>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="theme-toggle"
            aria-label="Toggle theme"
            title={dark ? "Light Mode" : "Dark Mode"}
          >
            {dark ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {/* Auth */}
          {userInfo ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="desktop-nav">
              <div style={{
                padding: "6px 14px",
                borderRadius: 10,
                background: "rgba(13,255,176,0.08)",
                color: "#0DFFB0",
                fontSize: "0.8rem",
                fontWeight: 600,
              }}>
                👋 {userInfo.name}
              </div>
              <button
                onClick={logoutHandler}
                style={{
                  padding: "7px 16px",
                  borderRadius: 10,
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "#7C5CFC",
                  background: "rgba(124,92,252,0.08)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,92,252,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(124,92,252,0.08)"; }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="desktop-nav">
              <Link
                to="/login"
                style={{
                  padding: "7px 16px",
                  borderRadius: 10,
                  fontSize: "0.82rem",
                  fontWeight: 500,
                  color: "var(--c-text2)",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.target.style.color = "var(--c-text1)"; e.target.style.background = "var(--c-surface3)"; }}
                onMouseLeave={e => { e.target.style.color = "var(--c-text2)"; e.target.style.background = "transparent"; }}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="btn-primary"
                style={{ padding: "8px 20px", fontSize: "0.82rem", textDecoration: "none", borderRadius: 10 }}
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu btn */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: "none",
              width: 38, height: 38,
              borderRadius: 10,
              border: "1.5px solid var(--c-border)",
              background: "var(--c-surface2)",
              color: "var(--c-text2)",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            className="mobile-menu-btn"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? (
                <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              ) : (
                <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      {mobileOpen && (
        <div style={{
          background: "var(--c-surface1)",
          borderTop: "1px solid var(--c-border)",
          padding: "16px 24px 24px",
          animation: "slideDown 0.3s both",
        }}>
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                padding: "10px 14px",
                borderRadius: 10,
                fontSize: "0.9rem",
                color: location.pathname === link.path ? "#0DFFB0" : "var(--c-text2)",
                background: location.pathname === link.path ? "rgba(13,255,176,0.08)" : "transparent",
                textDecoration: "none",
                marginBottom: 4,
                fontWeight: 500,
                transition: "all 0.2s",
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ borderTop: "1px solid var(--c-border)", paddingTop: 16, marginTop: 8, display: "flex", gap: 10 }}>
            {userInfo ? (
              <button onClick={logoutHandler} className="btn-primary" style={{ width: "100%", fontSize: "0.88rem" }}>Logout</button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline" style={{ flex: 1, textDecoration: "none", textAlign: "center" }}>Login</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-primary" style={{ flex: 1, textDecoration: "none", textAlign: "center" }}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;