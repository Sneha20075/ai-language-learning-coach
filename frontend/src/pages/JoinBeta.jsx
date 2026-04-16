import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

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
    setLoading(true);
    setError("");

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/preregister`, form);
      toast.success("You're on the waitlist! 🎉");
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
    <div className="animate-fadeUp">
      <div className="max-w-[540px] mx-auto px-6 py-20">

        <div className="text-[0.7rem] font-semibold tracking-[2px] uppercase text-acc mb-2">
          Pre-register
        </div>

        <h2 className="font-display text-[clamp(2.2rem,5vw,3.5rem)] tracking-[1px] leading-[1.05] mb-2 text-t1 font-bold">
          JOIN THE<br /><span className="gradient-text">WAITLIST</span>
        </h2>
        <p className="text-t2 text-[0.92rem] leading-[1.85] mb-8">
          Be among the first to access AI Debate Arena. We'll reach out as soon as we launch.
        </p>

        <div className="glass-card p-8">
          {submitted ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 rounded-2xl bg-acc3/10 flex items-center
                              justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" className="w-7 h-7 stroke-acc3"
                     fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h4 className="font-display text-[1.5rem] tracking-[1px] mb-2 text-t1 font-bold">YOU'RE IN!</h4>
              <p className="text-[0.85rem] text-t2">
                We'll contact you the moment AI Debate Arena is live. Get ready to argue.
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-[0.92rem] font-semibold mb-6 text-t1">Registration form</h3>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-[0.72rem] font-semibold text-t3
                                    uppercase tracking-[0.5px] mb-2">
                    First Name *
                  </label>
                  <input
                    name="firstName"
                    type="text"
                    placeholder="Jane"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-[0.72rem] font-semibold text-t3
                                    uppercase tracking-[0.5px] mb-2">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[0.72rem] font-semibold text-t3
                                  uppercase tracking-[0.5px] mb-2">
                  Age *
                </label>
                <input
                  name="age"
                  type="number"
                  placeholder="15"
                  value={form.age}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label className="block text-[0.72rem] font-semibold text-t3
                                  uppercase tracking-[0.5px] mb-2">
                  Grade *
                </label>
                <select
                  name="grade"
                  value={form.grade}
                  onChange={handleChange}
                >
                  <option value="">Select grade</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                  <option value="College / University">College / University</option>
                </select>
              </div>

              {error && (
                <p className="text-acc2 text-[0.82rem] mb-3 font-medium">{error}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary w-full !mt-4"
              >
                {loading ? "Saving..." : "Reserve My Spot →"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 AI Language Coach. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default JoinBeta;
