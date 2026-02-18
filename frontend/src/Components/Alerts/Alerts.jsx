import React, { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../../Constants.js";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  MessageSquare,
  Zap,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Trash2,
  Sparkles,
  Layers,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAlerts = async () => {
    try {
      const res = await axios.get(`${URL}/alerts`, { withCredentials: true });
      setAlerts(Array.isArray(res.data) ? res.data : res.data.alerts || []);
    } catch (err) {
      console.error("Alerts sync failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#020202]">
        <div className="w-10 h-10 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#020202] text-[#e5e5e5] px-4 py-8 lg:p-12 font-sans relative overflow-hidden">
      {/* AMBIENT BACKGROUND GLOW */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-orange-600/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-10 relative z-10">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-3">
            <span className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Bell size={25} className="text-blue-500" />
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter uppercase italic flex items-center">
              Notifications <span className="text-orange-500">.</span>
            </h1>
          </h1>
          <p className="text-sm text-white/40 mt-2 ml-1">
            Updates, feedbacks, system logs & deadlines.
          </p>
        </div>

        {/* ALERTS TIMELINE */}
        <div className="relative border-l border-orange-500/70 ml-4 md:ml-6 space-y-8 pb-12">
          <AnimatePresence mode="popLayout">
            {alerts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="ml-8 py-32 text-center border border-dashed border-white/5 rounded-[3rem] bg-orange-500/[0.01]"
              >
                <Bell size={40} className="mx-auto text-white/5 mb-4" />
                <p className="text-white/20 text-xs font-medium uppercase tracking-[0.4em]">
                  Zero Active Transmissions
                </p>
              </motion.div>
            ) : (
              alerts.map((alert, idx) => (
                <div key={alert._id} className="relative pl-6 md:pl-10">
                  {/* TIMELINE DOT */}
                  <span
                    className={`absolute -left-[5px] top-6 h-2.5 w-2.5 rounded-full ring-4 ring-[#020202] ${alert.isRead ? "bg-white/20" : "bg-orange-500"}`}
                  />

                  <AlertCard alert={alert} index={idx} />
                </div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const AlertCard = ({ alert, index }) => {
  const isFeedback = alert.type === "ClientFeedback";
  const navigate = useNavigate();

  // Date Extraction
  const dateObj = new Date(alert.createdAt);
  const date = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const time = dateObj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleRead = async () => {
    try {
      if (!alert.isRead) {
        await axios.patch(
          `${URL}/alerts/${alert._id}/read`,
          {},
          { withCredentials: true },
        );
      }
      if (alert.projectId?._id) {
        navigate(`/dashboard/viewProject/${alert.projectId._id}`);
      }
    } catch (err) {
      console.error("Read status update failed", err);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ x: 5, backgroundColor: "rgba(255, 255, 255, 0.03)" }}
      className={`relative group w-full bg-white/[0.02] border ${
        alert.isRead ? "border-white/5" : "border-orange-500/20"
      } p-5 sm:p-6 rounded-[1.8rem] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 transition-all duration-300`}
    >
      <div className="flex items-start sm:items-center gap-4 sm:gap-6 w-full">
        {/* ICON */}
        <div
          className={`shrink-0 h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 ${
            isFeedback
              ? "bg-blue-500/10 text-blue-400"
              : "bg-orange-500/10 text-orange-500"
          }`}
        >
          {isFeedback ? (
            <MessageSquare size={20} className="sm:w-6 sm:h-6" />
          ) : (
            <Zap size={20} className="sm:w-6 sm:h-6" />
          )}
        </div>

        {/* CONTENT */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span
              className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                isFeedback
                  ? "bg-blue-500/10 text-blue-500"
                  : "bg-orange-500/10 text-orange-500"
              }`}
            >
              {alert.type}
            </span>
            <div className="flex items-center gap-1.5 text-white/40 text-[10px] sm:text-[11px] font-medium tracking-tight bg-white/5 px-2 py-0.5 rounded-md">
              <Calendar size={10} />
              <span>{date}</span>
              <span className="opacity-30">|</span>
              <span>{time}</span>
            </div>
          </div>

          <h3
            onClick={handleRead}
            className="text-sm sm:text-[15px] cursor-pointer font-bold text-white uppercase tracking-tight group-hover:text-orange-500 transition-colors line-clamp-2"
          >
            {alert.message}
          </h3>

          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-1.5 truncate">
            Project:{" "}
            <span className="text-white/60 truncate">
              {alert.projectId?.projectName || "System Node"}
            </span>
          </p>
        </div>
      </div>

      {/* ACTION BUTTON (Hidden on mobile unless hovered, visible on desktop) */}
      <div className="hidden sm:flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity self-center shrink-0">
        <button
          className="p-3 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-orange-500 transition-all active:scale-95"
          onClick={handleRead}
          title="View Details"
        >
          <ArrowUpRight size={18} />
        </button>
      </div>

      {/* Mobile only click area overlay for better UX */}
      <div className="sm:hidden absolute inset-0 z-10" onClick={handleRead} />

      {!alert.isRead && (
        <div className="absolute top-4 right-4 w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.8)] animate-pulse" />
      )}
    </motion.div>
  );
};

export default Alerts;
