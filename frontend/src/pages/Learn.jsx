import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BookOpen, CheckCircle, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";

function Learn() {
  const [lesson, setLesson] = useState(null);
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

  const fetchLesson = useCallback(async (lang) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/features/lesson?lang=${lang}`
      );
      if (res.data.success) {
        setLesson(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load lesson.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLesson(targetLanguage);
  }, [targetLanguage, fetchLesson]);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/features/refresh?lang=${targetLanguage}`
      );
      toast.info(`Generating fresh ${targetLanguage} lesson with AI...`);
      await fetchLesson(targetLanguage);
      toast.success("New lesson generated!");
    } catch (error) {
      toast.error("Regeneration failed. Please try again.");
    } finally {
      setRegenerating(false);
    }
  };

  if (loading)
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📖</div>
          <p style={{ color: "var(--c-acc)", fontWeight: 600 }}>
            Generating {targetLanguage} lesson with AI...
          </p>
          <p style={{ color: "var(--c-text3)", fontSize: "0.8rem", marginTop: "0.5rem" }}>
            This may take a few seconds for new languages
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen p-6 py-24 animate-fadeUp flex flex-col items-center">
      <div className="w-full max-w-2xl text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-acc/10 border border-acc/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(13,255,176,0.1)]">
          <BookOpen size={32} className="text-acc" />
        </div>
        <h1 className="font-display text-4xl font-bold text-t1 tracking-tight mb-2">
          {lesson?.title || `Introduction to ${targetLanguage}`}
        </h1>
        <p className="text-t2 text-sm uppercase tracking-[2px]">
          {lesson?.language} • {lesson?.level}
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
          }}
          title="Generate a fresh AI lesson for this language"
        >
          <RefreshCw size={12} />
          {regenerating ? "Generating..." : "Regenerate with AI"}
        </button>
      </div>

      <div className="w-full max-w-4xl glass-card p-10 relative overflow-hidden group mb-8">
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-acc/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="prose prose-invert max-w-none text-t2 leading-relaxed whitespace-pre-wrap">
          {lesson?.content || "Lesson content is loading..."}
        </div>
      </div>

      {lesson?.vocabulary?.length > 0 && (
        <div className="w-full max-w-4xl">
          <h3 className="text-sm font-bold text-t1 uppercase tracking-[2px] mb-6 flex items-center gap-2">
            <CheckCircle size={16} className="text-acc" /> Core Vocabulary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lesson.vocabulary.map((vocab, idx) => (
              <div
                key={idx}
                className="bg-surface2 border border-border p-5 rounded-2xl flex justify-between items-center hover:border-acc/30 transition-all hover:-translate-y-1"
              >
                <span className="font-bold text-xl text-t1">{vocab.word}</span>
                <div style={{ textAlign: "right" }}>
                  <span className="text-acc font-medium italic block">{vocab.translation}</span>
                  {vocab.category && (
                    <span style={{ fontSize: "0.7rem", color: "var(--c-text3)" }}>
                      {vocab.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Learn;
