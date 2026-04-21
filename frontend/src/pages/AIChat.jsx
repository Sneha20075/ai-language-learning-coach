import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { 
    Send, 
    Sparkles, 
    Zap, 
    Target, 
    CheckCircle2, 
    MessageCircle, 
    Terminal, 
    TrendingUp,
    LayoutDashboard,
    Cpu,
    ImagePlus,
    X
} from "lucide-react";
import "./AIChat.css";

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am your **AI Language Coach**. Let's sharpen your logic and grammar. What's on your mind today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      metrics: { Grammar: 0, Logic: 0, Persuasion: 0 }
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState(null);
  const [imageMimeType, setImageMimeType] = useState(null);
  const [lastMetrics, setLastMetrics] = useState(null);
  const [mode, setMode] = useState("coach"); // 'coach' or 'roleplay'
  const [targetLanguage, setTargetLanguage] = useState(() => localStorage.getItem("targetLanguage") || "Spanish");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setTargetLanguage(localStorage.getItem("targetLanguage") || "Spanish");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo || !userInfo.token) {
      toast.warning("Please login to access the AI Coach.");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { 
        sender: "user", 
        text: input || (imageBase64 ? "Detect objects in this image." : ""), 
        image: imageBase64,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    const currentImg = imageBase64;
    const currentMime = imageMimeType;
    setImageBase64(null);
    setImageMimeType(null);
    setLoading(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo?.token;
      
      console.log("Sending prompt to AI:", userMessage.text);
      
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/ai/chat`,
        { 
            prompt: userMessage.text,
            imageBase64: currentImg ? currentImg.split(',')[1] : null,
            imageMimeType: currentMime,
            mode,
            language: targetLanguage
        },
        { 
            headers: { Authorization: `Bearer ${token}` },
            timeout: 15000 // 15s timeout
        }
      );

      if (res.data.success) {
        setMessages((prev) => [
            ...prev, 
            { 
                sender: "ai", 
                text: res.data.data, 
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                metrics: res.data.metrics
            }
        ]);
        setLastMetrics(res.data.metrics);
        if (res.data.metrics.Logic > 85) {
            toast.info("🔥 Exceptional logic score!");
        }
      }
    } catch (error) {
      console.error("AI Communication Error:", error);
      const errMsg = error.response?.data?.message || "AI Tool Connection Failed. Please check the server.";
      toast.error(errMsg);
      
      // Add error message to chat so user knows what happened
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `⚠️ **System Error:** ${errMsg}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const setPrompt = (p) => setInput(p);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
        setImageMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="aichat-google-wrapper">
      <div className="aichat-main-container">
        
        {/* --- SIDEBAR --- */}
        <aside className="aichat-sidebar motion-safe:animate-fadeUp">
            <div className="sidebar-group">
                <div className="sidebar-label flex items-center gap-2">
                    <Sparkles size={12} className="text-acc" />
                    Recommended Training
                </div>
                <div className="topic-list mt-4">
                    {[
                        "Debate Climate Change",
                        "Ethics of AI Ethics",
                        "Universal Basic Income",
                        "Pitch Your Idea",
                        "Grammar Audit"
                    ].map((t, i) => (
                        <motion.button 
                            whileHover={{ x: 6 }}
                            whileTap={{ scale: 0.98 }}
                            key={i} className="topic-btn" onClick={() => setPrompt(t)}
                        >
                            {t}
                        </motion.button>
                    ))}
                </div>
            </div>
            
            <div className="mt-auto">
                <div className="sidebar-label mb-4 flex items-center gap-2">
                    <TrendingUp size={12} className="text-acc2" />
                    Target Language Metrics
                </div>
                <div className="glass-stats">
                    {lastMetrics ? (
                        <div className="space-y-4">
                            {Object.entries(lastMetrics).map(([key, val]) => (
                                <div key={key} className="space-y-1">
                                    <div className="flex justify-between text-[0.6rem] text-muted font-bold uppercase tracking-wider">
                                        <span>{key}</span>
                                        <span style={{ color: "var(--c-accent)" }}>{val}%</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${val}%` }}
                                            style={{ background: "linear-gradient(90deg, var(--c-accent), var(--c-accent2))" }}
                                            className="h-full"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-[0.7rem] text-muted italic leading-relaxed">Submit an argument to see real-time AI performance analysis.</div>
                    )}
                </div>
            </div>
        </aside>

        {/* --- CHAT MAIN --- */}
        <div className="aichat-chat-area motion-safe:animate-fadeUp" style={{ animationDelay: '0.1s' }}>
          <header className="aichat-header-p">
             <div className="flex items-center gap-4">
                <div className="p-2 bg-acc/10 rounded-xl border border-border">
                    <Cpu size={20} className="text-acc" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-t1 leading-none mb-1">AI Language Coach</h2>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                        <span className="text-[0.62rem] text-muted uppercase tracking-widest font-bold">Protocol: Gemini 1.5 Flash</span>
                    </div>
                </div>
             </div>
             <div className="premium-pill" style={{ cursor: "pointer", background: mode === 'roleplay' ? 'var(--c-accent2)' : '' }} onClick={() => setMode(mode === "coach" ? "roleplay" : "coach")}>
                <Target size={12} />
                {mode === "coach" ? "COACH MODE" : "ROLEPLAY MODE"}
             </div>
          </header>

          <div className="aichat-messages-p">
            <AnimatePresence>
                {messages.map((msg, idx) => (
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={idx} className={`msg-p ${msg.sender === "user" ? "msg-user" : "msg-ai"}`}
                >
                    <div className="bubble-p">
                        {msg.image && <img src={msg.image} alt="upload" className="max-w-[200px] rounded-lg mb-3 border border-border" />}
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                    <div className="msg-meta flex items-center gap-2 mt-1">
                        {msg.sender === 'ai' ? <Sparkles size={10} /> : <MessageCircle size={10} />}
                        {msg.time} • {msg.sender === "user" ? "USER_LOG" : "SYSTEM_CORE"}
                    </div>
                </motion.div>
                ))}
            </AnimatePresence>
            
            {loading && (
              <div className="msg-p msg-ai">
                <div className="bubble-p bg-transparent border-none p-0 flex gap-2">
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 rounded-full bg-acc"></motion.div>
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 rounded-full bg-acc2"></motion.div>
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 rounded-full bg-acc3"></motion.div>
                </div>
                <div className="text-[0.6rem] text-muted mt-2 font-mono tracking-widest uppercase">Analyzing semantics & structure...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-container-p relative">
            {imageBase64 && (
                <div className="absolute bottom-[100%] mb-2 left-0 p-2 bg-surface2 rounded-xl border border-border flex items-start gap-2 shadow-xl animate-fadeUp">
                    <img src={imageBase64} alt="preview" className="h-16 w-auto rounded-lg object-cover" />
                    <button onClick={() => setImageBase64(null)} className="p-1 bg-surface3 hover:bg-red-500/20 text-muted hover:text-red-500 rounded-full transition-colors">
                        <X size={14} />
                    </button>
                </div>
            )}
            <form onSubmit={handleSend} className="input-box-p group">
                <label className="p-3 text-muted hover:text-acc transition-colors cursor-pointer shrink-0">
                    <ImagePlus size={18} />
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={loading} />
                </label>
                <div className="p-1 text-muted shrink-0 flex items-center hidden sm:flex">
                    <Terminal size={18} />
                </div>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={imageBase64 ? "Ask about this image..." : "Enter your argument or sentence..."}
                    autoFocus
                    disabled={loading}
                    autoComplete="off"
                />
                <button type="submit" className="send-btn-p shrink-0" disabled={loading || (!input.trim() && !imageBase64)}>
                    <Send size={18} />
                </button>
            </form>
            <div className="flex gap-5 mt-3 px-1">
                <div className="flex items-center gap-1.5 text-[0.62rem] text-muted font-medium">
                    <CheckCircle2 size={10} style={{ color: "var(--c-accent)" }} />
                    AI Reasoning Enabled
                </div>
                <div className="flex items-center gap-1.5 text-[0.62rem] text-muted font-medium">
                    <Zap size={10} className="text-acc3" />
                    Sub-second Latency
                </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIChat;
