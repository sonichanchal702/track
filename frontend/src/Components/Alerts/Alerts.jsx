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
    <div className="min-h-screen bg-[#020202] text-[#e5e5e5] p-6 lg:p-12 font-sans relative overflow-hidden">
      {/* AMBIENT BACKGROUND GLOW */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-orange-600/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-10 relative z-10">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-3">
            <span className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Bell size={25} className="text-blue-500" />
            </span>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center">
              Notifications <span className="text-orange-500">.</span>
            </h1>
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Updates, feedbacks, system logs & deadlines.
          </p>
        </div>

        {/* ALERTS LIST */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {alerts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-32 text-center border border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]"
              >
                <Bell size={40} className="mx-auto text-white/5 mb-4" />
                <p className="text-white/20 text-xs font-medium uppercase tracking-[0.4em]">
                  Zero Active Transmissions
                </p>
              </motion.div>
            ) : (
              alerts.map((alert, idx) => (
                <AlertCard key={alert._id} alert={alert} index={idx} />
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
  const handleRead = async () => {
    await axios.patch(
      `${URL}/alerts/${alert._id}/read`,
      {},
      {
        withCredentials: true,
      },
    );
    navigate(`/dashboard/viewProject/${alert.projectId?._id} `);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ x: 5, backgroundColor: "rgba(255, 255, 255, 0.03)" }}
      className={`relative group w-full bg-white/[0.02] border ${alert.isRead ? "border-white/5" : "border-orange-500/20"} p-6 rounded-[1.8rem] flex items-center justify-between transition-all duration-300`}
    >
      <div className="flex items-center gap-6">
        <div
          className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 ${isFeedback ? "bg-blue-500/10 text-blue-400" : "bg-orange-500/10 text-orange-500"}`}
        >
          {isFeedback ? <MessageSquare size={24} /> : <Zap size={24} />}
        </div>

        {/* CONTENT */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span
              className={`text-[9px] font-medium uppercase tracking-widest px-2 py-0.5 rounded ${isFeedback ? "bg-blue-500/10 text-blue-500" : "bg-orange-500/10 text-orange-500"}`}
            >
              {alert.type}
            </span>
            <span className="text-white/50 text-[12px] font-medium tracking-tighter">
              {new Date(alert.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <h3
            onClick={() => handleRead()}
            className="text-sm cursor-pointer font-bold text-white uppercase tracking-tight group-hover:text-orange-500 transition-colors"
          >
            {alert.message}
          </h3>
          <p className="text-[10px] font-medium text-white/40 uppercase tracking-widest flex items-center gap-1.5 italic">
            Project:{" "}
            <span className="text-white/60">
              {alert.projectId?.projectName || "System"}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="p-3 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-orange-500 transition-colors"
          onClick={() => handleRead()}
        >
          <ArrowUpRight size={18} />
        </button>
      </div>
      {!alert.isRead && (
        <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
      )}
    </motion.div>
  );
};

export default Alerts;
