import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, QrCode, GraduationCap } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white selection:bg-emerald-500/30">
      
      {/* HERO SECTION */}
      <section className="max-w-5xl mx-auto px-6 text-center pt-24 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-6xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            Secure Digital Certificate Verification
          </h2>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Issue, manage, and verify academic certificates using 
            <span className="text-emerald-400"> blockchain-backed</span> records 
            and QR-powered validation.
          </p>

          <button
            onClick={() =>
              document.getElementById("portals")?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-10 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
          >
            Get Started
          </button>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section className="flex flex-wrap justify-center gap-6 pb-28 px-4">
        <Feature icon={<ShieldCheck size={28} />} title="Blockchain Security">
          Tamper-proof certificate records stored securely on the ledger.
        </Feature>
        <Feature icon={<QrCode size={28} />} title="Instant QR Verification">
          Scan or upload QR codes to validate certificates in seconds.
        </Feature>
        <Feature icon={<GraduationCap size={28} />} title="Student Ownership">
          Students can view, share, and verify their credentials anywhere.
        </Feature>
      </section>

      {/* PORTALS SECTION */}
      <section id="portals" className="pb-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-4">Choose Your Portal</h3>
          <div className="h-1 w-20 bg-gradient-to-r from-sky-500 to-emerald-500 mx-auto rounded-full" />
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          <PortalCard
            title="Public Verifier"
            desc="Verify certificates using QR codes or record hashes instantly."
            buttonText="Verify Now"
            onClick={() => navigate("/verify")}
          />

          <PortalCard
            title="Student Portal"
            desc="View, download, and share your blockchain-verified certificates."
            buttonText="View Credentials"
            onClick={() => navigate("/login")}
          />
        </div>
      </section>

      {/* FOOTER ACCENT */}
      <footer className="py-10 text-center border-t border-slate-800/50">
        <p className="text-slate-500 text-sm italic">
          Powered by Blockchain Technology & Secure Encryption
        </p>
      </footer>
    </div>
  );
}

/* =======================
   COMPONENTS
======================= */

function Feature({
  icon,
  title,
  children
}: {
  icon: React.ReactNode;
  title: string;
  children: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="w-80 p-8 rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 shadow-xl"
    >
      <div className="text-emerald-400 mb-5 bg-emerald-400/10 w-fit p-3 rounded-xl border border-emerald-400/20">
        {icon}
      </div>
      <h4 className="text-xl font-bold mb-3 text-slate-100">{title}</h4>
      <p className="text-sm text-slate-400 leading-relaxed">{children}</p>
    </motion.div>
  );
}

function PortalCard({
  title,
  desc,
  buttonText,
  onClick
}: {
  title: string;
  desc: string;
  buttonText: string;
  onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      onClick={onClick}
      className="group w-80 p-8 rounded-3xl bg-slate-900/80 border border-slate-700/50 cursor-pointer shadow-2xl relative overflow-hidden transition-all hover:border-emerald-500/50"
    >
      {/* Hover Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <h4 className="text-2xl font-bold mb-4 relative z-10">{title}</h4>
      <p className="text-slate-400 mb-8 leading-relaxed relative z-10">{desc}</p>
      
      <button className="w-full py-3 bg-slate-800 group-hover:bg-gradient-to-r group-hover:from-sky-500 group-hover:to-emerald-500 group-hover:text-black transition-all rounded-xl font-bold text-sm relative z-10">
        {buttonText}
      </button>
    </motion.div>
  );
}