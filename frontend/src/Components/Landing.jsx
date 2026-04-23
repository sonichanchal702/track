import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Banknote,
  Bell,
  ShieldCheck,
  Globe,
  CheckCircle2,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden relative selection:bg-orange-500/30">
      {/* --- BACKGROUND GLOW EFFECTS --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-orange-600/10 blur-[120px] rounded-full" />
      </div>

      {/* --- NAVBAR --- */}
      <Navbar />

      {/* --- HERO SECTION --- */}
      <HeroSection />

      {/* --- FEATURES GRID --- */}
      <FeaturesSection />

      {/* --- WORKFLOW BENTO --- */}
      <WorkflowSection />

      {/* --- STATS --- */}
      <StatsSection />

      {/* --- BOTTOM CTA --- */}
      <CTASection />
    </div>
  );
}

/* ---------------- SECTIONS ---------------- */

const Navbar = () => (
  <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-between w-full max-w-5xl px-8 py-3 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl"
    >
      <h1 className="text-xl font-black tracking-tighter">
        TRACK<span className="text-orange-500">.</span>
      </h1>

      <div className="hidden md:flex items-center gap-8 text-[13px] font-medium tracking-wide text-white/60">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ y: -1 }}
        >
          <Link
            to="/product"
            className="cursor-pointer transition-all duration-300 hover:text-white"
          >
            <motion.span
              whileHover={{ scale: 1.08, color: "orange" }}
              transition={{ duration: 0.25, ease: "linear" }}
              className="inline-block"
            >
              Product
            </motion.span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ y: -1 }}
        >
          <Link
            to="/pricing"
            className="cursor-pointer transition-all duration-300 hover:text-white"
          >
            <motion.span
              whileHover={{ scale: 1.08, color: "orange" }}
              transition={{ duration: 0.25, ease: "linear" }}
              className="inline-block"
            >
              Pricing
            </motion.span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ y: -1 }}
        >
          <Link
            to="/why-us"
            className="cursor-pointer transition-all duration-300 hover:text-white"
          >
            <motion.span
              whileHover={{ scale: 1.08, color: "orange" }}
              transition={{ duration: 0.25, ease: "linear" }}
              className="inline-block"
            >
              Why us
            </motion.span>
          </Link>
        </motion.div>
      </div>

      <div className="flex items-center gap-4">
        <Link to={"/login"}>
          <motion.button
            whileHover={{
              y: -2,
              boxShadow: "0px 8px 30px rgba(249, 115, 22, 0.25)",
            }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
              delay: 0.9,
            }}
            className="
    relative
    bg-orange-500
    text-black
    text-sm
    font-semibold
    px-7
    py-2
    rounded-full
    shadow-md
    overflow-hidden
  "
          >
            {/* subtle highlight */}
            <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition" />

            <span className="relative z-10 tracking-wide">Start Free</span>
          </motion.button>
        </Link>
      </div>
    </motion.nav>
  </div>
);

const HeroSection = () => (
  <section className="relative pt-48 pb-32 px-6 flex flex-col items-center justify-center min-h-screen">
    <div className="max-w-5xl text-center">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium tracking-widest text-orange-400 uppercase mb-8"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
        </span>
        BUILT FOR MODERN AGENCIES
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.9] mb-8"
      >
        The Standard for <br />
        <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent italic font-serif">
          Agency Operations.
        </span>
      </motion.h1>
      <div className="absolute top-[30%] right-[-10%] w-[35%] h-[35%] bg-orange-500/[0.08] blur-[100px] rounded-full" />

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="max-w-2xl mx-auto text-lg md:text-xl text-white/40 leading-relaxed font-light"
      >
        Everything your agency needs to run faster, smarter, and cleaner without
        spreadsheets or chaos.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-12 flex flex-col md:flex-row items-center justify-center gap-5"
      >
        <Link to={"/login"}>
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 30px rgba(249, 115, 22, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            className="w-full md:w-auto px-7 py-3 bg-orange-500 font-medium rounded-3xl text-lg hover:bg-orange-600 text-white transition-all shadow-[0_0_20px_rgba(249,115,22,0.1)]"
          >
            Get Started for Free
          </motion.button>
        </Link>

        <motion.button
          whileHover={{
            scale: 1.05, // Thoda sa bada hoga
            backgroundColor: "rgba(255,255,255,0.1)", // Background thoda aur visible hoga
            boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.2)", // White soft glow/shadow
            color: "#fff", // Text poora white ho jayega
          }}
          whileTap={{ scale: 0.95 }} // Click karne par halka sa dabega
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 15,
          }}
          className="w-full md:w-auto px-7 py-3 border border-white/10 rounded-3xl text-lg font-medium text-white/70 transition-all outline-none"
        >
          Explore
        </motion.button>
      </motion.div>

      {/* Dashboard Preview (Optional visual placeholder) */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="mt-24 relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-500 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative bg-zinc-900 border border-white/10 rounded-[2rem] overflow-clip aspect-video  shadow-2xl">
          <img src="/favicon.png" alt="Dashboard Preview" />
        </div>
      </motion.div>
    </div>
  </section>
);

const FeaturesSection = () => {
  const features = [
    {
      icon: <LayoutDashboard />,
      title: "Command Center",
      desc: "Real-time overview of your entire agency operations.",
    },
    {
      icon: <Briefcase />,
      title: "Project Registry",
      desc: "Track deadlines, budgets, and deliverables with precision.",
    },
    {
      icon: <Users />,
      title: "Talent Pool",
      desc: "Manage your team, assign roles, and track payouts.",
    },
    {
      icon: <Banknote />,
      title: "Treasury",
      desc: "Monitor cash flow, revenue, and expenses instantly.",
    },
    {
      icon: <Bell />,
      title: "Intel Feed",
      desc: "Live alerts on project updates and client feedback.",
    },
    {
      icon: <ShieldCheck />,
      title: "Secure Data",
      desc: "End-to-end encryption for all sensitive client data.",
    },
  ];

  return (
    <section className="py-32 px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white mb-4">
            Everything You Need<span className="text-orange-500">.</span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto">
            A complete suite of tools designed to replace your fragmented
            spreadsheet system.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-orange-500/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 text-white group-hover:bg-orange-500 group-hover:text-black transition-colors">
                {React.cloneElement(f.icon, { size: 24 })}
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight mb-2 text-white">
                {f.title}
              </h3>
              <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WorkflowSection = () => (
  <section className="py-20 px-6 relative z-10">
    <div className="max-w-6xl mx-auto bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 blur-[100px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            Workflow Engine
          </div>
          <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white mb-6">
            From Lead to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
              Liquidity.
            </span>
          </h2>
          <p className="text-white/50 text-lg mb-8 leading-relaxed">
            Track automates the boring stuff. Create projects, assign talent,
            generate invoices, and track payments without leaving the dashboard.
          </p>

          <div className="space-y-4">
            {[
              "Client Onboarding",
              "Project Milestone Tracking",
              "Automated Invoicing",
              "Team Payouts",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <CheckCircle2 size={14} />
                </div>
                <span className="text-sm font-bold text-white/80 uppercase tracking-wide">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative h-[400px] bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 flex items-center justify-center"
        >
          {/* Abstract UI Elements */}
          <div className="relative w-full max-w-sm">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-0 p-4 bg-[#111] border border-white/10 rounded-2xl shadow-xl z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500" />
                <div>
                  <div className="h-2 w-20 bg-white/20 rounded mb-1" />
                  <div className="h-2 w-10 bg-white/10 rounded" />
                </div>
              </div>
            </motion.div>

            <div className="p-6 bg-[#0f0f0f] border border-white/10 rounded-3xl shadow-2xl relative z-10">
              <div className="flex justify-between items-center mb-6">
                <div className="h-8 w-8 bg-orange-500 rounded-lg" />
                <div className="h-2 w-12 bg-white/10 rounded" />
              </div>
              <div className="space-y-3">
                <div className="h-16 w-full bg-white/5 rounded-xl border border-white/5" />
                <div className="h-16 w-full bg-white/5 rounded-xl border border-white/5" />
                <div className="h-16 w-full bg-white/5 rounded-xl border border-white/5" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const StatsSection = () => (
  <section className="py-20 border-y border-white/5 bg-white/[0.02]">
    <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
      {[
        { val: "₹12M+", label: "Revenue Tracked" },
        { val: "450+", label: "Active Agencies" },
        { val: "99.9%", label: "Uptime Reliability" },
        { val: "24/7", label: "System Intelligence" },
      ].map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tighter">
            {s.val}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500">
            {s.label}
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

const CTASection = () => (
  <section className="py-32 px-6 text-center relative z-10">
    <div className="max-w-4xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white mb-8"
      >
        Ready to take <br /> <span className="text-orange-500">Control?</span>
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row items-center justify-center gap-4"
      >
        <Link to="/signup">
          <button className="px-10 py-5 bg-orange-500 text-black text-sm font-black uppercase tracking-widest rounded-full hover:bg-orange-400 transition-all shadow-[0_0_40px_rgba(249,115,22,0.3)]">
            Start Free Trial
          </button>
        </Link>
        <button className="px-10 py-5 bg-white/5 border border-white/10 text-white text-sm font-bold uppercase tracking-widest rounded-full hover:bg-white/10 transition-all">
          Contact Sales
        </button>
      </motion.div>
    </div>
  </section>
);
