import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, RefreshCw, Zap, MessageCircle, HelpCircle, Activity, Sparkles, Languages, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

function Learn() {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState({});
  const [targetLanguage, setTargetLanguage] = useState(() => localStorage.getItem("targetLanguage") || "Spanish");

  const [synced, setSynced] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const fetchLesson = useCallback(async (lang) => {
    setLoading(true);
    try {
      const userInfoStr = localStorage.getItem("userInfo");
      const token = userInfoStr ? JSON.parse(userInfoStr).token : null;

      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/features/lesson?lang=${lang}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setLesson(res.data.data);
        setSynced(false);
      }
    } catch (error) {
      toast.error("Curriculum sync failed.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLesson(targetLanguage); }, [targetLanguage, fetchLesson]);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const userInfoStr = localStorage.getItem("userInfo");
      const token = userInfoStr ? JSON.parse(userInfoStr).token : null;

      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/features/refresh?lang=${targetLanguage}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchLesson(targetLanguage);
      toast.success("Intelligence modules reloaded.");
    } catch (error) {
      toast.error("Reload error.");
    } finally {
      setRegenerating(false);
    }
  };

  const handleCompleteLesson = async () => {
    if (!lesson) return;
    setSyncing(true);
    try {
      const userInfoStr = localStorage.getItem("userInfo");
      const token = userInfoStr ? JSON.parse(userInfoStr).token : null;

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/features/lessons/complete`,
        { lessonId: lesson._id, score: 100 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success("Progress synchronized with Profile! +20 XP");
        setSynced(true);
      }
    } catch (error) {
      toast.error("Failed to sync progress. Verify identity.");
      console.error(error);
    } finally {
      setSyncing(false);
    }
  };

  const checkAnswer = (qIdx, opt) => {
    setSelectedAnswer({ ...selectedAnswer, [qIdx]: opt });
    if (opt === lesson.miniQuiz[qIdx].correctAnswer) {
        toast.success("Validation Successful. +20 XP");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-washi">
        <div className="relative">
            <Activity size={48} className="text-sakura animate-pulse" />
            <div className="absolute inset-0 bg-sakura/20 blur-2xl rounded-full"></div>
        </div>
        <p className="mt-8 text-ink font-black uppercase tracking-[0.3em] text-[10px]">Synchronizing Neural Curricula...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-washi pt-40 pb-32">
      <div className="container-premium">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24 border-b-4 border-ink pb-12">
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <span className="pill-badge text-sakura border-sakura">Active Simulation</span>
                    <span className="text-ink/20 font-black">/</span>
                    <span className="text-[10px] font-black text-ink uppercase tracking-widest">{targetLanguage} Mastery</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-ink tracking-tighter leading-none mb-4 uppercase">Academy <span className="text-sakura italic">Lab.</span></h1>
                <p className="text-xl text-ink/40 font-bold max-w-xl">Optimized lesson structure for the <span className="text-ink">"{lesson?.title}"</span> simulation.</p>
            </div>
            <button onClick={handleRegenerate} disabled={regenerating} className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-ink text-white font-black text-[10px] uppercase tracking-widest hover:bg-sakura transition-all duration-500 shadow-2xl shadow-ink/20">
                <RefreshCw size={14} strokeWidth={3} className={regenerating ? "animate-spin" : ""} />
                {regenerating ? "Reloading..." : "Reload Simulation"}
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* SIDEBAR */}
            <div className="lg:col-span-4 space-y-12">
                {/* 1. Primary Term */}
                {lesson?.wordOfTheDay && (
                    <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} className="glass-card !bg-ink !text-white !p-10 !rounded-[2.5rem] relative overflow-hidden">
                        <Languages size={120} className="absolute -right-8 -bottom-8 text-sakura opacity-5 rotate-12" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-sakura mb-12 block">Core Vocabulary Node</span>
                        <h2 className="text-6xl font-black text-white mb-2 tracking-tighter">{lesson.wordOfTheDay.word}</h2>
                        <p className="text-lg font-bold text-sakura mb-10">/ {lesson.wordOfTheDay.pronunciation} /</p>
                        <div className="pt-10 border-t border-white/10">
                            <span className="text-[10px] font-black text-white/40 block mb-2 uppercase tracking-widest">Neural Translation</span>
                            <p className="text-3xl font-black">{lesson.wordOfTheDay.translation}</p>
                        </div>
                    </motion.div>
                )}

                {/* 2. Grammar Protocol */}
                {lesson?.grammarTip && (
                    <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass-card !p-10 !rounded-[2.5rem]">
                        <h4 className="text-[10px] font-black text-sakura uppercase tracking-widest mb-8 flex items-center gap-3">
                            <Zap size={14} strokeWidth={3} /> Grammar Intelligence
                        </h4>
                        <h5 className="text-2xl font-black text-ink mb-6 tracking-tight leading-tight">{lesson.grammarTip.title}</h5>
                        <p className="text-lg text-ink/40 font-bold leading-snug">{lesson.grammarTip.explanation}</p>
                    </motion.div>
                )}
            </div>

            {/* MAIN CONTENT */}
            <div className="lg:col-span-8 space-y-12">
                {/* 3. Scenario Drill */}
                {lesson?.practiceDialogue?.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="glass-card !p-12 !rounded-[3rem]">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 border-b border-ink/5 pb-10">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-ink text-sakura flex items-center justify-center shadow-2xl shadow-ink/10">
                                    <MessageCircle size={24} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-ink tracking-tight">Contextual Drill.</h3>
                                    <p className="text-[10px] font-black text-ink/30 uppercase tracking-widest">Real-world Scenario Interaction</p>
                                </div>
                            </div>
                            <span className="pill-badge text-ink/40 border-ink/10">Immersive v2</span>
                        </div>

                        <div className="space-y-12">
                            {lesson.practiceDialogue.map((d, i) => (
                                <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'items-start' : 'items-end'}`}>
                                    <div className={`max-w-[85%] p-8 rounded-[2rem] shadow-xl ${i % 2 === 0 ? 'bg-white text-ink border border-ink/5' : 'bg-ink text-white shadow-ink/20'}`}>
                                        <p className="font-black text-2xl mb-4 tracking-tight leading-none">{d.text}</p>
                                        <p className={`text-sm font-bold uppercase tracking-widest ${i % 2 === 0 ? 'text-ink/40' : 'text-sakura'}`}>{d.translation}</p>
                                    </div>
                                    <span className="text-[10px] font-black text-ink/20 uppercase mt-4 px-4 tracking-[0.2em]">Source Entity {d.speaker}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* 4. Academy Validation */}
                {lesson?.miniQuiz?.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card !p-12 !rounded-[3rem] border-4 border-sakura shadow-2xl shadow-sakura/10">
                        <div className="text-center mb-16">
                            <Sparkles size={40} className="text-sakura mx-auto mb-6" fill="currentColor" />
                            <h3 className="text-4xl font-black text-ink tracking-tighter uppercase">Validation Quiz.</h3>
                            <p className="text-[10px] font-black text-sakura uppercase tracking-widest mt-2">Neural Link Verification</p>
                        </div>

                        <div className="space-y-16">
                            {lesson.miniQuiz.map((q, i) => (
                                <div key={i} className="relative">
                                    <div className="absolute -left-16 top-0 w-10 h-10 rounded-full border-4 border-ink flex items-center justify-center font-black text-xs">
                                        {i+1}
                                    </div>
                                    <p className="text-2xl font-black text-ink mb-10 leading-tight">{q.question}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {q.options.map((opt, idx) => (
                                            <button 
                                                key={idx} 
                                                onClick={() => checkAnswer(i, opt)}
                                                className={`p-6 rounded-2xl border-2 font-black text-sm uppercase tracking-widest transition-all duration-500
                                                    ${selectedAnswer[i] === opt 
                                                        ? (opt === q.correctAnswer ? 'bg-ink text-white border-ink shadow-2xl -translate-y-2' : 'bg-rose-500 border-rose-500 text-white scale-95')
                                                        : 'border-ink/5 text-ink/40 hover:border-ink hover:text-ink bg-white'
                                                    }`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>

        {/* 5. Session Complete Summary */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-32 p-16 glass-card !rounded-[4rem] text-center"
        >
            <CheckCircle2 className="mx-auto text-sakura mb-8 animate-bounce" size={64} strokeWidth={2.5} />
            <h3 className="text-5xl md:text-7xl font-black text-ink tracking-tighter mb-4 uppercase">Node Processed.</h3>
            <p className="text-lg text-ink/40 font-bold mb-16 uppercase tracking-[0.2em]">Linguistic Data Synchronized with Identity Profile</p>
            
            <div className="flex flex-col md:flex-row justify-center items-center gap-16 md:gap-32">
                <div className="text-center">
                    <div className="text-7xl font-black text-ink tracking-tighter leading-none mb-2">+20</div>
                    <div className="text-[10px] font-black text-ink/20 uppercase tracking-[0.3em]">XP Gain</div>
                </div>
                <div className="hidden md:block w-px h-24 bg-ink/5"></div>
                <div className="text-center">
                    <div className="text-7xl font-black text-sakura tracking-tighter leading-none mb-2">100%</div>
                    <div className="text-[10px] font-black text-ink/20 uppercase tracking-[0.3em]">Mastery Level</div>
                </div>
            </div>

            <div className="mt-16">
                {!synced ? (
                    <button 
                        onClick={handleCompleteLesson} 
                        disabled={syncing}
                        className="btn-premium !py-5 !px-12 mx-auto flex items-center justify-center gap-3 text-lg"
                    >
                        {syncing ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                        Sync Progress to Profile
                    </button>
                ) : (
                    <div className="p-6 bg-emerald-500/10 text-emerald-500 rounded-3xl font-black text-sm uppercase tracking-[0.2em] w-fit mx-auto border-4 border-emerald-500/20">
                         ✓ Lesson Synchronized Successfully
                    </div>
                )}
            </div>
        </motion.div>

      </div>
    </div>
  );
}

export default Learn;
