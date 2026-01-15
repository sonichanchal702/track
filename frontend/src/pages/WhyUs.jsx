import React from "react";
import { motion } from "framer-motion";
import {
  XCircle,
  CheckCircle2,
  Zap,
  Target,
  Heart,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function WhyUs() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const staggerContainer = {
    visible: { transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className="w-full min-h-screen bg-[#030303] text-white selection:bg-orange-500/30 overflow-x-hidden relative pb-20">
      {/* --- BACK BUTTON --- */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed top-6 left-6 md:top-10 md:left-10 z-[70]"
      >
        <Link to="/">
          <motion.button
            whileHover={{
              scale: 1.05,
              color: "#f97316",
              backgroundColor: "rgba(255,255,255,0.1)",
              boxShadow: "0 0 20px rgba(255,255,255,0.05)",
            }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-bold backdrop-blur-md transition-all text-white/70"
          >
            <ArrowLeft size={16} /> Back
          </motion.button>
        </Link>
      </motion.div>

      {/* --- DYNAMIC BACKGROUND GLOWS --- */}
      <div className="fixed top-[-5%] left-[-5%] w-[50vw] h-[50vw] bg-orange-600/10 blur-[120px] rounded-full animate-pulse pointer-events-none" />
      <div className="fixed bottom-[-5%] right-[-5%] w-[40vw] h-[40vw] bg-purple-600/10 blur-[120px] rounded-full animate-pulse pointer-events-none" />

      {/* --- 1. HERO SECTION --- */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 px-6 max-w-7xl mx-auto text-center">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-none mb-6">
            Clarity{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Over
            </span>{" "}
            Chaos.
          </h1>
          <p className="text-base md:text-xl text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed italic">
            "Not just another tool. A high-performance{" "}
            <span className="text-white font-medium">Management System</span>{" "}
            built for the modern agency."
          </p>
        </motion.div>
      </section>

      {/* --- 2. THE PROBLEM SECTION --- */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <ProblemCard
            title="Tool Fatigue"
            desc="Juggling 5 different apps just to manage one project. It's time to consolidate."
            color="hover:border-red-500/50"
            glow="group-hover:bg-red-500/10"
            iconColor="text-red-500"
          />
          <ProblemCard
            title="Over-Engineered"
            desc="Features you never use, settings you can't find. We kept only the essentials."
            color="hover:border-purple-500/50"
            glow="group-hover:bg-purple-500/10"
            iconColor="text-purple-500"
          />
          <ProblemCard
            title="Built for Everyone"
            desc="Generic tools work for no one. TrackX is built specifically for agency DNA."
            color="hover:border-blue-500/50"
            glow="group-hover:bg-blue-500/10"
            iconColor="text-blue-500"
          />
        </motion.div>
      </section>

      {/* --- 3. PHILOSOPHY SECTION --- */}
      <section className="py-24 px-6 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-purple-500/5" />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-8">
            Agency-First{" "}
            <span className="text-orange-500 italic">Philosophy.</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <FeatureTag
              icon={<Zap className="text-yellow-400" />}
              text="Zero Lag"
            />
            <FeatureTag
              icon={<ShieldCheck className="text-green-400" />}
              text="Privacy First"
            />
            <FeatureTag
              icon={<Heart className="text-pink-500" />}
              text="User Centric"
            />
            <FeatureTag
              icon={<Target className="text-blue-400" />}
              text="Focused UX"
            />
          </div>
        </motion.div>
      </section>

      {/* --- 4. COMPARISON TABLE --- */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="bg-zinc-900/20 border border-white/5 rounded-[2.5rem] backdrop-blur-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="p-6 text-xs font-black uppercase text-zinc-500 tracking-widest">
                  The Battle
                </th>
                <th className="p-6 text-xs font-black uppercase text-red-400 text-center">
                  Others
                </th>
                <th className="p-6 text-xs font-black uppercase text-orange-500 text-center bg-orange-500/5">
                  TrackX
                </th>
              </tr>
            </thead>
            <tbody>
              <Row label="Learning Curve" left="Weeks" right="Instant" />
              <Row label="Agency Focus" left="0%" right="100%" />
              <Row label="Interface" left="Bloated" right="Clean" />
              <Row
                label="Cost"
                left="High / Per User"
                right="Free for Core"
                last
              />
            </tbody>
          </table>
        </div>
      </section>

      {/* --- 5. FINAL CTA --- */}
      <section className="py-32 px-6 flex justify-center">
        <motion.div
          whileHover={{ y: -5 }}
          className="relative group p-[1px] rounded-[3rem] bg-gradient-to-r from-orange-500 to-purple-600 w-full max-w-3xl text-center"
        >
          <div className="bg-[#080808] p-12 md:p-20 rounded-[3rem] flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter">
              Ready to <span className="text-orange-500">Scale?</span>
            </h2>
            <Link to="/login">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 40px rgba(249,115,22,0.4)",
                }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 bg-orange-500 text-white font-black px-12 py-5 rounded-2xl text-xl shadow-lg transition-all"
              >
                Start For Free <ArrowRight />
              </motion.button>
            </Link>
            <p className="mt-6 text-white/20 text-xs tracking-widest uppercase font-bold">
              No Credit Card Needed.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

// Helpers
const ProblemCard = ({ title, desc, color, glow, iconColor }) => (
  <motion.div
    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    whileHover={{ y: -10 }}
    className={`group p-8 bg-zinc-900/20 border border-white/5 rounded-[2.5rem] transition-all duration-500 ${color} relative overflow-hidden`}
  >
    <div className={`absolute inset-0 transition-all duration-500 ${glow}`} />
    <div className="relative z-10">
      <XCircle
        className={`${iconColor} mb-4 opacity-50 group-hover:opacity-100 transition-all`}
        size={32}
      />
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-zinc-300 transition-colors">
        {desc}
      </p>
    </div>
  </motion.div>
);

const FeatureTag = ({ icon, text }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all cursor-default"
  >
    {icon}{" "}
    <span className="text-xs font-black tracking-widest uppercase">{text}</span>
  </motion.div>
);

const Row = ({ label, left, right, last }) => (
  <tr
    className={`${
      !last ? "border-b border-white/5" : ""
    } hover:bg-white/[0.01] transition-colors group`}
  >
    <td className="p-6 font-semibold text-zinc-400 group-hover:text-white transition-colors">
      {label}
    </td>
    <td className="p-6 text-center text-zinc-600 italic">{left}</td>
    <td className="p-6 text-center text-orange-400 font-bold bg-orange-500/[0.02]">
      <div className="flex items-center justify-center gap-2">
        <CheckCircle2 size={18} /> {right}
      </div>
    </td>
  </tr>
);
