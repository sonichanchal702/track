import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { URL } from "../../Constants";
import {
  Send,
  Building2,
  User,
  Loader2,
  MessageSquare,
  Clock,
  RefreshCcw,
  Zap,
  ShieldCheck,
  Flag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const ClientFeedback = () => {
  const { token } = useParams();
  const [updates, setUpdates] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const scrollRef = useRef(null);

  // 🔥 Fetch Full Timeline (Persistent Data)
  const fetchTimeline = async () => {
    try {
      const res = await axios.get(`${URL}/client/project/${token}/timeline`);

      // Ascending order for chat format
      const sorted = (res.data || []).sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );

      setUpdates(sorted);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load project history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, [token]);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [updates]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);

    try {
      await axios.post(`${URL}/client/project/${token}/feedback`, { message });

      setMessage("");
      toast.success("Feedback sent!");

      // Re-fetch full timeline after sending
      await fetchTimeline();
    } catch (err) {
      console.error(err);
      toast.error("Failed to send feedback");
    } finally {
      setSending(false);
    }
  };

  if (loading)
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-[#030303]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap size={20} className="text-orange-500 animate-pulse" />
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col h-[100dvh] bg-[#030303] text-white font-sans relative overflow-hidden selection:bg-orange-500/30">
      {/* --- AMBIENT GLOW BACKGROUND --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-orange-600/10 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-600/10 blur-[120px] rounded-full opacity-50" />
      </div>

      {/* --- HEADER --- */}
      <header className="shrink-0 z-50 px-4 pt-4 sm:px-6 sm:pt-6">
        <div className="px-5 py-4 sm:px-6 sm:py-5 bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
              <Building2 size={20} className="text-white sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                Project Node
                <span className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-widest shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
              </h2>
              <p className="text-[10px] sm:text-xs text-white/40 font-medium uppercase tracking-widest mt-0.5">
                Client Portal • Secure
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
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 relative z-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
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
              <h3 className="text-lg font-bold text-white/50 tracking-tight">
                System Empty
              </h3>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/30 mt-2">
                Awaiting first transmission
              </p>
            </motion.div>
          ) : (
            updates.map((item, index) => {
              const isClient =
                item.actorType === "client" || item.type === "feedback";
              const isMilestone = item.type === "milestone";

              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 250,
                    damping: 25,
                    delay: index * 0.02, // Slight stagger for initial load
                  }}
                  className={`flex w-full ${isClient ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex gap-3 sm:gap-4 max-w-[90%] sm:max-w-[85%] lg:max-w-[65%] ${
                      isClient ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center shadow-xl border-2 ${
                        isClient
                          ? "bg-[#0a0a0a] border-orange-500 text-orange-500"
                          : isMilestone
                            ? "bg-[#0a0a0a] border-purple-500/50 text-purple-400"
                            : "bg-[#0a0a0a] border-white/10 text-white/40"
                      }`}
                    >
                      {isClient ? (
                        <User
                          size={14}
                          strokeWidth={3}
                          className="sm:w-4 sm:h-4"
                        />
                      ) : isMilestone ? (
                        <Flag
                          size={14}
                          strokeWidth={2.5}
                          className="sm:w-4 sm:h-4"
                        />
                      ) : (
                        <Building2 size={14} className="sm:w-4 sm:h-4" />
                      )}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`flex flex-col ${isClient ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`relative px-4 py-3 sm:px-6 sm:py-5 rounded-[1.5rem] sm:rounded-[2rem] text-sm leading-relaxed backdrop-blur-md shadow-2xl transition-transform hover:scale-[1.01] ${
                          isClient
                            ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white font-medium rounded-tr-none border border-orange-400 shadow-[0_8px_30px_rgba(249,115,22,0.2)]"
                            : "bg-[#111]/90 border border-white/10 text-white/90 rounded-tl-none hover:border-white/20"
                        }`}
                      >
                        {/* Sender Label for Clarity */}
                        {!isClient && (
                          <div className="flex items-center gap-2 mb-2 sm:mb-3 pb-2 sm:pb-3 border-b border-white/10">
                            <span
                              className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                                isMilestone
                                  ? "text-purple-400"
                                  : "text-blue-400"
                              }`}
                            >
                              {isMilestone ? (
                                <Flag size={10} className="sm:w-3 sm:h-3" />
                              ) : (
                                <ShieldCheck
                                  size={10}
                                  className="sm:w-3 sm:h-3"
                                />
                              )}
                              {isMilestone
                                ? "Milestone Reached"
                                : "Agency Update"}
                            </span>
                          </div>
                        )}

                        <span className="whitespace-pre-wrap">
                          {item.message}
                        </span>

                        <div
                          className={`text-[9px] sm:text-[10px] font-bold mt-2 sm:mt-3 flex items-center gap-1.5 ${
                            isClient
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
      <div className="shrink-0 p-4 sm:p-6 z-20">
        <form
          onSubmit={handleSend}
          className="relative max-w-4xl mx-auto flex items-end gap-2 p-1.5 bg-[#1a1a1a]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl focus-within:border-orange-500/50 focus-within:ring-2 focus-within:ring-orange-500/10 transition-all duration-300"
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
            placeholder="Type your feedback here..."
            className="w-full bg-transparent border-none text-white placeholder:text-white/20 text-sm px-4 py-3 sm:px-6 sm:py-4 focus:outline-none resize-none max-h-32 [scrollbar-width:none]"
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
          Press Enter to Send
        </p>
      </div>
    </div>
  );
};

export default ClientFeedback;
