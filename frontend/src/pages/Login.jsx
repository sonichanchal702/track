import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Building2, Phone, ArrowRight } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  // Parent animation for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[450px] z-10"
      >
        {/* --- LOGO --- */}
        <motion.div
          className="text-center mb-8"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-3xl font-black tracking-tighter">
            TRACK<span className="text-orange-500">.</span>
          </h1>
          <p className="text-white/40 text-sm mt-2">
            The Standard for Agency Operations
          </p>
        </motion.div>

        {/* --- TOGGLE SWITCH --- */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/5 border border-white/10 p-1 rounded-2xl mb-8 flex relative"
        >
          <motion.div
            animate={{ x: isLogin ? 0 : "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] bg-orange-500 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.3)]"
          />
          <button
            onClick={() => setIsLogin(true)}
            className={`relative z-10 flex-1 py-3 text-sm font-bold transition-colors ${
              isLogin ? "text-black" : "text-white/50"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`relative z-10 flex-1 py-3 text-sm font-bold transition-colors ${
              !isLogin ? "text-black" : "text-white/50"
            }`}
          >
            Signup
          </button>
        </motion.div>

        {/* --- FORM CONTAINER --- */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
          <form onSubmit={(e) => e.preventDefault()}>
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, x: -20 }}
                >
                  <motion.h2
                    variants={itemVariants}
                    className="text-2xl font-bold mb-6"
                  >
                    Welcome Back
                  </motion.h2>
                  <div className="space-y-5">
                    <motion.div variants={itemVariants}>
                      <InputField
                        icon={<Mail size={18} />}
                        type="email"
                        label="Email Address"
                        required
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <InputField
                        icon={<Lock size={18} />}
                        type="password"
                        label="Password"
                        required
                      />
                    </motion.div>
                  </div>
                  <motion.div
                    variants={itemVariants}
                    className="text-right mt-3"
                  >
                    <button
                      type="button"
                      className="text-xs text-orange-500 hover:text-orange-400 font-medium transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, x: 20 }}
                >
                  <motion.h2
                    variants={itemVariants}
                    className="text-2xl font-bold mb-6"
                  >
                    Create Agency
                  </motion.h2>
                  <div className="space-y-5">
                    <motion.div variants={itemVariants}>
                      <InputField
                        icon={<Building2 size={18} />}
                        type="text"
                        label="Agency Name"
                        required
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <InputField
                        icon={<Mail size={18} />}
                        type="email"
                        label="Business Email"
                        required
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <InputField
                        icon={<Lock size={18} />}
                        type="password"
                        label="Set Password"
                        required
                      />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 25px rgba(249,115,22,0.2)",
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white text-black font-medium py-4 rounded-2xl mt-8 flex items-center justify-center gap-2 hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-lg"
            >
              {isLogin ? "Sign In" : "Register "}
              <ArrowRight size={20} />
            </motion.button>
          </form>

          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="mt-8 text-center"
          >
            <p className="text-white/40 text-sm">
              {isLogin ? "New to Track?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-white font-bold hover:text-orange-500 transition-colors"
              >
                {isLogin ? "Create Account" : "Login Now"}
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// Upgrade: Floating Label Input Component
function InputField({ icon, label, type, required }) {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");

  const isActive = isFocused || value.length > 0;

  return (
    <div className="relative">
      {/* Icon */}
      <div
        className={`absolute left-4 top-[1.15rem] transition-colors duration-300 z-10 ${
          isFocused ? "text-orange-500" : "text-white/30"
        }`}
      >
        {icon}
      </div>

      {/* Floating Label */}
      <label
        className={`absolute left-12 transition-all duration-300 pointer-events-none ${
          isActive
            ? "-top-2.5 left-4 text-[10px] font-bold text-orange-500 bg-[#121212] px-2 rounded-md"
            : "top-[1.15rem] text-sm text-white/20"
        }`}
      >
        {label} {required && "*"}
      </label>

      {/* Input Field */}
      <input
        type={type}
        required={required}
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => setValue(e.target.value)}
        className={`w-full bg-white/5 border transition-all duration-300 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none ${
          isFocused
            ? "border-orange-500/50 bg-white/[0.08] shadow-[0_0_15px_rgba(249,115,22,0.1)]"
            : "border-white/10"
        }`}
      />
    </div>
  );
}
