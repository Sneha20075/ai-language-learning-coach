import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown, TrendingUp, Zap, Sparkles } from "lucide-react";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/features/leaderboard`);
        if (res.data.success) {
          setLeaderboard(res.data.data);
        }
      } catch (error) {
        console.error("Leaderboard fetch failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-washi">
        <Trophy size={48} className="text-sakura animate-pulse mb-8" />
        <p className="text-ink font-black uppercase tracking-[0.3em] text-[10px]">Syncing Hall of Simulation...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-washi pt-40 pb-32">
      <div className="container-premium max-w-5xl">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24 border-b-4 border-ink pb-12">
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <span className="pill-badge text-sakura border-sakura">Global Ranking</span>
                    <span className="text-ink/20 font-black">/</span>
                    <span className="text-[10px] font-black text-ink uppercase tracking-widest">Neural Network Standing</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-ink tracking-tighter leading-none mb-4 uppercase">Identity <span className="text-sakura italic">Hall.</span></h1>
                <p className="text-xl text-ink/40 font-bold max-w-xl">Top performing entities across the global linguistic simulation.</p>
            </div>
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[2rem] bg-ink text-sakura flex items-center justify-center shadow-2xl">
                    <Trophy size={32} strokeWidth={2.5} />
                </div>
            </div>
        </div>

        {/* TOP 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
            {leaderboard.slice(0, 3).map((user, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`glass-card !p-12 !rounded-[3rem] text-center relative overflow-hidden ${i === 0 ? 'border-4 border-sakura shadow-2xl shadow-sakura/20' : 'border-2 border-ink/5'}`}
                >
                    {i === 0 && <Crown size={40} className="absolute -top-4 -right-4 text-sakura rotate-12" fill="currentColor" />}
                    <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} className="w-24 h-24 rounded-full mx-auto mb-8 border-4 border-ink shadow-2xl" alt={user.name} />
                    <h3 className="text-2xl font-black text-ink mb-2 uppercase tracking-tighter">{user.name}</h3>
                    <div className="text-5xl font-black text-ink mb-6 tracking-tighter leading-none">{user.totalXP || 0} <span className="text-xs text-ink/40 uppercase tracking-widest">XP</span></div>
                    <div className="pill-badge !bg-ink/5 !text-ink !border-none text-[10px] font-black uppercase tracking-widest mx-auto w-fit">Level {user.level || 1}</div>
                </motion.div>
            ))}
        </div>

        {/* LIST */}
        <div className="glass-card !p-0 !rounded-[3rem] overflow-hidden">
            <div className="p-10 border-b-2 border-ink/5 flex items-center justify-between bg-ink/5">
                <span className="text-[10px] font-black text-ink/40 uppercase tracking-[0.3em]">Neural Entity</span>
                <span className="text-[10px] font-black text-ink/40 uppercase tracking-[0.3em]">Cognitive Standing</span>
            </div>
            <div className="divide-y-2 divide-ink/5">
                {leaderboard.map((user, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="p-10 flex items-center justify-between hover:bg-white transition-colors group cursor-default"
                    >
                        <div className="flex items-center gap-8">
                            <span className="text-4xl font-black text-ink/10 group-hover:text-sakura transition-colors">#{i+1}</span>
                            <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} className="w-16 h-16 rounded-2xl border-4 border-ink/5 group-hover:border-ink transition-all" alt={user.name} />
                            <div>
                                <h4 className="text-2xl font-black text-ink uppercase tracking-tighter leading-none">{user.name}</h4>
                                <span className="text-[10px] font-black text-ink/20 uppercase tracking-widest">Identity Verified</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-12 text-right">
                            <div className="hidden md:block">
                                <span className="text-[10px] font-black text-ink/20 uppercase tracking-widest block mb-1">XP Density</span>
                                <div className="text-2xl font-black text-ink tracking-tighter">{user.totalXP || 0}</div>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-ink/5 flex items-center justify-center text-ink group-hover:bg-sakura group-hover:text-white transition-all">
                                <TrendingUp size={20} strokeWidth={2.5} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>

        <div className="mt-20 flex items-center justify-center gap-8 opacity-20">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-ink"><Medal size={14}/> Top Performance</div>
            <div className="w-1.5 h-1.5 rounded-full bg-ink"></div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-ink"><Zap size={14}/> XP Velocity</div>
            <div className="w-1.5 h-1.5 rounded-full bg-ink"></div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-ink"><Sparkles size={14}/> Hall of Simulation</div>
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;
