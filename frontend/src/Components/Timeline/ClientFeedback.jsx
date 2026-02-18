import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { URL } from "../../Constants.js";
import {
  Send,
  Building2,
  User,
  Loader2,
  MessageSquare,
  Clock,
  RefreshCcw,
} from "lucide-react";
import { motion } from "framer-motion";
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
      <div className="h-screen flex items-center justify-center bg-[#020202]">
        <div className="w-10 h-10 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white">
      {/* HEADER */}
      <header className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Client Project Chat</h2>
        <button
          onClick={fetchTimeline}
          className="p-2 bg-white/5 rounded-lg hover:bg-white/10"
        >
          <RefreshCcw size={16} />
        </button>
      </header>

      {/* CHAT AREA */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {updates.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-40">
            <MessageSquare size={40} />
            <p>No messages yet</p>
          </div>
        ) : (
          updates.map((item) => {
            const isClient = item.actorType === "client";

            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isClient ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    isClient ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      isClient
                        ? "bg-orange-500 text-black"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    {isClient ? <User size={14} /> : <Building2 size={14} />}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm ${
                      isClient
                        ? "bg-orange-500 text-black"
                        : "bg-[#1a1a1a] border border-white/10"
                    }`}
                  >
                    {item.message}

                    <div className="text-[10px] mt-2 opacity-50 flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(item.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* INPUT */}
      <div className="p-4 border-t border-white/10">
        <form onSubmit={handleSend} className="flex gap-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your feedback..."
            className="flex-1 bg-[#111] text-white px-4 py-3 rounded-xl resize-none focus:outline-none"
            rows={1}
          />

          <button
            type="submit"
            disabled={!message.trim() || sending}
            className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-black disabled:opacity-50"
          >
            {sending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClientFeedback;
