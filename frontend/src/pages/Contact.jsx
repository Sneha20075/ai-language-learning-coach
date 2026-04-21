import { Link } from 'react-router-dom';
import { Mail, MessageSquare, MessageCircle, Code, MapPin, Send } from 'lucide-react';

const contacts = [
  {
    icon: <Mail className="text-acc" />,
    title: "Support & Help",
    desc: "Need assistance? Email us at hello@ailanguagecoach.com for priority support.",
    action: "Send Email"
  },
  {
    icon: <MessageCircle className="text-acc2" />,
    title: "Twitter / X",
    desc: "Stay updated with our latest AI model releases and language learning tips.",
    action: "@LanguageCoachAI"
  },
  {
    icon: <Code className="text-t3" />,
    title: "Open Source",
    desc: "Interested in our tech stack? Check our public repositories on GitHub.",
    action: "View Source"
  },
];

function Contact() {
  return (
    <div className="animate-fadeUp min-h-screen flex flex-col items-center justify-center py-24 px-6">
      <div className="w-full max-w-[1000px]">

        <div className="text-center mb-20">
            <div className="pill mb-6">Contact Us</div>
            <h1 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] tracking-tight leading-[0.95] mb-8 text-t1 font-bold italic">
               WE'D LOVE TO <span className="gradient-text">HEAR</span> FROM YOU
            </h1>
            <p className="text-t2 text-[1.1rem] leading-[1.8] max-w-[600px] mx-auto">
              Whether you have a question about features, pricing, or just want to say hi, 
              our team is ready to answer.
            </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {contacts.map((c) => (
            <div key={c.title} className="glass-card p-10 flex flex-col h-full group">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-8 group-hover:bg-glow transition-all">
                {c.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-t1">{c.title}</h3>
              <p className="text-[0.9rem] text-t3 leading-[1.7] mb-8 flex-grow">{c.desc}</p>
              <div className="pt-6 border-t border-white/5">
                <span className="text-sm font-bold text-acc group-hover:underline cursor-pointer flex items-center gap-2">
                    {c.action}
                    <Send size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Support Section Centered */}
        <div className="mt-20 glass-card p-12 text-center bg-gradient-to-br from-s1 to-s2">
            <h3 className="text-2xl font-bold text-t1 mb-4 italic font-display">Priority Enterprise Support</h3>
            <p className="text-t2 mb-8 max-w-[500px] mx-auto">For educational institutions and corporate training, we offer dedicated support channels and custom deployments.</p>
            <button className="btn-primary">Enterprise Inquiry →</button>
        </div>
      </div>
    </div>
  );
}

export default Contact;
