import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Send, User, Building2, Loader2, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { URL } from "../../Constants.js";

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
      <div className="h-screen flex justify-center items-center bg-black">
        <Loader2 className="animate-spin text-orange-500" />
      </div>
    );

  return (
    <div className="flex flex-col h-screen bg-[#020202] text-white">
      {/* HEADER */}
      <div className="p-5 border-b border-white/10">
        <h2 className="text-lg font-semibold">Project Communication</h2>
      </div>

      {/* CHAT */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {updates.map((item) => {
          const isFreelancer = item.actorType === "freelancer";

          return (
            <div
              key={item._id}
              className={`flex ${
                isFreelancer ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex gap-3 max-w-[80%] ${
                  isFreelancer ? "flex-row-reverse" : ""
                }`}
              >
                {/* Avatar */}
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center ${
                    isFreelancer ? "bg-orange-500 text-black" : "bg-white/10"
                  }`}
                >
                  {isFreelancer ? <User size={14} /> : <Building2 size={14} />}
                </div>

                {/* Message */}
                <div
                  className={`px-4 py-3 rounded-2xl text-sm ${
                    isFreelancer
                      ? "bg-orange-500 text-black rounded-tr-none"
                      : "bg-[#111] border border-white/10 rounded-tl-none"
                  }`}
                >
                  {item.message}

                  <div className="text-[10px] mt-2 opacity-50 flex gap-1">
                    <Clock size={10} />
                    {new Date(item.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* INPUT */}
      <div className="p-4 border-t border-white/10">
        <form onSubmit={handleSend} className="flex gap-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Post your update..."
            className="flex-1 bg-[#111] px-4 py-3 rounded-xl resize-none focus:outline-none"
          />

          <button
            type="submit"
            disabled={!message.trim() || sending}
            className="h-11 w-11 rounded-full bg-orange-500 flex items-center justify-center text-black"
          >
            {sending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FreelancerUpdate;
