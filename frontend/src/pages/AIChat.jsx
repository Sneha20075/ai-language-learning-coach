import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Send, 
    Sparkles, 
    ImagePlus,
    X,
    Cpu,
    BrainCircuit,
    MessageSquare,
    Smile,
    ShieldCheck,
    BarChart3,
    Zap,
    Languages,
    Fingerprint,
    Bot
} from "lucide-react";

const AIChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      text: "### 👋 Initializing Neural Coach.\nI am your elite AI language intelligence coach. I can facilitate grammar precision, natural phrasing, and immersive practice in **any language**.\n\nProvide input in your target dialect to begin simulation.",
      sender: "ai",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [personality, setPersonality] = useState("Friendly Buddy");
  const [mode, setMode] = useState("Casual Conversation");
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const suggestions = [
    "Audit my grammar: 'I goes to school'",
    "Neural Translate: 'Nice to meet you' in Spanish",
    "Simulation: I'm at a French restaurant",
    "Daily idiom protocol: Japanese",
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Speech Recognition Setup
  useEffect(() => {
    if (window.webkitSpeechRecognition || window.SpeechRecognition) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US'; // Default, will adjust if needed

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
        handleSend(null, transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        setIsRecording(false);
        toast.error("Voice simulation interrupted.");
      };

      recognitionRef.current.onend = () => setIsRecording(false);
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      setIsRecording(true);
      recognitionRef.current?.start();
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      // Clean markdown for better speech
      const cleanText = text.replace(/[#*`_]/g, '').replace(/---METRICS---[\s\S]*/, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async (e, customInput) => {
    if (e) e.preventDefault();
    const messageText = customInput || input;
    if (!messageText.trim() && !imagePreview) return;

    const userMsg = {
      text: messageText,
      sender: "user",
      image: imagePreview,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setImagePreview(null);
    setLoading(true);

    try {
      const userInfoStr = localStorage.getItem("userInfo");
      if (!userInfoStr) {
        toast.error("Identity Verification Required.");
        navigate("/login");
        return;
      }
      const userInfo = JSON.parse(userInfoStr);
      
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/ai/chat`,
        {
          prompt: messageText,
          imageBase64: imagePreview ? imagePreview.split(",")[1] : null,
          language: localStorage.getItem("targetLanguage") || "English",
          personality,
          mode
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );

      if (res.data.success) {
        setMessages(prev => [...prev, {
          text: res.data.data,
          sender: "ai",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        speak(res.data.data);
      }
    } catch (error) {
      console.error("[AIChat] Neural Link Error:", error);
      toast.error("Neural engine momentarily unreachable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-washi flex flex-col pt-32">
      
      {/* HEADER */}
      <header className="fixed top-24 left-0 w-full z-40">
        <div className="container-premium">
            <div className="glass-card !py-4 !px-8 !rounded-2xl flex items-center justify-between shadow-2xl shadow-ink/5 border-ink/5">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-ink text-sakura flex items-center justify-center shadow-lg">
                        <Bot size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-sm font-black text-ink uppercase tracking-widest">Neural Coach v3.0</h1>
                        <div className="flex items-center gap-2 mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                            <span className="text-[10px] text-ink/40 font-black uppercase tracking-widest">{personality} Protocol</span>
                        </div>
                    </div>
                </div>
                
                <div className="hidden md:flex items-center gap-4">
                    <select 
                      value={personality} 
                      onChange={(e) => setPersonality(e.target.value)}
                      className="bg-ink/5 text-ink text-[10px] font-black uppercase tracking-widest border-none rounded-lg px-4 py-2 outline-none"
                    >
                      <option>Friendly Buddy</option>
                      <option>Strict Teacher</option>
                      <option>Cyberpunk Mentor</option>
                    </select>
                    <select 
                      value={mode} 
                      onChange={(e) => setMode(e.target.value)}
                      className="bg-sakura/10 text-sakura text-[10px] font-black uppercase tracking-widest border-none rounded-lg px-4 py-2 outline-none"
                    >
                      <option>Casual Conversation</option>
                      <option>Interview Roleplay</option>
                      <option>Travel Scenario</option>
                      <option>Grammar Audit</option>
                    </select>
                </div>
            </div>
        </div>
      </header>

      {/* MESSAGES */}
      <main className="flex-1 container-premium pt-24 pb-48 flex flex-col gap-12 overflow-y-auto scroll-hide">
          <AnimatePresence mode="popLayout">
              {messages.map((msg, idx) => (
                  <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 30, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 25 }}
                      className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                      <div className={`max-w-[85%] md:max-w-[70%] glass-card !rounded-[2.5rem] ${msg.sender === "user" ? "!bg-ink !text-white shadow-ink/20" : "!bg-white shadow-ink/5"}`}>
                          {msg.sender === "ai" && (
                              <div className="mb-6 flex items-center justify-between">
                                  <div className="flex items-center gap-3 text-sakura font-black text-[10px] uppercase tracking-[0.2em] opacity-60">
                                      <Sparkles size={14} strokeWidth={3} /> Intelligence Audit
                                  </div>
                                  <button onClick={() => speak(msg.text)} className="text-ink/20 hover:text-sakura transition-colors">
                                      <Zap size={14} fill="currentColor" />
                                  </button>
                              </div>
                          )}
                          
                          {msg.image && (
                              <motion.img 
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  src={msg.image} 
                                  className="max-w-full rounded-[1.5rem] mb-6 border-4 border-ink/5"
                                  alt="Neural context"
                              />
                          )}

                          <div className={`prose prose-slate max-w-none ${msg.sender === "user" ? "prose-invert font-black text-xl tracking-tight leading-none" : "text-lg font-bold text-ink/70"}`}>
                              <ReactMarkdown>{msg.text}</ReactMarkdown>
                          </div>
                      </div>
                      
                      <div className="mt-4 px-6 flex items-center gap-3 text-[10px] font-black text-ink/20 uppercase tracking-widest">
                          {msg.sender === "user" ? "Identity Verified" : "Neural Link"} • {msg.time}
                      </div>
                  </motion.div>
              ))}
          </AnimatePresence>

          {loading && (
              <motion.div 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  className="flex items-center gap-4 p-8 glass-card !rounded-[2rem] w-fit"
              >
                  <div className="flex gap-2">
                      <div className="w-2 h-2 bg-sakura rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-sakura rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-sakura rounded-full animate-bounce"></div>
                  </div>
                  <span className="text-[10px] font-black text-ink/30 uppercase tracking-[0.3em]">Auditing Wisdom...</span>
              </motion.div>
          )}
          <div ref={chatEndRef} />
      </main>

      {/* INPUT */}
      <footer className="fixed bottom-0 left-0 w-full p-8 z-50">
          <div className="container-premium max-w-5xl">
              
              {isRecording && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="mb-6 flex justify-center"
                >
                  <div className="voice-wave-container">
                    {[...Array(8)].map((_, i) => <div key={i} className="voice-bar" />)}
                    <span className="ml-4 text-[10px] font-black text-sakura uppercase tracking-[0.3em]">Listening...</span>
                  </div>
                </motion.div>
              )}

              <div className="flex gap-3 mb-6 overflow-x-auto scroll-hide pb-2">
                  {suggestions.map((s, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleSend(null, s)}
                        className="pill-badge !bg-white !text-ink/60 border-ink/5 whitespace-nowrap hover:!border-sakura hover:!text-sakura transition-all duration-300"
                      >
                          {s}
                      </button>
                  ))}
              </div>

              <div className="glass-card !p-3 !rounded-[2.5rem] shadow-[0_30px_80px_-15px_rgba(38,29,34,0.2)] border-ink/5">
                {imagePreview && (
                    <div className="p-4 flex gap-4">
                        <div className="relative group">
                            <img src={imagePreview} className="w-24 h-24 object-cover rounded-2xl border-4 border-ink/5" alt="preview" />
                            <button onClick={() => setImagePreview(null)} className="absolute -top-3 -right-3 bg-sakura text-white rounded-full p-1.5 shadow-xl hover:scale-110 transition-all">
                                <X size={14} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSend} className="flex items-center gap-2">
                    <label className="w-14 h-14 flex items-center justify-center text-ink/20 hover:text-sakura transition-colors cursor-pointer">
                        <ImagePlus size={24} strokeWidth={2.5} />
                        <input type="file" className="hidden" onChange={handleImage} accept="image/*" />
                    </label>

                    <button 
                        type="button"
                        onClick={toggleRecording}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isRecording ? "bg-sakura text-white shadow-sakura/50 scale-110" : "text-ink/20 hover:text-sakura"}`}
                    >
                        <Fingerprint size={28} strokeWidth={2.5} className={isRecording ? "animate-pulse" : ""} />
                    </button>
                    
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isRecording ? "Listening to neural input..." : "Neural prompt..."}
                        className="flex-1 bg-transparent border-none outline-none py-4 px-2 text-xl font-black text-ink placeholder:text-ink/10"
                    />

                    <button 
                        type="submit" 
                        disabled={loading || (!input.trim() && !imagePreview)}
                        className="w-14 h-14 bg-ink text-sakura rounded-2xl flex items-center justify-center shadow-2xl shadow-ink/20 hover:bg-sakura hover:text-white transition-all duration-500 disabled:opacity-20"
                    >
                        <Send size={24} strokeWidth={2.5} />
                    </button>
                </form>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default AIChat;
