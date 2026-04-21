import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { HelpCircle, Check, X, ArrowRight, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    const handleStorageChange = () => {
      setTargetLanguage(localStorage.getItem("targetLanguage") || "Spanish");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const fetchQuiz = useCallback(async (lang) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/features/quiz?lang=${lang}`
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
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/features/refresh?lang=${targetLanguage}`
      );
      toast.info(`Generating fresh ${targetLanguage} quiz with AI...`);
      await fetchQuiz(targetLanguage);
      toast.success("New quiz generated!");
    } catch (error) {
      toast.error("Regeneration failed. Please try again.");
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
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🧠</div>
          <p style={{ color: "var(--c-acc3)", fontWeight: 600 }}>
            Generating {targetLanguage} quiz with AI...
          </p>
          <p style={{ color: "var(--c-text3)", fontSize: "0.8rem", marginTop: "0.5rem" }}>
            This may take a few seconds for new languages
          </p>
        </div>
      </div>
    );

  if (!quiz)
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        No Quiz Available
      </div>
    );

  const isFinished = currentQIndex >= quiz.questions.length;

  if (isFinished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fadeUp">
        <div className="glass-card p-12 text-center max-w-sm w-full">
          <h2 className="text-4xl font-display font-bold text-t1 mb-2">Quiz Complete!</h2>
          <p className="text-t2 mb-8">
            You scored {score} out of {quiz.questions.length} in {targetLanguage}
          </p>
          <div className="text-6xl font-black text-acc mb-10">
            {Math.round((score / quiz.questions.length) * 100)}%
          </div>
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="btn-primary w-full py-4 text-sm mb-3 flex items-center justify-center gap-2"
            style={{ background: "var(--c-surface3)", borderColor: "var(--c-border)", color: "var(--c-text2)" }}
          >
            <RefreshCw size={16} /> Try New Quiz
          </button>
          <button onClick={() => navigate("/")} className="btn-primary w-full py-4 text-sm">
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQIndex];

  return (
    <div className="min-h-screen p-6 py-24 animate-fadeUp flex flex-col items-center">
      <div className="w-full max-w-2xl text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-acc3/10 border border-acc3/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(255,159,67,0.1)]">
          <HelpCircle size={32} className="text-acc3" />
        </div>
        <h1 className="font-display text-3xl font-bold text-t1 tracking-tight mb-2">
          {quiz.title}
        </h1>
        <p className="text-t3 text-xs uppercase tracking-[2px]">
          Question {currentQIndex + 1} of {quiz.questions.length}
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
          title="Generate new AI quiz for this language"
        >
          <RefreshCw size={12} />
          {regenerating ? "Generating..." : "New Quiz (AI)"}
        </button>
      </div>

      <div className="w-full max-w-lg glass-card p-8">
        <h3 className="text-xl font-medium text-t1 mb-8 text-center">
          {currentQ.questionText}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            let bgColor = "bg-surface2 border-border hover:border-acc3/50";
            let icon = null;

            if (isAnswered) {
              if (opt === currentQ.correctAnswer) {
                bgColor = "bg-acc/10 border-acc text-acc";
                icon = <Check size={18} />;
              } else if (opt === selectedOption) {
                bgColor = "bg-[#ff4d4d]/10 border-[#ff4d4d] text-[#ff4d4d]";
                icon = <X size={18} />;
              } else {
                bgColor = "bg-surface2 border-border opacity-50";
              }
            } else if (selectedOption === opt) {
              bgColor = "bg-surface3 border-acc3";
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelect(opt)}
                className={`w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all duration-300 ${bgColor}`}
              >
                <span className="font-medium">{opt}</span>
                {icon}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-8 pt-6 border-t border-white/5 animate-fadeUp">
            {/* Show correct answer explanation */}
            <p className="text-xs text-t3 text-center mb-4">
              ✅ Correct answer: <span className="text-acc font-bold">{currentQ.correctAnswer}</span>
            </p>
            <button
              onClick={handleNext}
              className="btn-primary w-full py-4 text-sm flex items-center justify-center gap-2 bg-acc3 border-acc3"
            >
              {currentQIndex === quiz.questions.length - 1 ? "Finish Assessment" : "Next Question"}
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;
