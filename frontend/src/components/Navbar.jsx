import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const links = [
  { label: "Home",      path: "/" },
  { label: "AI Coach",  path: "/ai-coach" },
  { label: "About",     path: "/about" },
  { label: "Join Beta", path: "/join-beta" },
  { label: "Contact",   path: "/contact" },
];

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [dark, setDark] = useState(() => !document.documentElement.classList.contains("light"));
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
    }
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") setDark(false);
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border backdrop-blur-xl transition-all duration-400"
         style={{ background: 'color-mix(in srgb, var(--c-bg) 85%, transparent)' }}>
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 h-[62px]">

        {/* ─── LOGO ─── */}
        <div className="font-display text-[1.4rem] font-bold tracking-[3px] text-t1 cursor-pointer flex items-center gap-2 select-none"
             onClick={() => navigate("/")}>
          <div className="w-8 h-8 rounded-lg bg-acc flex items-center justify-center text-white text-[0.7rem] font-bold">
            AI
          </div>
          <span>
            <span className="text-acc">COACH</span>
          </span>
        </div>

        {/* ─── DESKTOP NAV ─── */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-[7px] rounded-lg text-[0.82rem] tracking-[0.3px]
                            transition-all duration-200 no-underline font-medium
                            ${isActive
                              ? "text-acc bg-acc/10"
                              : "text-t2 hover:text-t1 hover:bg-s3"
                            }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* ─── RIGHT ACTIONS ─── */}
        <div className="flex items-center gap-2">

          {/* Theme Toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="theme-toggle"
            aria-label="Toggle theme"
            title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {dark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {/* Auth Buttons */}
          {userInfo ? (
            <div className="hidden md:flex items-center gap-2">
              <div className="px-3 py-[6px] rounded-lg bg-acc/10 text-acc text-[0.78rem] font-medium">
                👋 {userInfo.name}
              </div>
              <button
                onClick={logoutHandler}
                className="px-4 py-[7px] rounded-lg text-[0.82rem] tracking-[0.3px] bg-acc2/10 text-acc2 hover:bg-acc2 hover:text-white transition-all font-medium cursor-pointer border-none"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-[7px] rounded-lg text-[0.82rem] tracking-[0.3px] text-t2 hover:text-t1 hover:bg-s3 no-underline font-medium transition-all"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="btn-primary !py-[7px] !text-[0.82rem] no-underline"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* ─── MOBILE MENU BUTTON ─── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 rounded-lg border border-border bg-s2 flex items-center justify-center text-t2 cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? (
                <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              ) : (
                <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ─── MOBILE MENU ─── */}
      {mobileOpen && (
        <div className="md:hidden animate-slideDown border-t border-border px-6 py-4 space-y-2"
             style={{ background: 'var(--c-surface1)' }}>
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2 rounded-lg text-[0.88rem] no-underline transition-all
                          ${location.pathname === link.path ? "text-acc bg-acc/10" : "text-t2 hover:text-t1 hover:bg-s3"}`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border flex gap-2">
            {userInfo ? (
              <button onClick={logoutHandler} className="btn-primary !bg-acc2 w-full !text-[0.85rem]">Logout</button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline w-full no-underline text-center">Login</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-primary w-full no-underline text-center">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;