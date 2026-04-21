import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Layers, ChevronRight, RotateCw, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";

function Flashcards() {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState(
    () => localStorage.getItem("targetLanguage") || "Spanish"
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setTargetLanguage(localStorage.getItem("targetLanguage") || "Spanish");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const fetchCards = useCallback(async (lang) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/features/flashcards?lang=${lang}`
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
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/features/refresh?lang=${targetLanguage}`
      );
      toast.info(`Regenerating ${targetLanguage} content with AI...`);
      await fetchCards(targetLanguage);
      toast.success("Fresh flashcards generated!");
    } catch (error) {
      toast.error("Regeneration failed. Please try again.");
    } finally {
      setRegenerating(false);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  if (loading)
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>✨</div>
          <p style={{ color: "var(--c-acc2)", fontWeight: 600 }}>
            Generating {targetLanguage} flashcards with AI...
          </p>
          <p style={{ color: "var(--c-text3)", fontSize: "0.8rem", marginTop: "0.5rem" }}>
            This may take a few seconds for new languages
          </p>
        </div>
      </div>
    );

  if (!cards.length)
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        No Flashcards Available
      </div>
    );

  const currentCard = cards[currentIndex];

  return (
    <div className="min-h-screen p-6 py-24 animate-fadeUp flex flex-col items-center">
      <div className="w-full max-w-2xl text-center mb-12">
        <div className="w-16 h-16 rounded-2xl bg-acc2/10 border border-acc2/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(155,114,245,0.1)]">
          <Layers size={32} className="text-acc2" />
        </div>
        <h1 className="font-display text-4xl font-bold text-t1 tracking-tight mb-2">
          {targetLanguage} Vocabulary
        </h1>
        <p className="text-t2 text-sm uppercase tracking-[2px]">
          Card {currentIndex + 1} of {cards.length}
        </p>

        {/* Regenerate button */}
        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          style={{
            marginTop: "1rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 14px",
            borderRadius: "8px",
            border: "1px solid var(--c-border)",
            background: "var(--c-surface2)",
            color: "var(--c-text3)",
            fontSize: "0.75rem",
            cursor: regenerating ? "not-allowed" : "pointer",
            opacity: regenerating ? 0.5 : 1,
            transition: "all 0.2s",
          }}
          title="Generate fresh AI content for this language"
        >
          <RefreshCw size={12} style={{ animation: regenerating ? "spin 1s linear infinite" : "none" }} />
          {regenerating ? "Regenerating..." : "Regenerate with AI"}
        </button>
      </div>

      {/* Card Container */}
      <div
        className="w-full max-w-sm h-72 relative cursor-pointer group rounded-3xl"
        style={{ perspective: "1000px" }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className="w-full h-full absolute top-0 left-0 transition-transform duration-700 glass-card flex items-center justify-center flex-col shadow-2xl"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            backgroundColor: isFlipped ? "var(--c-surface3)" : "var(--c-surface2)",
          }}
        >
          {/* Front */}
          <div
            className="absolute w-full h-full flex flex-col items-center justify-center backface-hidden p-8"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="text-sm font-bold text-acc2 uppercase tracking-[2px] mb-6 block absolute top-8">
              {currentCard.language}
            </span>
            <h2 className="text-5xl font-display font-bold text-t1 text-center">
              {currentCard.word}
            </h2>
            {currentCard.category && (
              <span style={{
                position: "absolute", bottom: "3.5rem",
                fontSize: "0.7rem", color: "var(--c-text3)",
                background: "var(--c-surface3)", padding: "2px 8px",
                borderRadius: "999px", border: "1px solid var(--c-border)"
              }}>
                {currentCard.category}
              </span>
            )}
            <div className="text-t3 text-xs flex items-center gap-2 mt-8 absolute bottom-8 opacity-60">
              <RotateCw size={14} /> Click to flip
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute w-full h-full flex flex-col items-center justify-center backface-hidden p-8"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <span className="text-sm font-bold text-acc uppercase tracking-[2px] mb-4 block absolute top-8">
              English
            </span>
            <h2 className="text-4xl font-display font-bold text-acc text-center mb-2">
              {currentCard.translation}
            </h2>
            {currentCard.pronunciation && (
              <p className="text-t2 text-sm italic opacity-80 mt-2">
                "{currentCard.pronunciation}"
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 w-full max-w-sm flex gap-4">
        <button
          onClick={handleNext}
          className="btn-primary w-full py-4 flex items-center justify-center gap-2 group bg-acc border-acc hover:shadow-[0_0_30px_rgba(13,255,176,0.2)]"
        >
          Next Card <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

export default Flashcards;
