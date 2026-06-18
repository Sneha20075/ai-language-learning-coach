import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Sparkles, Bot, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FloatingAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-10 right-10 z-[2000]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            className="absolute bottom-24 right-0 w-80 glass-card !p-8 !rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(38,29,34,0.4)] border-sakura/20 bg-white"
          >
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-ink text-sakura flex items-center justify-center shadow-2xl">
                    <Bot size={24} strokeWidth={2.5} />
                </div>
                <div>
                    <h4 className="text-sm font-black text-ink uppercase tracking-widest leading-none">Neural Support</h4>
                    <span className="text-[10px] text-sakura font-black uppercase tracking-widest">Active Assistant</span>
                </div>
            </div>
            
            <p className="text-sm font-bold text-ink/40 mb-8 leading-tight">
                Quick Access to the Neural Engine. I can facilitate dialect conversion or logical audits.
            </p>

            <button 
                onClick={() => {
                    navigate("/ai-coach");
                    setIsOpen(false);
                }}
                className="btn-premium w-full !py-4 text-xs"
            >
                Enter Simulation <Zap size={14} fill="currentColor" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all duration-500 ${isOpen ? 'bg-sakura text-white' : 'bg-ink text-sakura shadow-ink/30'}`}
      >
        {isOpen ? <X size={32} strokeWidth={3} /> : <Sparkles size={32} strokeWidth={2.5} fill="currentColor" />}
      </motion.button>
    </div>
  );
};

export default FloatingAI;
