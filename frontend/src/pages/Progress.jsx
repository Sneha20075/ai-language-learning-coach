import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { TrendingUp, Award, Flame, Target, BrainCircuit, Activity, Zap, BarChart3, LineChart, PieChart, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";

import { jsPDF } from "jspdf";

function Progress() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [targetLanguage, setTargetLanguage] = useState(() => localStorage.getItem("targetLanguage") || "Spanish");

  const downloadReport = () => {
    if (!progress) return;
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.text("LinguaCoach Intelligence Report", 20, 20);
    doc.setFontSize(14);
    doc.text(`Target Language: ${progress.targetLanguage}`, 20, 40);
    doc.text(`Total XP: ${progress.totalXP}`, 20, 50);
    doc.text(`Current Streak: ${progress.currentStreak} Days`, 20, 60);
    
    doc.text("Proficiency Matrix:", 20, 80);
    Object.entries(progress.skills || {}).forEach(([skill, val], i) => {
      doc.text(`${skill}: ${val}%`, 30, 90 + (i * 10));
    });

    doc.save("LinguaCoach_Report.pdf");
    toast.success("Intelligence Report Exported.");
  };

  useEffect(() => {
    // ... rest of useEffect
    const fetchProgress = async () => {
      setLoading(true);
      try {
        const userInfoStr = localStorage.getItem("userInfo");
        const token = userInfoStr ? JSON.parse(userInfoStr).token : null;
        
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/features/progress?lang=${targetLanguage}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setProgress(res.data.data);
        }
      } catch (error) {
        toast.error("Analytics synchronization failed.");
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [targetLanguage]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-washi">
        <Activity size={48} className="text-sakura animate-pulse mb-8" />
        <p className="text-ink font-black uppercase tracking-[0.3em] text-[10px]">Processing Neural Analytics...</p>
    </div>
  );

  if (!progress) return (
    <div className="min-h-screen flex items-center justify-center bg-washi">
        <p className="text-ink/40 font-black uppercase tracking-widest">No Intelligence Data Sync.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-washi pt-40 pb-32">
      <div className="container-premium">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24 border-b-4 border-ink pb-12">
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <span className="pill-badge text-sakura border-sakura">Data Laboratory</span>
                    <span className="text-ink/20 font-black">/</span>
                    <span className="text-[10px] font-black text-ink uppercase tracking-widest">v2.5 Identity Audit</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-ink tracking-tighter leading-none mb-4 uppercase">Cognitive <span className="text-sakura italic">Insights.</span></h1>
                <p className="text-xl text-ink/40 font-bold max-w-xl">Deep analysis of your linguistic trajectory in <span className="text-ink">"{progress.targetLanguage}"</span> simulation.</p>
            </div>
            <div className="flex items-center gap-6">
                <button 
                  onClick={downloadReport}
                  className="btn-premium !py-4 !px-8 flex items-center gap-3"
                >
                    <Zap size={16} /> Export Report
                </button>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-ink/20 uppercase tracking-widest mb-1">System Health</span>
                    <div className="flex items-center gap-2 text-emerald-500 font-black text-xs uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-current animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        Neural Link Active
                    </div>
                </div>
            </div>
        </div>

        {/* TOP METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card !bg-ink !text-white !p-10 !rounded-[2.5rem] relative overflow-hidden">
                <div className="flex items-center justify-between mb-12">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-sakura">
                        <Award size={24} strokeWidth={2.5} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-sakura">Knowledge XP</span>
                </div>
                <div className="text-7xl font-black text-white tracking-tighter leading-none mb-4">{progress.totalXP}</div>
                <div className="text-[10px] text-sakura font-black flex items-center gap-2 uppercase tracking-widest">
                    <TrendingUp size={14} /> Trajectory: Optimal
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card !p-10 !rounded-[2.5rem] relative overflow-hidden">
                <div className="flex items-center justify-between mb-12">
                    <div className="w-12 h-12 rounded-2xl bg-ink/5 flex items-center justify-center text-ink">
                        <Flame size={24} strokeWidth={2.5} className="text-sakura" fill="currentColor" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-ink/20">Learning Streak</span>
                </div>
                <div className="text-7xl font-black text-ink tracking-tighter leading-none mb-4">{progress.currentStreak} <span className="text-2xl text-ink/20">Days</span></div>
                <div className="text-[10px] text-ink/40 font-black uppercase tracking-widest">Continuity Sync Maintained</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card !p-10 !rounded-[2.5rem] border-4 border-sakura shadow-2xl shadow-sakura/10">
                <div className="flex items-center justify-between mb-12">
                    <div className="w-12 h-12 rounded-2xl bg-sakura/10 flex items-center justify-center text-sakura">
                        <Target size={24} strokeWidth={2.5} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-sakura">Assessed Level</span>
                </div>
                <div className="text-7xl font-black text-ink tracking-tighter leading-none mb-4">B2 <span className="text-2xl text-ink/20">Upper</span></div>
                <div className="text-[10px] text-ink font-black uppercase tracking-widest">Goal: C1 Advanced Pro</div>
            </motion.div>
        </div>

        {/* DETAILED STATS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
            <div className="lg:col-span-5 glass-card !p-12 !rounded-[3rem]">
                <h3 className="text-[10px] font-black text-ink uppercase tracking-[0.3em] mb-12 flex items-center gap-3">
                    <BarChart3 size={14} strokeWidth={3} /> Core Audit Log
                </h3>
                <div className="space-y-10">
                    {[
                        { label: "Lessons Processed", val: progress.stats?.lessonsCompleted || 0, icon: <BookOpen size={16}/> },
                        { label: "Vocabulary Density", val: progress.stats?.flashcardsReviewed || 0, icon: <Zap size={16}/> },
                        { label: "Avg Logic Score", val: "84%", icon: <Activity size={16}/> },
                        { label: "Interaction Units", val: "128", icon: <LineChart size={16}/> }
                    ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center group cursor-default">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-ink/5 flex items-center justify-center text-ink/40 group-hover:bg-ink group-hover:text-white transition-all duration-300">
                                    {item.icon}
                                </div>
                                <span className="text-lg font-bold text-ink/40 group-hover:text-ink transition-colors">{item.label}</span>
                            </div>
                            <span className="text-3xl font-black text-ink tracking-tighter">{item.val}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="lg:col-span-7 glass-card !p-12 !rounded-[3rem]">
                <h3 className="text-[10px] font-black text-sakura uppercase tracking-[0.3em] mb-12 flex items-center gap-3">
                    <PieChart size={14} strokeWidth={3} /> Proficiency Matrix
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {Object.entries(progress.skills || { grammar: 65, vocabulary: 85, speaking: 40, logic: 72 }).map(([skill, val], i) => (
                        <div key={skill} className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black uppercase tracking-widest text-ink/30">{skill}</span>
                                <span className="text-2xl font-black text-ink">{val}%</span>
                            </div>
                            <div className="h-4 bg-ink/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${val}%` }}
                                    transition={{ duration: 1.5, ease: "circOut" }}
                                    className="h-full bg-ink rounded-full"
                                ></motion.div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* PATTERN AUDIT */}
        {progress.pastMistakes && progress.pastMistakes.length > 0 && (
          <div className="glass-card !p-16 !rounded-[4rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                <ShieldCheck size={200} />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center gap-8 mb-20 border-b-2 border-ink pb-12">
                <div className="w-16 h-16 rounded-[2rem] bg-ink text-sakura flex items-center justify-center shadow-2xl shadow-ink/10">
                    <BrainCircuit size={32} strokeWidth={2.5} />
                </div>
                <div>
                    <h3 className="text-4xl font-black text-ink tracking-tighter mb-2">Cognitive Pattern Audit.</h3>
                    <p className="text-xl text-ink/40 font-bold">Historical linguistic error vectors and AI-validated resolution paths.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-10">
                {progress.pastMistakes.slice(-4).reverse().map((m, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="p-10 rounded-[2.5rem] bg-white border-2 border-ink/5 hover:border-sakura transition-all duration-500 shadow-xl shadow-ink/5 group"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-ink/5 pb-8 lg:pb-0 lg:pr-12">
                                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-6 block">Detected Anomaly</span>
                                <p className="text-2xl font-bold text-ink/30 italic leading-tight group-hover:text-ink/60 transition-colors">"{m.error}"</p>
                            </div>
                            <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-ink/5 pb-8 lg:pb-0 lg:pr-12">
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-6 block">Resolution State</span>
                                <p className="text-3xl font-black text-ink tracking-tight leading-none">{m.correction}</p>
                            </div>
                            <div className="lg:col-span-4">
                                <span className="text-[10px] font-black text-sakura uppercase tracking-widest mb-6 block">Neural Analysis</span>
                                <p className="text-sm font-black text-ink/40 uppercase tracking-widest leading-relaxed">
                                    {m.explanation || "System generated correction for optimal dialect accuracy."}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Progress;
