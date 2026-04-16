import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
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
    LayoutDashboard
} from "lucide-react";
import "./AIChat.css";

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am your **AI Language Coach**. Let's sharpen your logic and grammar. What's on your mind?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      metrics: { Grammar: 0, Logic: 0, Persuasion: 0 }
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastMetrics, setLastMetrics] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo || !userInfo.token) {
      toast.warning("Please login to access the AI Chat.");
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
        text: input, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo?.token;
      
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/ai/chat`,
        { prompt: userMessage.text },
        { headers: { Authorization: `Bearer ${token}` } }
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
        if (res.data.metrics.Logic > 80) {
            toast.info("🔥 High logic score detected!");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to communicate with AI.");
    } finally {
      setLoading(false);
    }
  };

  const setPrompt = (p) => setInput(p);

  return (
    <div className="aichat-google-wrapper">
      <div className="aichat-main-container">
        
        {/* --- SIDEBAR --- */}
        <aside className="aichat-sidebar">
            <div className="sidebar-group">
                <div className="sidebar-label flex items-center gap-2">
                    <Sparkles size={12} className="text-acc" />
                    Recommended Training
                </div>
                <div className="topic-list">
                    {[
                        "Debate Climate Change",
                        "Ethics of AI",
                        "Universal Basic Income",
                        "Practice Pitching",
                        "Grammar Audit"
                    ].map((t, i) => (
                        <motion.button 
                            whileHover={{ x: 4 }}
                            key={i} className="topic-btn" onClick={() => setPrompt(t)}
                        >
                            {t}
                        </motion.button>
                    ))}
                </div>
            </div>
            
            <div className="mt-auto">
                <div className="sidebar-label mb-4">Live Insights</div>
                <div className="glass-stats">
                    {lastMetrics ? (
                        <div className="space-y-4">
                            {Object.entries(lastMetrics).map(([key, val]) => (
                                <div key={key} className="space-y-1">
                                    <div className="flex justify-between text-[0.65rem] text-muted font-bold uppercase">
                                        <span>{key}</span>
                                        <span className="text-t1">{val}%</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${val}%` }}
                                            className="h-full bg-gradient-to-r from-acc to-acc2"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-[0.7rem] text-muted italic">Send a message to see performance analysis.</div>
                    )}
                </div>
            </div>
        </aside>

        {/* --- CHAT MAIN --- */}
        <div className="aichat-chat-area">
          <header className="aichat-header-p">
             <div className="flex items-center gap-4">
                <div className="p-2 bg-acc/10 rounded-xl border border-border">
                    <LayoutDashboard size={20} className="text-acc" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-t1 leading-none mb-1">Coach Pro</h2>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                        <span className="text-[0.6rem] text-muted uppercase tracking-widest font-bold">Latency: 42ms</span>
                    </div>
                </div>
             </div>
             <div className="premium-pill">
                <Target size={12} />
                ADVANCED LOGIC MODE
             </div>
          </header>

          <div className="aichat-messages-p">
            <AnimatePresence>
                {messages.map((msg, idx) => (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={idx} className={`msg-p ${msg.sender === "user" ? "msg-user" : "msg-ai"}`}
                >
                    <div className="bubble-p">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                    <div className="msg-meta flex items-center gap-2">
                        {msg.sender === 'ai' ? <Sparkles size={10} /> : <MessageCircle size={10} />}
                        {msg.time} • {msg.sender === "user" ? "YOU" : "SYSTEM"}
                    </div>
                </motion.div>
                ))}
            </AnimatePresence>
            
            {loading && (
              <div className="msg-p msg-ai">
                <div className="bubble-p bg-transparent border-none p-0 flex gap-1.5">
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 rounded-full bg-acc"></motion.div>
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 rounded-full bg-acc2"></motion.div>
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 rounded-full bg-muted"></motion.div>
                </div>
                <div className="text-[0.6rem] text-muted mt-2 font-mono">ANALYZING LOGICAL STRUCTURE...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-container-p">
            <form onSubmit={handleSend} className="input-box-p group">
                <div className="p-2 text-muted group-focus-within:text-acc transition-colors">
                    <Terminal size={18} />
                </div>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Input argument or query system..."
                    autoFocus
                    disabled={loading}
                />
                <button type="submit" className="send-btn-p" disabled={loading || !input.trim()}>
                    <Send size={18} />
                </button>
            </form>
            <div className="flex gap-4 mt-3 px-1">
                <div className="flex items-center gap-1 text-[0.6rem] text-muted">
                    <CheckCircle2 size={10} className="text-green-500" />
                    End-to-End Encrypted
                </div>
                <div className="flex items-center gap-1 text-[0.6rem] text-muted">
                    <Zap size={10} className="text-yellow-500" />
                    Gemini 2.5 Flash
                </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIChat;
