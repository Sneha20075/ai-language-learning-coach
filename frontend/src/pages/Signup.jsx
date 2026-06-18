import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { User, Mail, Lock, Globe, ArrowRight, Cpu, Sparkles } from "lucide-react";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    nativeLanguage: "English",
    targetLanguage: "Spanish"
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, formData);
      if (res.data.success) {
        localStorage.setItem("userInfo", JSON.stringify(res.data.data));
        toast.success("Profile Provisioned");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Provisioning Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-washi flex items-center justify-center p-6 py-32">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-5 pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl glass-card !p-12 relative z-10"
      >
        <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-ink text-sakura flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-ink/20">
                <Sparkles size={32} strokeWidth={2} />
            </div>
            <h1 className="text-4xl font-black text-ink tracking-tighter mb-4">Create Identity.</h1>
            <p className="text-[10px] font-black text-ink/40 uppercase tracking-[0.2em]">Neural Network Enrollment</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
                <label className="text-[10px] font-black text-ink uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-sakura transition-colors" size={20} />
                    <input
                        type="text"
                        required
                        className="w-full bg-white/50 border-2 border-ink/5 p-5 pl-14 rounded-2xl focus:border-sakura focus:bg-white outline-none text-sm font-bold transition-all placeholder:text-ink/20"
                        placeholder="Operator Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
            </div>
            <div className="space-y-3">
                <label className="text-[10px] font-black text-ink uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-sakura transition-colors" size={20} />
                    <input
                        type="email"
                        required
                        className="w-full bg-white/50 border-2 border-ink/5 p-5 pl-14 rounded-2xl focus:border-sakura focus:bg-white outline-none text-sm font-bold transition-all placeholder:text-ink/20"
                        placeholder="name@neural.net"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
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
                    placeholder="Min. 8 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
                <label className="text-[10px] font-black text-ink uppercase tracking-widest ml-1">Primary Language</label>
                <select 
                    className="w-full bg-white/50 border-2 border-ink/5 p-5 rounded-2xl focus:border-sakura outline-none text-sm font-bold transition-all appearance-none cursor-pointer"
                    value={formData.nativeLanguage}
                    onChange={(e) => setFormData({ ...formData, nativeLanguage: e.target.value })}
                >
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Spanish</option>
                    <option>French</option>
                </select>
            </div>
            <div className="space-y-3">
                <label className="text-[10px] font-black text-ink uppercase tracking-widest ml-1">Learning Target</label>
                <select 
                    className="w-full bg-white/50 border-2 border-ink/5 p-5 rounded-2xl focus:border-sakura outline-none text-sm font-bold transition-all appearance-none cursor-pointer"
                    value={formData.targetLanguage}
                    onChange={(e) => setFormData({ ...formData, targetLanguage: e.target.value })}
                >
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                    <option>Japanese</option>
                    <option>Hindi</option>
                    <option>English</option>
                </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-premium w-full justify-center py-5 text-lg mt-4"
          >
            {loading ? "Provisioning..." : "Initialize Identity"}
            {!loading && <ArrowRight size={22} />}
          </button>
        </form>

        <div className="mt-12 pt-10 border-t border-ink/5 text-center">
            <p className="text-sm font-bold text-ink/40">
                Already Initialized? <Link to="/login" className="text-sakura hover:underline ml-2 font-black uppercase tracking-widest text-[10px]">Secure Login</Link>
            </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Signup;
