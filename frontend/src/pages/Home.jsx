import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
    BookOpen, 
    Camera, 
    TrendingUp,
    ChevronRight,
    Zap,
    Globe,
    MessageSquare,
    Sparkles,
    Languages,
    ArrowRight
} from "lucide-react";

const features = [
    {
        title: "AI Neural Coach",
        desc: "Precision conversation training with real-time grammar logic analysis.",
        icon: <MessageSquare size={28} />,
        path: "/ai-coach",
        accent: "bg-indigo-50 text-indigo-600"
    },
    {
        title: "Visual Scanner",
        desc: "Instantly translate your physical environment into linguistic mastery.",
        icon: <Camera size={28} />,
        path: "/object-detection",
        accent: "bg-rose-50 text-rose-600"
    },
    {
        title: "Academy Lab",
        desc: "Adaptive curricula designed for rapid vocabulary and syntax acquisition.",
        icon: <BookOpen size={28} />,
        path: "/learn",
        accent: "bg-emerald-50 text-emerald-600"
    },
    {
        title: "Linguistic Data",
        desc: "Deep analytics auditing your performance trajectory and fluency curve.",
        icon: <TrendingUp size={28} />,
        path: "/progress",
        accent: "bg-amber-50 text-amber-600"
    }
];

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-washi overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative pt-48 pb-32 lg:pt-64 lg:pb-48 container-premium">
        
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sakura/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-ink text-white text-[10px] font-black uppercase tracking-[0.2em] mb-10 shadow-2xl shadow-ink/20"
            >
                <Sparkles size={14} className="text-sakura" fill="currentColor" /> 
                System: Neural v2.5 Ready
            </motion.div>
            
            <motion.h1 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className="text-6xl md:text-8xl lg:text-9xl font-black text-ink tracking-tighter mb-12 leading-[0.9]"
            >
                Master Any <br />
                <span className="text-sakura italic">Dialect.</span>
            </motion.h1>

            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-2xl text-ink/60 max-w-2xl mb-16 leading-tight font-bold"
            >
                LinguaCoach leverages high-density neural models to provide professional language training through visual immersion and cognitive analysis.
            </motion.p>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-6"
            >
                <button onClick={() => navigate("/signup")} className="btn-premium py-5 px-12 text-lg">
                    Begin Initialization <ArrowRight size={22} />
                </button>
                <button onClick={() => navigate("/ai-coach")} className="btn-premium-outline py-5 px-12 text-lg">
                    Enter Simulation
                </button>
            </motion.div>
        </div>
      </section>

      {/* CORE MODULES */}
      <section className="py-32 bg-white relative z-20">
        <div className="container-premium">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
                <div className="max-w-xl">
                    <h2 className="text-4xl md:text-6xl font-black text-ink tracking-tighter leading-none mb-6">Cognitive <br/> Modules.</h2>
                    <p className="text-lg text-ink/40 font-bold">Four specialized laboratories designed for optimized linguistic transition.</p>
                </div>
                <div className="flex items-center gap-4 text-ink/20">
                    <div className="w-16 h-1 bg-current rounded-full"></div>
                    <span className="text-xs font-black uppercase tracking-widest">v2.5 Simulation</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.map((f, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => navigate(f.path)}
                        className="glass-card group cursor-pointer overflow-hidden relative"
                    >
                        <div className={`w-16 h-16 rounded-2xl ${f.accent} flex items-center justify-center mb-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
                            {f.icon}
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black text-ink mb-6 tracking-tighter">{f.title}</h3>
                            <p className="text-lg text-ink/40 leading-tight font-bold mb-8">
                                {f.desc}
                            </p>
                            <div className="flex items-center gap-2 text-ink text-[10px] font-black uppercase tracking-widest group-hover:text-sakura transition-colors">
                                Access Module <ChevronRight size={14} strokeWidth={3} />
                            </div>
                        </div>
                        
                        {/* Decorative Background Icon */}
                        <div className="absolute -bottom-8 -right-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 group-hover:scale-150 transform">
                            {f.icon}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* NEURAL GLOBAL NETWORK */}
      <section className="py-32 bg-washi relative overflow-hidden">
        <div className="container-premium relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                <div>
                    <span className="pill-badge text-sakura border-sakura mb-8">Global Coverage</span>
                    <h2 className="text-5xl md:text-7xl font-black text-ink tracking-tighter mb-10 leading-none">Neural Global <br/> <span className="text-sakura italic">Network.</span></h2>
                    <p className="text-xl text-ink/40 font-bold mb-12">
                        Our intelligence engine supports synchronous dialect processing across 50+ linguistic nodes. Real-time translation, grammar auditing, and cognitive mapping for every major language.
                    </p>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <div className="text-4xl font-black text-ink tracking-tighter mb-2">99.8%</div>
                            <span className="text-[10px] font-black text-ink/20 uppercase tracking-widest">Logic Accuracy</span>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-ink tracking-tighter mb-2">12ms</div>
                            <span className="text-[10px] font-black text-ink/20 uppercase tracking-widest">Inference Latency</span>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <div className="glass-card !p-0 !rounded-[3rem] overflow-hidden shadow-[0_60px_120px_-20px_rgba(38,29,34,0.4)]">
                        <img 
                            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000" 
                            className="w-full h-[500px] object-cover grayscale opacity-80" 
                            alt="Neural Network"
                        />
                        <div className="absolute inset-0 bg-ink/40 mix-blend-multiply"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center text-white animate-pulse">
                                <Globe size={40} />
                            </div>
                        </div>
                    </div>
                    {/* Floating Info */}
                    <motion.div 
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 6, repeat: Infinity }}
                        className="absolute -top-10 -right-10 glass-card !py-6 !px-8 !rounded-2xl shadow-2xl"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-sakura animate-ping"></div>
                            <span className="text-[10px] font-black text-ink uppercase tracking-widest">Real-time Node Active</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
      </section>

      {/* FOOTER-LIKE CALLOUT */}
      <section className="py-48 bg-ink text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
        <div className="container-premium relative z-10">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
            >
                <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-12">Universal <span className="text-sakura">Connectivity.</span></h2>
                <p className="text-xl md:text-3xl text-white/40 font-bold max-w-3xl mx-auto mb-16 leading-tight">
                    Break the barrier of communication. Join the global simulation for linguistic mastery today.
                </p>
                <button onClick={() => navigate("/signup")} className="btn-premium bg-white text-ink hover:bg-sakura hover:text-white py-6 px-16 text-2xl">
                    Create Identity
                </button>
            </motion.div>
        </div>
      </section>

    </div>
  );
}

export default Home;