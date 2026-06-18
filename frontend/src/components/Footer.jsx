import React from "react";
import { Link } from "react-router-dom";
import { Languages, Globe, Mail, Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-ink text-white pt-24 pb-12 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sakura to-transparent opacity-20"></div>
      
      <div className="container-premium relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          
          {/* BRANDING */}
          <div className="lg:col-span-5">
            <Link to="/" className="flex items-center gap-4 mb-8 group">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-sakura group-hover:bg-white group-hover:text-ink transition-all duration-500 shadow-2xl">
                <Languages size={24} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl font-black tracking-tighter leading-none">LinguaCoach</span>
                <span className="text-[10px] font-black text-sakura uppercase tracking-[0.2em] mt-1">Intelligence Simulation</span>
              </div>
            </Link>
            <p className="text-white/40 text-lg font-bold leading-tight max-w-sm mb-10">
              Transforming linguistic acquisition through high-density neural models and immersive visual analysis.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-sakura transition-all duration-300">
                <Globe size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-sakura transition-all duration-300">
                <Globe size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-sakura transition-all duration-300">
                <Globe size={18} />
              </a>
            </div>
          </div>

          {/* LINKS */}
          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-sakura mb-8">Navigation</h4>
            <ul className="space-y-4">
              <li><Link to="/ai-coach" className="text-white/40 hover:text-white font-bold transition-colors">Neural Coach</Link></li>
              <li><Link to="/object-detection" className="text-white/40 hover:text-white font-bold transition-colors">Visual Lens</Link></li>
              <li><Link to="/learn" className="text-white/40 hover:text-white font-bold transition-colors">Academy Lab</Link></li>
              <li><Link to="/leaderboard" className="text-white/40 hover:text-white font-bold transition-colors">Identity Hall</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-sakura mb-8">Intelligence</h4>
            <ul className="space-y-4">
              <li><Link to="/progress" className="text-white/40 hover:text-white font-bold transition-colors">Data Insights</Link></li>
              <li><Link to="/flashcards" className="text-white/40 hover:text-white font-bold transition-colors">Vocab Synthesis</Link></li>
              <li><Link to="/quiz" className="text-white/40 hover:text-white font-bold transition-colors">Logic Audit</Link></li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div className="lg:col-span-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-sakura mb-8">Status Report</h4>
            <div className="p-1.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2 mb-6 focus-within:border-sakura transition-all">
                <input 
                    type="email" 
                    placeholder="Enter Identity..." 
                    className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-sm font-bold text-white placeholder:text-white/10"
                />
                <button className="w-10 h-10 rounded-xl bg-sakura text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all">
                    <Mail size={18} strokeWidth={2.5} />
                </button>
            </div>
            <div className="flex items-center gap-3 text-white/20">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest">Global Node: Active</span>
            </div>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
                <Sparkles size={14} className="text-sakura" fill="currentColor" /> © 2026 LinguaCoach Simulation
            </div>
            <div className="flex gap-12">
                <Link to="/privacy" className="text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-colors">Privacy Logic</Link>
                <Link to="/terms" className="text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-colors">Usage Protocol</Link>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
