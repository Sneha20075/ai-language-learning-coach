import React, { useState, useEffect } from "react";
import { User, Mail, Globe, Languages, ShieldCheck, LogOut, Camera, Fingerprint, Zap, Edit2, Check, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [nativeLanguage, setNativeLanguage] = useState("English");
  const [targetLanguage, setTargetLanguage] = useState("Spanish");
  const [proficiencyLevel, setProficiencyLevel] = useState("Beginner");
  const [updating, setUpdating] = useState(false);

  const fetchProfile = async () => {
    try {
      const data = localStorage.getItem("userInfo");
      if (!data) {
        navigate("/login");
        return;
      }
      const token = JSON.parse(data).token;

      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setProfileData(res.data.data);
        setName(res.data.data.name || "");
        setNativeLanguage(res.data.data.nativeLanguage || "English");
        setTargetLanguage(res.data.data.targetLanguage || "Spanish");
        setProficiencyLevel(res.data.data.proficiencyLevel || "Beginner");
      }
    } catch (error) {
      toast.error("Failed to fetch profile details.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    toast.success("Identity Deregistered.");
    navigate("/login");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const data = localStorage.getItem("userInfo");
      if (!data) return;
      const parsed = JSON.parse(data);
      const token = parsed.token;

      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`, {
        name,
        nativeLanguage,
        targetLanguage,
        proficiencyLevel
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        toast.success("Identity Core Updated!");
        setProfileData(res.data.data);
        
        // Sync targetLanguage in local storage too, so pages load it immediately
        localStorage.setItem("targetLanguage", targetLanguage);

        // Update userInfo in local storage
        const updatedUserInfo = {
          ...parsed,
          name: res.data.data.name,
          nativeLanguage: res.data.data.nativeLanguage,
          targetLanguage: res.data.data.targetLanguage,
          proficiencyLevel: res.data.data.proficiencyLevel
        };
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
        setIsEditing(false);
      }
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-washi">
        <Loader2 size={48} className="text-sakura animate-spin mb-8" />
        <p className="text-ink font-black uppercase tracking-[0.3em] text-[10px]">Syncing Identity Core...</p>
    </div>
  );

  if (!profileData) return null;

  return (
    <div className="min-h-screen bg-washi pt-40 pb-32">
      <div className="container-premium max-w-4xl">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24 border-b-4 border-ink pb-12">
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <span className="pill-badge text-sakura border-sakura">Identity Profile</span>
                    <span className="text-ink/20 font-black">/</span>
                    <span className="text-[10px] font-black text-ink uppercase tracking-widest">Neural Link v2.5</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-ink tracking-tighter leading-none mb-4 uppercase">My <span className="text-sakura italic">Profile.</span></h1>
                <p className="text-xl text-ink/40 font-bold max-w-xl">Management of your linguistic identity and simulation parameters.</p>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-rose-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-2xl shadow-rose-500/20">
                <LogOut size={18} strokeWidth={2.5} />
                Deregister Identity
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* AVATAR & QUICK STATS */}
            <div className="lg:col-span-4 space-y-12">
                <div className="glass-card !p-12 !rounded-[3rem] text-center relative overflow-hidden bg-ink text-white">
                    <div className="relative w-32 h-32 mx-auto mb-8">
                        <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.name}`} 
                            className="w-full h-full rounded-full border-8 border-white/10 shadow-2xl" 
                            alt="avatar" 
                        />
                        <div className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-sakura text-white flex items-center justify-center border-4 border-ink">
                            <Camera size={16} strokeWidth={3} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-black tracking-tighter mb-2">{profileData.name}</h3>
                    <p className="text-[10px] font-black text-sakura uppercase tracking-widest mb-10 opacity-60">Level {profileData.level || 1} Apprentice</p>
                    
                    <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-10">
                        <div>
                            <div className="text-3xl font-black tracking-tighter">{profileData.totalXP || 0}</div>
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Total XP</span>
                        </div>
                        <div>
                            <div className="text-3xl font-black tracking-tighter">{profileData.streak || 0}d</div>
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Streak</span>
                        </div>
                    </div>
                </div>

                <div className="glass-card !p-10 !rounded-[2.5rem]">
                    <h4 className="text-[10px] font-black text-ink uppercase tracking-widest mb-8 flex items-center gap-3">
                        <ShieldCheck size={14} strokeWidth={3} /> Security Level
                    </h4>
                    <div className="flex items-center gap-4 text-emerald-500 font-black text-sm uppercase tracking-[0.2em]">
                        <Fingerprint size={24} strokeWidth={2.5} />
                        Encrypted Access
                    </div>
                </div>
            </div>

            {/* IDENTITY DETAILS */}
            <div className="lg:col-span-8 space-y-12">
                <div className="glass-card !p-12 !rounded-[3.5rem]">
                    <div className="flex items-center justify-between mb-12 border-b border-ink/5 pb-4">
                        <h3 className="text-[10px] font-black text-sakura uppercase tracking-[0.3em]">Neural Parameters</h3>
                        {!isEditing && (
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 text-[10px] font-black text-ink uppercase tracking-widest hover:text-sakura transition-all"
                            >
                                <Edit2 size={12} /> Edit Parameters
                            </button>
                        )}
                    </div>
                    
                    {isEditing ? (
                        <form onSubmit={handleUpdate} className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-ink/40 uppercase tracking-widest">
                                        <User size={14}/> Full Designation
                                    </label>
                                    <input 
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-ink/5 border-2 border-transparent p-5 rounded-2xl focus:border-sakura focus:bg-white outline-none text-md font-bold transition-all text-ink"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-ink/40 uppercase tracking-widest">
                                        <Mail size={14}/> Communication Link
                                    </label>
                                    <div className="p-5 bg-ink/5 rounded-2xl text-md font-bold text-ink/40 select-none">
                                        {profileData.email}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-ink/40 uppercase tracking-widest">
                                        <Globe size={14}/> Primary Dialect
                                    </label>
                                    <select 
                                        value={nativeLanguage}
                                        onChange={(e) => setNativeLanguage(e.target.value)}
                                        className="w-full bg-ink/5 border-2 border-transparent p-5 rounded-2xl focus:border-sakura focus:bg-white outline-none text-md font-bold transition-all text-ink cursor-pointer"
                                    >
                                        <option>English</option>
                                        <option>Hindi</option>
                                        <option>Spanish</option>
                                        <option>French</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-ink/40 uppercase tracking-widest">
                                        <Languages size={14}/> Learning Target
                                    </label>
                                    <select 
                                        value={targetLanguage}
                                        onChange={(e) => setTargetLanguage(e.target.value)}
                                        className="w-full bg-sakura/5 border-2 border-transparent p-5 rounded-2xl focus:border-sakura focus:bg-white outline-none text-md font-bold transition-all text-sakura cursor-pointer"
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

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-ink/40 uppercase tracking-widest">
                                    <Zap size={14}/> Proficiency Level
                                </label>
                                <select 
                                    value={proficiencyLevel}
                                    onChange={(e) => setProficiencyLevel(e.target.value)}
                                    className="w-full bg-ink/5 border-2 border-transparent p-5 rounded-2xl focus:border-sakura focus:bg-white outline-none text-md font-bold transition-all text-ink cursor-pointer"
                                >
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Advanced</option>
                                </select>
                            </div>

                            <div className="flex gap-4 pt-8 border-t-2 border-ink/5">
                                <button 
                                    type="submit" 
                                    disabled={updating}
                                    className="btn-premium flex-1 !py-5 flex items-center justify-center gap-3 shadow-2xl"
                                >
                                    {updating ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                                    Save Parameters
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setIsEditing(false);
                                        setName(profileData.name || "");
                                        setNativeLanguage(profileData.nativeLanguage || "English");
                                        setTargetLanguage(profileData.targetLanguage || "Spanish");
                                        setProficiencyLevel(profileData.proficiencyLevel || "Beginner");
                                    }}
                                    className="btn-premium-outline !py-5 flex items-center justify-center gap-3"
                                >
                                    <X size={18} />
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <span className="flex items-center gap-2 text-[10px] font-black text-ink/20 uppercase tracking-widest">
                                        <User size={14}/> Full Designation
                                    </span>
                                    <div className="p-6 bg-ink/5 rounded-2xl text-xl font-black text-ink tracking-tight">
                                        {profileData.name}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <span className="flex items-center gap-2 text-[10px] font-black text-ink/20 uppercase tracking-widest">
                                        <Mail size={14}/> Communication Link
                                    </span>
                                    <div className="p-6 bg-ink/5 rounded-2xl text-xl font-black text-ink tracking-tight overflow-hidden text-ellipsis">
                                        {profileData.email}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <span className="flex items-center gap-2 text-[10px] font-black text-ink/20 uppercase tracking-widest">
                                        <Globe size={14}/> Primary Dialect
                                    </span>
                                    <div className="p-6 bg-ink/5 rounded-2xl text-xl font-black text-ink tracking-tight flex items-center justify-between">
                                        {profileData.nativeLanguage || "English"}
                                        <span className="pill-badge !bg-ink/10 !border-none !text-[8px]">Native</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <span className="flex items-center gap-2 text-[10px] font-black text-ink/20 uppercase tracking-widest">
                                        <Languages size={14}/> Learning Target
                                    </span>
                                    <div className="p-6 bg-sakura/5 rounded-2xl text-xl font-black text-sakura tracking-tight flex items-center justify-between">
                                        {profileData.targetLanguage || "Spanish"}
                                        <div className="flex items-center gap-2">
                                            <span className="pill-badge !bg-sakura/10 !border-none !text-[8px] !text-sakura">{profileData.proficiencyLevel || "Beginner"}</span>
                                            <Zap size={18} fill="currentColor" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-16 pt-12 border-t-2 border-ink/5">
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="btn-premium w-full !py-6 text-xl shadow-2xl shadow-ink/20"
                                >
                                    Update Identity Core
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
