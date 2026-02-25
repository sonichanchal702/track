import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { URL } from "../../Constants";
import {
  Send,
  User,
  Building2,
  Loader2,
  Clock,
  RefreshCcw,
  Zap,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const FreelancerUpdate = () => {
  const { token } = useParams();

  const [updates, setUpdates] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const scrollRef = useRef(null);

  // ✅ FETCH FULL TIMELINE
  const fetchTimeline = async () => {
    try {
      const res = await axios.get(
        `${URL}/freelancer/project/${token}/timeline`,
      );

      const sorted = (res.data || []).sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );

      setUpdates(sorted);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load updates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
    // Optional: Auto-refresh every 10 seconds for real-time feel
    const interval = setInterval(fetchTimeline, 10000);
    return () => clearInterval(interval);
  }, [token]);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [updates]);

  // ✅ POST FREELANCER UPDATE
  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);

    try {
      await axios.post(`${URL}/talent/project/${token}/update`, {
        message,
      });

      setMessage("");
      toast.success("Update posted");

      await fetchTimeline();
    } catch (err) {
      console.error(err);
      toast.error("Failed to send update");
    } finally {
      setSending(false);
    }
  };

  if (loading)
    return (
      <div className="h-[100dvh] flex flex-col items-center justify-center bg-[#030303] gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap size={20} className="text-orange-500 animate-pulse" />
          </div>
        </div>
        <p className="text-orange-500 font-medium tracking-[0.3em] text-xs uppercase italic mt-2">
          Syncing Chats...
        </p>
      </div>
    );

  return (
    <div className="flex flex-col h-[100dvh] bg-[#030303] text-white font-sans relative overflow-hidden selection:bg-orange-500/30">
      {/* --- AMBIENT GLOW BACKGROUND --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-orange-600/10 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-600/10 blur-[120px] rounded-full opacity-40" />
      </div>

      {/* --- HEADER --- */}
      <header className="shrink-0 z-50 px-4 pt-4 sm:px-6 sm:pt-6">
        <div className="px-5 py-4 sm:px-6 sm:py-5 bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl flex justify-between items-center max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
              <Building2 size={20} className="text-white sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-medium   text-white flex items-center gap-2">
                Updates Timeline
                <span className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-widest shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </h2>
              <p className="text-[10px] sm:text-xs text-white/40 font-medium uppercase tracking-widest mt-0.5 flex items-center gap-1">
                Agency Portal{" "}
                <ChevronRight size={10} className="text-orange-500" /> Secure
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchTimeline}
            className="p-2.5 sm:p-3 bg-white/5 border border-transparent hover:border-white/10 rounded-xl sm:rounded-2xl text-white/40 hover:text-white transition-all shadow-lg"
            title="Refresh Timeline"
          >
            <RefreshCcw size={18} className="sm:w-5 sm:h-5" />
          </motion.button>
        </div>
      </header>

      {/* --- CHAT AREA --- */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 relative z-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden max-w-5xl mx-auto w-full"
      >
        <AnimatePresence>
          {updates.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center opacity-40"
            >
              <div className="w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mb-6 rotate-3">
                <MessageSquare size={36} className="text-white/30" />
              </div>
              <h3 className="text-lg font-bold text-white/50  ">
                Quiet Terminal
              </h3>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/30 mt-2">
                Post the first project update
              </p>
            </motion.div>
          ) : (
            updates.map((item, index) => {
              // As an agency/freelancer, "freelancer" updates are YOUR messages
              const isFreelancer = item.actorType === "freelancer";

              return (
                <motion.div
                  key={item._id || index}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 250,
                    damping: 25,
                    delay: index * 0.02,
                  }}
                  className={`flex w-full ${isFreelancer ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex gap-3 sm:gap-4 max-w-[90%] sm:max-w-[85%] lg:max-w-[65%] ${
                      isFreelancer ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center shadow-xl border-2 ${
                        isFreelancer
                          ? "bg-[#0a0a0a] border-orange-500 text-orange-500"
                          : "bg-[#0a0a0a] border-white/10 text-white/40"
                      }`}
                    >
                      {isFreelancer ? (
                        <Building2
                          size={14}
                          strokeWidth={2.5}
                          className="sm:w-4 sm:h-4"
                        />
                      ) : (
                        <User size={14} className="sm:w-4 sm:h-4" />
                      )}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`flex flex-col ${isFreelancer ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`relative px-4 py-3 sm:px-6 sm:py-5 rounded-[1.5rem] sm:rounded-[2rem] text-sm leading-relaxed backdrop-blur-md shadow-2xl transition-transform hover:scale-[1.01] ${
                          isFreelancer
                            ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white font-medium rounded-tr-none border border-orange-400 shadow-[0_8px_30px_rgba(249,115,22,0.2)]"
                            : "bg-[#111]/90 border border-white/10 text-white/90 rounded-tl-none hover:border-white/20"
                        }`}
                      >
                        {/* TAGS FOR BOTH PARTIES */}
                        <div
                          className={`flex items-center gap-2 mb-2 sm:mb-3 pb-2 sm:pb-3 border-b ${
                            isFreelancer ? "border-white/20" : "border-white/10"
                          }`}
                        >
                          <span
                            className={`text-[10px] sm:text-[10px] font-medium uppercase tracking-widest flex items-center gap-1.5 ${
                              isFreelancer ? "text-white/90" : "text-blue-400"
                            }`}
                          >
                            {isFreelancer ? (
                              <>
                                <Zap size={10} className="sm:w-3 sm:h-3" /> You
                              </>
                            ) : (
                              <>
                                <ShieldCheck
                                  size={10}
                                  className="sm:w-3 sm:h-3"
                                />{" "}
                                Client Feedback
                              </>
                            )}
                          </span>
                        </div>

                        <span className="whitespace-pre-wrap">
                          {item.message}
                        </span>

                        <div
                          className={`text-[11px] sm:text-[11px] font-bold mt-1 sm:mt-2 flex items-center gap-1.5 ${
                            isFreelancer
                              ? "justify-end text-orange-100/70"
                              : "text-white/30"
                          }`}
                        >
                          <Clock size={10} className="sm:w-3 sm:h-3" />
                          {new Date(item.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          <span className="opacity-50">|</span>
                          {new Date(item.createdAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* --- INPUT AREA --- */}
      <div className="shrink-0 p-4 sm:p-6 z-20 w-full max-w-5xl mx-auto">
        <form
          onSubmit={handleSend}
          className="relative flex items-end gap-2 p-1.5 bg-[#1a1a1a]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl focus-within:border-orange-500/50 focus-within:ring-2 focus-within:ring-orange-500/10 transition-all duration-300"
        >
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder="Post your update here..."
            className="w-full bg-transparent border-none text-white placeholder:text-white/20 text-sm px-4 py-3 sm:px-6 sm:py-4 focus:outline-none resize-none max-h-32 [scrollbar-width:none] font-medium"
            rows={1}
            style={{ minHeight: "48px" }}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!message.trim() || sending}
            className="h-10 w-10 sm:h-12 sm:w-12 mb-0.5 mr-0.5 sm:mb-1 sm:mr-1 shrink-0 rounded-full bg-gradient-to-tr from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all"
          >
            {sending ? (
              <Loader2 size={18} className="animate-spin sm:w-5 sm:h-5" />
            ) : (
              <Send
                size={18}
                strokeWidth={2.5}
                className="-ml-0.5 sm:w-5 sm:h-5"
              />
            )}
          </motion.button>
        </form>
        <p className="hidden sm:block text-center text-[10px] font-bold uppercase tracking-widest text-white/20 mt-3">
          Press Enter to Post Update
        </p>
      </div>
    </div>
  );
};

export default FreelancerUpdate;
