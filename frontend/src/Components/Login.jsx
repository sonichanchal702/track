import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Building2, ArrowRight, Dice1 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { URL } from "../Constants.js";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addAgency } from "../Store/agencySlice.js";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("test1@gmail.com");
  const [password, setPassword] = useState("Test1@123");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isLogin ? `${URL}/login` : `${URL}/signup`;
      const payload = isLogin ? { email, password } : { email, password, name };

      const res = await axios.post(url, payload, { withCredentials: true });

      toast.success("Login Successfully");
      dispatch(addAgency(res.data.user));
      console.log("Success:", res.data.user);
      navigate("/dashboard");
    } catch (err) {
      console.error("Auth Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

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
        <motion.div
          className="text-center mb-8"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-3xl font-black tracking-tighter text-white">
            TRACK<span className="text-orange-500">.</span>
          </h1>
          <p className="text-white/40 text-sm mt-2">
            The Standard for Agency Operations
          </p>
        </motion.div>

        {/* Toggle Switch */}
        <div className="bg-white/5 border border-white/10 p-1 rounded-2xl mb-8 flex relative">
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
        </div>

        {/* Form Container */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
          <form onSubmit={handleAuth}>
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
                    <InputField
                      icon={<Mail size={18} />}
                      type="email"
                      label="Email Address"
                      value={email}
                      onChange={setEmail}
                      required
                    />
                    <InputField
                      icon={<Lock size={18} />}
                      type="password"
                      label="Password"
                      value={password}
                      onChange={setPassword}
                      required
                    />
                  </div>
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
                    <InputField
                      icon={<Building2 size={18} />}
                      type="text"
                      label="Agency Name"
                      value={name}
                      onChange={setName}
                      required
                    />
                    <InputField
                      icon={<Mail size={18} />}
                      type="email"
                      label="Business Email"
                      value={email}
                      onChange={setEmail}
                      required
                    />
                    <InputField
                      icon={<Lock size={18} />}
                      type="password"
                      label="Set Password"
                      value={password}
                      onChange={setPassword}
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 25px rgba(249,115,22,0.2)",
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white text-black font-bold py-4 rounded-2xl mt-8 flex items-center justify-center gap-2 hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-lg disabled:opacity-50"
            >
              {loading ? "Processing..." : isLogin ? "Login" : "Register"}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/40 text-sm">
              {isLogin ? "New to Track?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-white font-bold hover:text-orange-500"
              >
                {isLogin ? "Create Account" : "Login Now"}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Updated InputField with Props Passing ---
function InputField({ icon, label, type, required, value, onChange }) {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || (value && value.length > 0);

  return (
    <div className="relative">
      <div
        className={`absolute left-4 top-[1.15rem] transition-colors duration-300 z-10 ${
          isFocused ? "text-orange-500" : "text-white/30"
        }`}
      >
        {icon}
      </div>
      <label
        className={`absolute left-12 transition-all duration-300 pointer-events-none ${
          isActive
            ? "-top-2.5 left-4 text-[10px] font-bold text-orange-500 bg-[#050505] px-2 rounded-md"
            : "top-[1.15rem] text-sm text-white/20"
        }`}
      >
        {label} {required && "*"}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-white/5 border transition-all duration-300 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none ${
          isFocused
            ? "border-orange-500/50 bg-white/[0.08] shadow-[0_0_15px_rgba(249,115,22,0.1)] text-white"
            : "border-white/10 text-white"
        }`}
      />
    </div>
  );
}

export default Login;
