import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { HelpCircle, Check, X, ArrowRight, RefreshCw, Sparkles, Zap, BrainCircuit, Trophy, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Quiz() {
  const [quiz, setQuiz] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState(
    () => localStorage.getItem("targetLanguage") || "Spanish"
  );
  const navigate = useNavigate();

  const fetchQuiz = useCallback(async (lang) => {
    setLoading(true);
    try {
      const userInfoStr = localStorage.getItem("userInfo");
      const token = userInfoStr ? JSON.parse(userInfoStr).token : null;

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/features/quiz?lang=${lang}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setQuiz(res.data.data);
        setCurrentQIndex(0);
        setScore(0);
        setSelectedOption(null);
        setIsAnswered(false);
      }
    } catch (error) {
      toast.error("Failed to load quiz.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuiz(targetLanguage);
  }, [targetLanguage, fetchQuiz]);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const userInfoStr = localStorage.getItem("userInfo");
      const token = userInfoStr ? JSON.parse(userInfoStr).token : null;

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/features/refresh?lang=${targetLanguage}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchQuiz(targetLanguage);
      toast.success("Intelligence re-calibrated.");
    } catch (error) {
      toast.error("Regeneration failed.");
    } finally {
      setRegenerating(false);
    }
  };

  const handleSelect = (option) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    if (option === quiz.questions[currentQIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQIndex < quiz.questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setCurrentQIndex(currentQIndex + 1);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-washi">
        <div className="relative">
            <BrainCircuit size={48} className="text-sakura animate-pulse" />
            <div className="absolute inset-0 bg-sakura/20 blur-2xl rounded-full"></div>
        </div>
        <p className="mt-8 text-ink font-black uppercase tracking-[0.3em] text-[10px]">Processing Neural Quiz Nodes...</p>
      </div>
    );

  if (!quiz)
    return (
      <div className="min-h-screen flex items-center justify-center bg-washi">
        <p className="text-ink/40 font-black uppercase tracking-widest">No Intelligence Assessments.</p>
      </div>
    );

  const isFinished = currentQIndex >= quiz.questions.length;

  if (isFinished) {
    return (
      <div className="min-h-screen bg-washi flex flex-col items-center justify-center p-8">
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card !p-16 !rounded-[4rem] text-center max-w-2xl w-full border-4 border-ink shadow-2xl shadow-ink/20"
        >
          <div className="w-20 h-20 rounded-[2rem] bg-ink text-sakura flex items-center justify-center mx-auto mb-10 shadow-2xl">
              <Trophy size={40} strokeWidth={2.5} />
          </div>
          <h2 className="text-5xl font-black text-ink tracking-tighter mb-4 uppercase">Simulation <span className="text-sakura">Complete.</span></h2>
          <p className="text-lg text-ink/40 font-bold mb-12 uppercase tracking-widest">Assessment Logic Terminated</p>
          
          <div className="text-9xl font-black text-ink mb-16 tracking-tighter leading-none">
            {Math.round((score / quiz.questions.length) * 100)}%
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className="btn-premium-outline !py-5"
              >
                <RefreshCw size={18} className={regenerating ? "animate-spin" : ""} /> Try New Module
              </button>
              <button onClick={() => navigate("/")} className="btn-premium !py-5">
                Return Dashboard
              </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQIndex];

  return (
    <div className="min-h-screen bg-washi pt-40 pb-32 flex flex-col items-center">
      <div className="container-premium max-w-4xl text-center">
        
        <div className="flex flex-col items-center mb-16">
            <div className="flex items-center gap-3 mb-6">
                <span className="pill-badge text-sakura border-sakura">Neural Audit</span>
                <span className="text-ink/20 font-black">/</span>
                <span className="text-[10px] font-black text-ink uppercase tracking-widest">{targetLanguage} Validation</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-ink tracking-tighter leading-none mb-6 uppercase">Skill <span className="text-sakura italic">Quiz.</span></h1>
            <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-ink/20 uppercase tracking-widest">Question {currentQIndex + 1} of {quiz.questions.length}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-ink/10"></div>
                <button
                    onClick={handleRegenerate}
                    disabled={regenerating}
                    className="flex items-center gap-2 text-[10px] font-black text-sakura uppercase tracking-widest hover:opacity-70 transition-opacity"
                >
                    <RefreshCw size={12} strokeWidth={3} className={regenerating ? "animate-spin" : ""} />
                    {regenerating ? "Regenerating..." : "Reload Test"}
                </button>
            </div>
        </div>

        <div className="w-full max-w-2xl glass-card !p-12 !rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(38,29,34,0.3)]">
            <h3 className="text-3xl font-black text-ink mb-12 leading-tight tracking-tight">
                {currentQ.questionText}
            </h3>

            <div className="space-y-6">
                {currentQ.options.map((opt, idx) => {
                    let style = "border-ink/5 text-ink/40 bg-white hover:border-ink hover:text-ink";
                    let icon = null;

                    if (isAnswered) {
                        if (opt === currentQ.correctAnswer) {
                            style = "bg-ink text-white border-ink shadow-2xl";
                            icon = <CheckCircle2 size={24} strokeWidth={3} className="text-sakura" />;
                        } else if (opt === selectedOption) {
                            style = "bg-rose-500 border-rose-500 text-white shadow-2xl";
                            icon = <X size={24} strokeWidth={3} />;
                        } else {
                            style = "opacity-20 border-ink/5 text-ink/40 bg-white";
                        }
                    } else if (selectedOption === opt) {
                        style = "border-sakura text-sakura bg-sakura/5 shadow-xl";
                    }

                    return (
                        <button
                            key={idx}
                            disabled={isAnswered}
                            onClick={() => handleSelect(opt)}
                            className={`w-full text-left p-6 rounded-2xl border-4 flex items-center justify-between transition-all duration-500 font-black uppercase tracking-widest text-xs ${style}`}
                        >
                            <span>{opt}</span>
                            {icon}
                        </button>
                    );
                })}
            </div>

            <AnimatePresence>
                {isAnswered && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-12 pt-10 border-t-2 border-ink/5"
                    >
                        <button
                            onClick={handleNext}
                            className="btn-premium w-full !py-6 text-xl shadow-2xl shadow-ink/20"
                        >
                            {currentQIndex === quiz.questions.length - 1 ? "Terminate Audit" : "Initialize Next Logic"}
                            <ArrowRight size={22} strokeWidth={3} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        <div className="mt-16 flex items-center justify-center gap-8 opacity-20">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-ink"><Zap size={14}/> Instant Logic</div>
            <div className="w-1.5 h-1.5 rounded-full bg-ink"></div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-ink"><Sparkles size={14}/> Neural Accuracy</div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
