import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Rocket, Trophy, Users, ShieldCheck, ArrowRight, Check } from "lucide-react";

function JoinBeta() {
  const [form, setForm] = useState({
    firstName: "",
    lastName:  "",
    age:       "",
    grade:     "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit() {
    if (!form.firstName || !form.age || !form.grade) {
        toast.error("Please fill in all required fields.");
        return;
    }
    setLoading(true);
    setError("");

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/preregister`, form);
      toast.success("Welcome to the inner circle! 🎉");
      setSubmitted(true);
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong!";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fadeUp min-h-screen flex flex-col items-center justify-center py-20 px-6">
      <div className="w-full max-w-[600px]">

        <div className="text-center mb-16">
            <div className="pill mb-6">Pre-registration v1.0</div>
            <h1 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] tracking-tight leading-[0.95] mb-8 text-t1 font-bold italic">
               SECURE YOUR <span className="gradient-text">POSITION</span>
            </h1>
            <p className="text-t2 text-[1.1rem] leading-[1.8]">
                Join 5,000+ early adopters receiving cutting-edge AI language insights every week.
            </p>
        </div>

        <div className="glass-card p-12 relative">
          {submitted ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 rounded-full bg-acc/10 border border-acc/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(13,255,176,0.15)] animate-bounce">
                <Check size={36} className="text-acc" strokeWidth={3} />
              </div>
              <h2 className="font-display text-4xl italic font-bold text-t1 mb-4">ACCESS GRANTED</h2>
              <p className="text-t2 leading-relaxed">
                You've been added to our priority deployment list. Check your inbox for the onboarding protocol shortly.
              </p>
              <button 
                onClick={() => window.location.href = '/'}
                className="btn-outline mt-10 w-full"
              >
                Return to Command Center
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-10 pb-6 border-b border-white/5">
                <ShieldCheck size={20} className="text-acc" />
                <h3 className="text-sm font-bold text-t1 uppercase tracking-[2px]">Onboarding Protocol</h3>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-[0.65rem] font-bold text-t3 uppercase tracking-[1px] mb-2.5">
                    First Name *
                  </label>
                  <input
                    name="firstName"
                    type="text"
                    required
                    placeholder="E.g. Elon"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-[0.65rem] font-bold text-t3 uppercase tracking-[1px] mb-2.5">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    type="text"
                    placeholder="E.g. Musk"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-[0.65rem] font-bold text-t3 uppercase tracking-[1px] mb-2.5">
                  Your Age *
                </label>
                <input
                  name="age"
                  type="number"
                  required
                  placeholder="24"
                  value={form.age}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-10">
                <label className="block text-[0.65rem] font-bold text-t3 uppercase tracking-[1px] mb-2.5">
                  Current Target *
                </label>
                <select
                  name="grade"
                  value={form.grade}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Level/Status</option>
                  <option value="Beginner Student">High School / Beginner</option>
                  <option value="Collegiate">College / University</option>
                  <option value="Professional">Corporate / Professional</option>
                  <option value="Academic">Academic / Research</option>
                  <option value="Other">Autonomous Learner</option>
                </select>
              </div>

              {error && (
                <p className="text-acc2 text-sm mb-6 font-medium bg-acc2/10 p-3 rounded-lg border border-acc2/20">⚠️ {error}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary w-full h-14 text-base group"
              >
                {loading ? "Transmitting..." : (
                    <span className="flex items-center justify-center gap-3">
                        Initiate Registration
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-all" />
                    </span>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="mt-16 flex justify-between px-6">
            <div className="text-center">
                <Trophy size={18} className="mx-auto text-acc3 mb-2" />
                <div className="text-[0.6rem] font-bold text-t3 uppercase tracking-[1px]">Elite Level</div>
            </div>
            <div className="text-center">
                <Users size={18} className="mx-auto text-acc2 mb-2" />
                <div className="text-[0.6rem] font-bold text-t3 uppercase tracking-[1px]">Verified Node</div>
            </div>
            <div className="text-center">
                <Rocket size={18} className="mx-auto text-acc mb-2" />
                <div className="text-[0.6rem] font-bold text-t3 uppercase tracking-[1px]">Beta Sync</div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default JoinBeta;
