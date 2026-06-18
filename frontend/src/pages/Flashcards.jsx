import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Layers, ChevronRight, RotateCw, RefreshCw, Zap, Sparkles, Languages } from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

import { calculateNextReview } from "../utils/srs";

function Flashcards() {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState(
    () => localStorage.getItem("targetLanguage") || "Spanish"
  );

  const fetchCards = useCallback(async (lang) => {
    setLoading(true);
    try {
      const userInfoStr = localStorage.getItem("userInfo");
      const token = userInfoStr ? JSON.parse(userInfoStr).token : null;

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/features/flashcards?lang=${lang}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setCards(res.data.data);
        setCurrentIndex(0);
        setIsFlipped(false);
      }
    } catch (error) {
      toast.error("Failed to load flashcards.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCards(targetLanguage);
  }, [targetLanguage, fetchCards]);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const userInfoStr = localStorage.getItem("userInfo");
      const token = userInfoStr ? JSON.parse(userInfoStr).token : null;

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/features/refresh?lang=${targetLanguage}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCards(targetLanguage);
      toast.success("Intelligence re-mapped.");
    } catch (error) {
      toast.error("Regeneration failed.");
    } finally {
      setRegenerating(false);
    }
  };

  const submitSRS = async (quality) => {
    const card = cards[currentIndex];
    const srsData = calculateNextReview(
      quality, 
      card.repetitions || 0, 
      card.easeFactor || 2.5, 
      card.interval || 0
    );

    try {
      const userInfoStr = localStorage.getItem("userInfo");
      const token = userInfoStr ? JSON.parse(userInfoStr).token : null;

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/features/flashcards/review`,
        { cardId: card._id, ...srsData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      handleNext();
      toast.success(quality >= 3 ? "Neural connection strengthened." : "Memory node scheduled for retry.");
    } catch (error) {
      console.error("SRS Update Failed", error);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      if (cards.length > 1) {
        setCurrentIndex((prev) => (prev + 1) % cards.length);
      }
    }, 150);
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-washi">
        <div className="relative">
            <Layers size={48} className="text-sakura animate-pulse" />
            <div className="absolute inset-0 bg-sakura/20 blur-2xl rounded-full"></div>
        </div>
        <p className="mt-8 text-ink font-black uppercase tracking-[0.3em] text-[10px]">Assembling Neural Cards...</p>
      </div>
    );

  if (!cards.length)
    return (
      <div className="min-h-screen flex items-center justify-center bg-washi">
        <p className="text-ink/40 font-black uppercase tracking-widest">No Intelligence Nodes Available.</p>
      </div>
    );

  const currentCard = cards[currentIndex];

  return (
    <div className="min-h-screen bg-washi pt-40 pb-32 flex flex-col items-center">
      <div className="container-premium max-w-4xl text-center">
        
        <div className="flex flex-col items-center mb-16">
            <div className="flex items-center gap-3 mb-6">
                <span className="pill-badge text-sakura border-sakura">Vocabulary Lab</span>
                <span className="text-ink/20 font-black">/</span>
                <span className="text-[10px] font-black text-ink uppercase tracking-widest">{targetLanguage} Synthesis</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-ink tracking-tighter leading-none mb-6 uppercase">Flash <span className="text-sakura italic">Cards.</span></h1>
            <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-ink/20 uppercase tracking-widest">Node {currentIndex + 1} of {cards.length}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-ink/10"></div>
                <button
                    onClick={handleRegenerate}
                    disabled={regenerating}
                    className="flex items-center gap-2 text-[10px] font-black text-sakura uppercase tracking-widest hover:opacity-70 transition-opacity"
                >
                    <RefreshCw size={12} strokeWidth={3} className={regenerating ? "animate-spin" : ""} />
                    {regenerating ? "Regenerating..." : "Reload AI Content"}
                </button>
            </div>
        </div>

        {/* Card Container */}
        <div
            className="w-full max-w-xl aspect-[4/3] relative cursor-pointer group"
            style={{ perspective: "2000px" }}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <motion.div
                className="w-full h-full relative preserve-3d"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Front */}
                <div
                    className="absolute inset-0 backface-hidden glass-card !p-16 !rounded-[3rem] flex flex-col items-center justify-center border-4 border-ink shadow-2xl shadow-ink/20 bg-white"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    <div className="absolute top-10 left-10 flex items-center gap-3 text-ink/20">
                        <Languages size={20} strokeWidth={2.5} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{targetLanguage} Protocol</span>
                    </div>
                    
                    <h2 className="text-6xl md:text-8xl font-black text-ink tracking-tighter text-center leading-none">
                        {currentCard.word}
                    </h2>
                    
                    <div className="absolute bottom-10 flex items-center gap-3 text-ink/20 animate-bounce">
                        <RotateCw size={14} strokeWidth={3} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Audit Logic</span>
                    </div>
                </div>

                {/* Back */}
                <div
                    className="absolute inset-0 backface-hidden glass-card !p-16 !rounded-[3rem] flex flex-col items-center justify-center border-4 border-sakura shadow-2xl shadow-sakura/20 bg-ink"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                    <div className="absolute top-10 left-10 flex items-center gap-3 text-sakura/40">
                        <Sparkles size={20} strokeWidth={2.5} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Output</span>
                    </div>
                    
                    <h2 className="text-5xl md:text-7xl font-black text-sakura tracking-tighter text-center leading-tight mb-4">
                        {currentCard.translation}
                    </h2>
                    
                    {currentCard.pronunciation && (
                        <p className="text-xl font-bold text-white/40 italic">
                            / {currentCard.pronunciation} /
                        </p>
                    )}
                </div>
            </motion.div>
        </div>

        <div className="mt-16 w-full max-w-xl grid grid-cols-3 gap-6">
            <button
                onClick={() => submitSRS(1)}
                className="btn-premium-outline !py-6 text-lg !text-rose-500 !border-rose-500 hover:!bg-rose-500 hover:!text-white"
            >
                Hard
            </button>
            <button
                onClick={() => submitSRS(3)}
                className="btn-premium-outline !py-6 text-lg !text-amber-500 !border-amber-500 hover:!bg-amber-500 hover:!text-white"
            >
                Good
            </button>
            <button
                onClick={() => submitSRS(5)}
                className="btn-premium !py-6 text-lg !bg-emerald-600 hover:!bg-emerald-700"
            >
                Easy
            </button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 opacity-20">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-ink"><Zap size={14}/> Fast Mastery</div>
            <div className="w-1.5 h-1.5 rounded-full bg-ink"></div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-ink"><Languages size={14}/> Dialect Logic</div>
        </div>
      </div>
    </div>
  );
}

export default Flashcards;
