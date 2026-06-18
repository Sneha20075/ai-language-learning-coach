import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Mail, Lock, ShieldCheck, ArrowRight, Cpu, Fingerprint } from "lucide-react";

function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, { email, password });
      if (res.data.success) {
        localStorage.setItem("userInfo", JSON.stringify(res.data.data));
        toast.success("Identity Verified");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-washi flex items-center justify-center p-6 pt-32">
      <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg glass-card !p-12 relative z-10"
      >
        <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-ink text-sakura flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-ink/20">
                <Fingerprint size={32} strokeWidth={2} />
            </div>
            <h1 className="text-4xl font-black text-ink tracking-tighter mb-4">Initialize Access.</h1>
            <p className="text-[10px] font-black text-ink/40 uppercase tracking-[0.2em]">Secure Authentication Gateway</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-ink uppercase tracking-widest ml-1">Cognitive Identity (Email)</label>
            <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-sakura transition-colors" size={20} />
                <input
                    type="email"
                    required
                    className="w-full bg-white/50 border-2 border-ink/5 p-5 pl-14 rounded-2xl focus:border-sakura focus:bg-white outline-none text-sm font-bold transition-all placeholder:text-ink/20"
                    placeholder="name@neural.net"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-ink uppercase tracking-widest ml-1">Access Cipher (Password)</label>
            <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-sakura transition-colors" size={20} />
                <input
                    type="password"
                    required
                    className="w-full bg-white/50 border-2 border-ink/5 p-5 pl-14 rounded-2xl focus:border-sakura focus:bg-white outline-none text-sm font-bold transition-all placeholder:text-ink/20"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-premium w-full justify-center py-5 text-lg mt-4"
          >
            {loading ? "Verifying..." : "Initialize Dashboard"}
            {!loading && <ArrowRight size={22} />}
          </button>
        </form>

        <div className="mt-12 pt-10 border-t border-ink/5 text-center">
            <p className="text-sm font-bold text-ink/40">
                New Identity? <Link to="/signup" className="text-sakura hover:underline ml-2 font-black uppercase tracking-widest text-[10px]">Create Profile</Link>
            </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
