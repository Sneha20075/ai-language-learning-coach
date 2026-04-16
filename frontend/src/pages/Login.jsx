import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Welcome back! 🚀");
      navigate("/");
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-62px)] flex items-center justify-center px-4 py-12 animate-fadeUp">
      <div className="max-w-[420px] w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-acc/10 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="m7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h2 className="font-display text-[2rem] text-t1 mb-1 font-bold tracking-[1px]">Welcome back</h2>
          <p className="text-t2 text-[0.88rem]">Enter your credentials to access your account</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[0.72rem] text-t3 uppercase tracking-[1px] mb-2 font-semibold">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-[0.72rem] text-t3 uppercase tracking-[1px] mb-2 font-semibold">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-[14px] !text-[0.9rem] !mt-6"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="20"/></svg>
                  Logging in...
                </span>
              ) : "Login →"}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <div className="mt-6 text-center">
          <p className="text-t2 text-[0.85rem]">
            Don't have an account?{" "}
            <Link to="/signup" className="text-acc hover:underline font-semibold">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
