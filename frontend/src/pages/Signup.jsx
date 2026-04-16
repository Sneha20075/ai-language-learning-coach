import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
        name,
        email,
        password,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Account created successfully! 🎉");
      navigate("/");
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-62px)] flex items-center justify-center px-4 py-12 animate-fadeUp">
      <div className="max-w-[420px] w-full">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-acc3/10 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
          </div>
          <h2 className="font-display text-[2rem] text-t1 mb-1 font-bold tracking-[1px]">Create account</h2>
          <p className="text-t2 text-[0.88rem]">Start your journey with AI Language Coach</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-[0.72rem] text-t3 uppercase tracking-[1px] mb-2 font-semibold">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
                  Creating Account...
                </span>
              ) : "Create Account →"}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <div className="mt-6 text-center">
          <p className="text-t2 text-[0.85rem]">
            Already have an account?{" "}
            <Link to="/login" className="text-acc hover:underline font-semibold">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
