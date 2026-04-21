import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserPlus, Mail, Lock, User, Sparkles, CheckCircle } from "lucide-react";

function Signup() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
        name,
        email,
        password,
      });
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      toast.success("Account created successfully! ✨");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 33;
    if (password.length < 10) return 66;
    return 100;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 py-20 animate-fadeUp">
      <div className="w-full max-w-[540px]">
        
        {/* Header */}
        <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-acc2/10 border border-acc2/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(155,114,245,0.1)]">
                <Sparkles size={32} className="text-acc2" />
            </div>
            <h1 className="font-display text-4xl font-bold text-t1 tracking-tight mb-3">
                Join the <span className="gradient-text">Elite</span>
            </h1>
            <p className="text-t2 text-sm">
                Already have an account? 
                <Link to="/login" className="text-acc2 hover:underline ml-1 font-medium">Log in instead →</Link>
            </p>
        </div>

        {/* Central Card */}
        <div className="glass-card p-10 relative overflow-hidden group">
             {/* Decorative Background Element */}
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-acc2/10 rounded-full blur-[100px] group-hover:bg-acc2/15 transition-all duration-500"></div>

            <form onSubmit={handleSignup} className="relative z-10 space-y-6">
                <div>
                    <label className="block text-[0.65rem] font-bold text-t3 uppercase tracking-[2px] mb-2.5 ml-1">
                        Full Name
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-t3">
                            <User size={16} />
                        </div>
                        <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pl-11"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[0.65rem] font-bold text-t3 uppercase tracking-[2px] mb-2.5 ml-1">
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-t3">
                            <Mail size={16} />
                        </div>
                        <input
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-11"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[0.65rem] font-bold text-t3 uppercase tracking-[2px] mb-2.5 ml-1">
                        Secret Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-t3">
                            <Lock size={16} />
                        </div>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-11"
                        />
                    </div>
                    {/* Strength Indicator */}
                    <div className="mt-3 px-1">
                        <div className="flex justify-between items-center mb-1.5">
                            <span className="text-[0.6rem] font-bold text-t3 uppercase tracking-[1px]">Security Strength</span>
                            <span className="text-[0.6rem] font-bold text-acc2 uppercase">{getPasswordStrength() === 100 ? 'Solid' : 'Analyzing...'}</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-acc2 transition-all duration-500" 
                                style={{ width: `${getPasswordStrength()}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-4 rounded-2xl bg-acc2 border-acc2 hover:shadow-[0_0_30px_rgba(155,114,245,0.3)] flex items-center justify-center gap-2 group transition-all"
                    >
                        {loading ? "Creating System Access..." : (
                            <>
                                Create Your Account
                                <CheckCircle size={18} className="group-hover:scale-110 transition-transform" />
                            </>
                        )}
                    </button>
                </div>

                <p className="text-[0.65rem] text-center text-t3 leading-relaxed">
                    By joining, you agree to our <span className="text-t2 underline cursor-pointer">Terms of Logic</span> and <span className="text-t2 underline cursor-pointer">Privacy Protocol</span>.
                </p>
            </form>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-8 px-4">
            <div className="text-center group">
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🌍</div>
                <div className="text-[0.65rem] font-bold text-t1 uppercase tracking-[1px]">Global Network</div>
                <div className="text-[0.6rem] text-t3 mt-1 underline">Join 50k+ nodes</div>
            </div>
            <div className="text-center group">
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">⚡</div>
                <div className="text-[0.65rem] font-bold text-t1 uppercase tracking-[1px]">Instant Access</div>
                <div className="text-[0.6rem] text-t3 mt-1 underline">Sub-second init</div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
