import { useState, useEffect } from "react";
import axios from "axios";
import { TrendingUp, Award, Flame, Target, Book, BrainCircuit } from "lucide-react";
import { toast } from "react-toastify";

function Progress() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [targetLanguage, setTargetLanguage] = useState(() => localStorage.getItem("targetLanguage") || "Spanish");

  useEffect(() => {
    const handleStorageChange = () => {
      setTargetLanguage(localStorage.getItem("targetLanguage") || "Spanish");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/features/progress?lang=${targetLanguage}`);
        if (res.data.success) {
          setProgress(res.data.data);
        }
      } catch (error) {
        toast.error("Failed to load progress.");
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [targetLanguage]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-acc3">Loading Dashboard...</div>;
  if (!progress) return <div className="min-h-screen flex items-center justify-center text-t1">No Progress Data Found</div>;

  return (
    <div className="min-h-screen p-6 py-24 animate-fadeUp">
      <div className="max-w-[900px] mx-auto">
        <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 rounded-2xl bg-acc3/10 border border-acc3/20 flex items-center justify-center shadow-[0_0_30px_rgba(255,159,67,0.1)]">
                <TrendingUp size={32} className="text-acc3" />
            </div>
            <div>
                <h1 className="font-display text-4xl font-bold text-t1 tracking-tight">Your Progress</h1>
                <p className="text-t2 text-sm mt-1">Level {progress.level} • {progress.targetLanguage}</p>
            </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card p-6 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                    <Award size={100} />
                </div>
                <span className="text-xs font-bold text-t3 uppercase tracking-[2px] mb-2">Total XP</span>
                <span className="text-4xl font-display font-bold text-acc">{progress.totalXP}</span>
            </div>
            <div className="glass-card p-6 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform text-[#ff4d4d]">
                    <Flame size={100} />
                </div>
                <span className="text-xs font-bold text-t3 uppercase tracking-[2px] mb-2">Current Streak</span>
                <span className="text-4xl font-display font-bold text-[#ff4d4d]">{progress.currentStreak} Days</span>
            </div>
            <div className="glass-card p-6 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform text-acc2">
                    <Target size={100} />
                </div>
                <span className="text-xs font-bold text-t3 uppercase tracking-[2px] mb-2">Longest Streak</span>
                <span className="text-4xl font-display font-bold text-acc2">{progress.longestStreak} Days</span>
            </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-8">
                <h3 className="text-lg font-bold text-t1 mb-6 flex items-center gap-2">
                    <Book size={18} className="text-acc2" /> Activity Breakdown
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-t2 text-sm">Lessons Completed</span>
                        <span className="font-bold text-t1">{progress.stats?.lessonsCompleted || 0}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-t2 text-sm">Flashcards Reviewed</span>
                        <span className="font-bold text-t1">{progress.stats?.flashcardsReviewed || 0}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-t2 text-sm">Quizzes Passed</span>
                        <span className="font-bold text-t1">{progress.stats?.quizzesPassed || 0} / {progress.stats?.quizzesAttempted || 0}</span>
                    </div>
                </div>
            </div>

            <div className="glass-card p-8">
                <h3 className="text-lg font-bold text-t1 mb-6 flex items-center gap-2">
                    <BrainCircuit size={18} className="text-acc" /> Skill Mastery
                </h3>
                <div className="space-y-5">
                    {Object.entries(progress.skills || { grammar: 45, vocabulary: 80, speaking: 20 }).map(([skill, val], i) => (
                        <div key={skill}>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="uppercase tracking-[1px] font-bold text-t3">{skill}</span>
                                <span className="text-acc font-medium">{val}%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-acc rounded-full" style={{ width: `${val}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}

export default Progress;
