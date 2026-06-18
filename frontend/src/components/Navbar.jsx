import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Menu, X, LogOut, Sun, Moon, Globe, Zap, Languages } from "lucide-react";

const links = [
  { label: "Coach",     path: "/ai-coach" },
  { label: "Lens",      path: "/object-detection" },
  { label: "Academy",   path: "/learn" },
  { label: "Cards",     path: "/flashcards" },
  { label: "Quiz",      path: "/quiz" },
  { label: "Board",     path: "/leaderboard" },
  { label: "Insights",  path: "/progress" },
];

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("userInfo");
    if (data) setUser(JSON.parse(data));

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-500 ${scrolled ? 'py-4 bg-white/75 backdrop-blur-2xl shadow-xl shadow-ink/5 border-b border-black/5' : 'py-8 bg-transparent'}`}>
      <div className="container-premium flex items-center justify-between">
        
        {/* BRANDING */}
        <Link to="/" className="group flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-ink flex items-center justify-center text-sakura shadow-2xl shadow-ink/20 group-hover:scale-110 transition-transform duration-500">
            <Languages size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-black text-ink tracking-tight leading-none">LinguaCoach</span>
            <span className="text-[10px] font-black text-sakura uppercase tracking-[0.2em] mt-1">Intelligence</span>
          </div>
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden lg:flex items-center bg-ink/5 backdrop-blur-md rounded-2xl p-1 gap-1">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${location.pathname === link.path ? 'bg-white text-ink shadow-lg' : 'text-ink/60 hover:text-ink hover:bg-white/50'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">
          
          {user ? (
            <div className="flex items-center gap-4">
                <Link to="/profile" className="hidden sm:flex flex-col items-end mr-2 hover:opacity-70 transition-opacity">
                    <span className="text-[10px] font-black text-ink/40 uppercase tracking-widest">Active Member</span>
                    <span className="text-xs font-bold text-ink">{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="w-12 h-12 rounded-2xl bg-sakura/10 text-sakura flex items-center justify-center hover:bg-sakura hover:text-white transition-all duration-500 shadow-lg shadow-sakura/5">
                    <LogOut size={18} strokeWidth={2.5} />
                </button>
            </div>
          ) : (
            <Link to="/login" className="btn-premium">
                Enter Lab
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden w-12 h-12 rounded-2xl bg-ink/5 flex items-center justify-center text-ink">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-white border-b border-black/5 shadow-2xl overflow-hidden lg:hidden"
          >
            <div className="container-premium py-12 flex flex-col gap-8">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`text-3xl font-black uppercase tracking-tighter ${location.pathname === link.path ? 'text-sakura' : 'text-ink/40 hover:text-ink'}`}
                >
                  {link.label}
                </Link>
              ))}
              {!user && <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-premium text-center">Enter Lab</Link>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;