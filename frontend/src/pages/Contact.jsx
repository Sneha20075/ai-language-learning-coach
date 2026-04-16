import { Link } from 'react-router-dom';

const contacts = [
  {
    icon: "✉️",
    title: "General Inquiries",
    desc: <>Email us at <a className="text-acc hover:underline" href="mailto:hello@aidebatearena.com">hello@aidebatearena.com</a> for support, collaboration, or media requests.</>,
  },
  {
    icon: "📱",
    title: "Follow Us",
    desc: <>Stay updated with launch news and product updates on <span className="text-acc font-medium">@AIDebateArena</span>.</>,
  },
  {
    icon: "🚀",
    title: "Waitlist",
    desc: <>Want to join the beta? Reserve your spot on the <Link className="text-acc underline" to="/join-beta">Join Beta</Link> page.</>,
  },
];

function Contact() {
  return (
    <div className="animate-fadeUp">
      <div className="max-w-[640px] mx-auto px-6 py-20">

        <div className="text-[0.7rem] font-semibold tracking-[2px] uppercase text-acc mb-2">
          Contact
        </div>

        <h2 className="font-display text-[clamp(2.2rem,5vw,3.5rem)] tracking-[1px] leading-[1.05] mb-2 text-t1 font-bold">
          LET'S <span className="gradient-text">TALK</span>
        </h2>

        <p className="text-t2 text-[0.92rem] leading-[1.85] mb-8">
          For questions about AI Debate Arena, partnerships, or press, reach out and we'll get back to you as soon as possible.
        </p>

        <div className="space-y-4">
          {contacts.map((c) => (
            <div key={c.title} className="glass-card p-6 flex items-start gap-4 group">
              <div className="text-[1.5rem] mt-1 flex-shrink-0">{c.icon}</div>
              <div>
                <h3 className="text-[0.92rem] font-semibold mb-1 text-t1">{c.title}</h3>
                <p className="text-[0.85rem] text-t2 leading-[1.8]">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 AI Language Coach. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Contact;
