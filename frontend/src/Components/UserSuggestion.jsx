import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { URL } from "../Constants.js";

// Removing external import to prevent path resolution errors
// import { URL } from "../Constants.js";
import {
  ArrowLeft,
  Lightbulb,
  Send,
  Loader2,
  Sparkles,
  MessageSquareQuote,
} from "lucide-react";

const UserSuggestion = () => {
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!suggestion.trim()) {
      toast.error("Please write something first!");
      return;
    }

    setLoading(true);

    try {
      // API call to save suggestion
      await axios.post(
        `${URL}/giveSuggestions`,
        { message: suggestion },
        { withCredentials: true },
      );

      toast.success("Thank you! Your suggestion has been recorded.");
      setSuggestion("");

      // Navigate back after a short delay
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      console.error("Suggestion Error:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to submit suggestion.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-[#e5e5e5] font-sans relative overflow-hidden flex flex-col selection:bg-orange-500/30">
      {/* --- AMBIENT GLOW BACKGROUND --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="absolute top-[-20%] left-[10%] w-[50vw] h-[50vw] bg-orange-600/10 blur-[150px] rounded-full opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-600/10 blur-[150px] rounded-full opacity-40" />
      </div>

      {/* --- HEADER --- */}
      <header className="relative z-20 px-6 py-8 sm:px-10 sm:py-10">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium uppercase tracking-widest text-white/60 hover:text-orange-500 hover:bg-white/10 transition-all backdrop-blur-md w-fit shadow-lg"
        >
          <ArrowLeft size={18} /> Back
        </motion.button>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="w-full max-w-2xl bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
        >
          {/* Top Icon & Titles */}
          <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.1,
              }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-[2rem] bg-gradient-to-tr from-orange-500 to-orange-600 flex items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.3)] mb-6 rotate-3 border border-orange-400"
            >
              <Lightbulb size={32} className="text-white sm:w-10 sm:h-10" />
            </motion.div>

            <h1 className="text-2xl sm:text-4xl font-black italic tracking-tighter uppercase text-white mb-2 flex items-center gap-3">
              Give Suggestions<span className="text-orange-500">.</span>
            </h1>
            <p className="text-xs sm:text-sm text-white/40 font-medium uppercase tracking-[0.2em] flex items-center gap-2">
              <Sparkles size={14} className="text-orange-500" /> Shape the
              future of Track
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <div className="absolute top-5 left-5 text-white/20 group-focus-within:text-orange-500 transition-colors duration-300">
                <MessageSquareQuote size={24} />
              </div>
              <textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder="What can we improve? Have a feature request?"
                className="w-full bg-[#111]/80 border border-white/10 rounded-[2rem] pl-14 pr-6 py-5 text-white placeholder:text-white/20 text-sm sm:text-base focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all duration-300 resize-none custom-scrollbar min-h-[160px] sm:min-h-[200px]"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading || !suggestion.trim()}
              type="submit"
              className="w-full py-4 sm:py-5 bg-white text-black font-bold text-xs sm:text-sm uppercase tracking-[0.2em] rounded-2xl sm:rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-orange-500 hover:text-white hover:shadow-[0_10px_30px_rgba(249,115,22,0.3)] transition-all duration-300 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Idea <Send size={18} />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white/20">
              All suggestions are reviewed by our core team.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default UserSuggestion;
