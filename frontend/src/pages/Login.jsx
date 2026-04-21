import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LogIn, Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";

function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      toast.success("Welcome back! 👋");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 py-20 animate-fadeUp">
      <div className="w-full max-w-[480px]">
        {/* Logo / Header Area */}
        <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-acc/10 border border-acc/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(13,255,176,0.1)]">
                <ShieldCheck size={32} className="text-acc" />
            </div>
            <h1 className="font-display text-4xl font-bold text-t1 tracking-tight mb-3">
                Welcome <span className="gradient-text">Back</span>
            </h1>
            <p className="text-t2 text-sm">
                Don't have an account? 
                <Link to="/signup" className="text-acc hover:underline ml-1 font-medium">Create one for free →</Link>
            </p>
        </div>

        {/* glass-card centered */}
        <div className="glass-card p-10 relative overflow-hidden group">
            {/* Subtle Gradient Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-acc/10 rounded-full blur-[80px] group-hover:bg-acc/15 transition-all duration-500"></div>
            
            <form onSubmit={handleLogin} className="relative z-10 space-y-6">
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
                    <div className="flex justify-between items-center mb-2.5 ml-1">
                        <label className="block text-[0.65rem] font-bold text-t3 uppercase tracking-[2px]">
                            Password
                        </label>
                        <Link to="#" className="text-[0.65rem] font-bold text-acc hover:underline uppercase tracking-[1px]">
                            Forgot?
                        </Link>
                    </div>
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
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-4 rounded-2xl flex items-center justify-center gap-2 group-hover:shadow-[0_0_30px_rgba(13,255,176,0.3)] transition-all"
                >
                    {loading ? "Authenticating..." : (
                        <>
                            Sign In to Dashboard
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>

                <div className="pt-4 flex items-center gap-4">
                    <div className="h-[1px] flex-1 bg-border"></div>
                    <span className="text-[0.6rem] font-bold text-t3 uppercase tracking-[2px]">Secured by AI</span>
                    <div className="h-[1px] flex-1 bg-border"></div>
                </div>
            </form>
        </div>
        
        <p className="text-center text-t3 text-[0.7rem] mt-8 uppercase tracking-[1px] font-medium">
            Protected by Industry Standard Encryption
        </p>
      </div>
    </div>
  );
}

export default Login;
