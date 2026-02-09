import React, { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../../Constants.js";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Zap,
  Clock,
  History,
  Sparkles,
  ShieldCheck,
  CalendarClock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ProjectTimeline() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTimeline = async () => {
    try {
      const res = await axios.get(`${URL}/project/${id}/timeline`, {
        withCredentials: true,
      });
      const sortedData = (res.data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setTimeline(sortedData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, [id]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#020202]">
        <div className="w-10 h-10 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#020202] text-[#e5e5e5] px-4 sm:px-6 lg:px-12 py-6 font-sans relative">
      {/* BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-orange-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* HEADER */}
        <div className="flex flex-col gap-6 border-b border-white/5 pb-8 mb-10">
          <motion.button
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="w-fit flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-xs sm:text-sm font-medium uppercase tracking-widest text-white/60 hover:text-orange-500 transition-all"
          >
            <ArrowLeft size={18} /> Back
          </motion.button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                <CalendarClock size={22} className="text-cyan-500" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-black uppercase italic tracking-tighter">
                Project Updates<span className="text-orange-500">.</span>
              </h1>
            </div>

            <div className="px-4 py-2 bg-white/[0.02] border border-white/10 rounded-2xl flex items-center gap-4 w-fit">
              <History size={18} className="text-orange-500" />
              <div>
                <p className="text-[10px] font-black uppercase text-white/40">
                  Total Logs
                </p>
                <p className="text-lg font-black">{timeline.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* TIMELINE */}
        <div className="relative space-y-10">
          {/* CENTER LINE ONLY FOR DESKTOP */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500/50 via-white/5 to-transparent -translate-x-1/2 hidden md:block" />

          <AnimatePresence>
            {timeline.length === 0 ? (
              <div className="py-20 text-center opacity-30">
                <Sparkles size={40} className="mx-auto mb-4" />
                <p className="uppercase tracking-[0.5em] text-xs">
                  No Updates Yet
                </p>
              </div>
            ) : (
              timeline.map((log, index) => (
                <TimelineItem key={log._id} log={log} index={index} />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const TimelineItem = ({ log, index }) => {
  const isClient = log.actorType === "client";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className={`relative flex flex-col md:flex-row ${
        isClient ? "md:flex-row-reverse" : ""
      } items-center w-full gap-6`}
    >
      {/* DOT (DESKTOP ONLY) */}
      <div className="absolute left-1/2 top-1/2 w-3 h-3 bg-[#020202] border-2 border-orange-500 rounded-full -translate-x-1/2 -translate-y-1/2 hidden md:block" />

      {/* CARD */}
      <div className="w-full md:w-[45%]">
        <motion.div
          whileHover={{ y: -4 }}
          className="p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl shadow-xl"
        >
          <div className="flex justify-between items-center mb-3">
            <div
              className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${
                isClient ? "text-blue-400" : "text-orange-500"
              }`}
            >
              {isClient ? <ShieldCheck size={12} /> : <Zap size={12} />}
              {log.type}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-white/60">
              <Clock size={10} />
              {new Date(log.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          <p className="text-sm sm:text-base font-semibold italic text-white/90">
            “{log.message}”
          </p>

          <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[10px] uppercase tracking-widest text-white/40">
            <span>{log.actorType}</span>
            <span>{new Date(log.createdAt).toDateString()}</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProjectTimeline;
