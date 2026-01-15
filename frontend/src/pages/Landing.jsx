import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden relative selection:bg-orange-500/30">
      {/* --- BACKGROUND GLOW EFFECTS --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-orange-600/10 blur-[120px] rounded-full" />

      {/* --- FLOATING GLASS NAVBAR --- */}
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

          {/* Links in the Middle */}
          {/* Navbar Content */}
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

      {/* --- HERO SECTION --- */}
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
            Everything your agency needs to run faster, smarter, and cleaner
            without spreadsheets or chaos.
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
            <div className="relative bg-zinc-900 border border-white/10 rounded-[2rem] overflow-hidden aspect-video shadow-2xl">
              <div className="w-full h-full flex items-center justify-center text-white/10 text-9xl font-black">
                DASHBOARD
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
