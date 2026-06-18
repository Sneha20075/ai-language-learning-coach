import { motion } from "framer-motion";
import { Mail, MessageCircle, Code, Send, Sparkles, ChevronRight } from 'lucide-react';

const contacts = [
  {
    icon: <Mail size={24} className="text-primary" />,
    title: "Support & Help",
    desc: "Need priority assistance? Reach out for elite support at hello@linguacoach.ai.",
    action: "Send Email",
    color: "#1A237E"
  },
  {
    icon: <MessageCircle size={24} className="text-primary" />,
    title: "Community & Updates",
    desc: "Stay ahead with the latest AI releases and learning protocols on our X/Twitter.",
    action: "@LinguaCoachAI",
    color: "#4852D9"
  },
  {
    icon: <Code size={24} className="text-primary" />,
    title: "Developer Relations",
    desc: "Explore our architecture and contribute to the future of language intelligence.",
    action: "View Repository",
    color: "#FFD700"
  },
];

function Contact() {
  return (
    <div className="min-h-screen bg-bg py-32 px-6 relative overflow-hidden">
      
      {/* Background Decorations */}
      <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px]"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-24">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[0.65rem] font-black tracking-widest uppercase mb-8"
            >
                <Sparkles size={14} className="text-accent" fill="currentColor" />
                Connect With Us
            </motion.div>
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display text-6xl md:text-8xl font-black text-primary tracking-tight leading-[0.95] mb-10"
            >
               We're Here to <br />
               Refine Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Journey.</span>
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-text-sec text-lg leading-relaxed max-w-xl mx-auto font-medium"
            >
              Have questions about our AI protocols or enterprise deployments? Our elite team is ready to assist.
            </motion.p>
        </div>

        {/* Contact Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {contacts.map((c, i) => (
            <motion.div 
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={c.title} 
                className="bg-white border border-border p-10 rounded-[2.5rem] flex flex-col h-full shadow-xl shadow-primary/5 group"
            >
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all group-hover:rotate-6 shadow-md"
                style={{ backgroundColor: `${c.color}10`, border: `1px solid ${c.color}20` }}
              >
                {c.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary">{c.title}</h3>
              <p className="text-[0.95rem] text-text-sec leading-relaxed mb-8 flex-grow font-medium">{c.desc}</p>
              <div className="pt-6 border-t border-border">
                <button className="text-sm font-black text-primary group-hover:text-accent transition-colors flex items-center gap-2 uppercase tracking-widest">
                    {c.action}
                    <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enterprise Support Section */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-primary p-12 md:p-20 rounded-[3rem] text-center relative overflow-hidden shadow-2xl shadow-primary/30"
        >
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <div className="relative z-10">
                <h3 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">Institutional Deployment</h3>
                <p className="text-white/70 mb-10 max-w-xl mx-auto text-lg font-medium">We offer dedicated AI instances and custom pedagogy protocols for universities and corporate language training.</p>
                <button className="px-10 py-5 bg-accent text-primary font-black rounded-2xl shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3 mx-auto">
                    Enterprise Inquiry <Send size={18} />
                </button>
            </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Contact;
