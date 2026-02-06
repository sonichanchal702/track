import React, { useEffect, useState } from "react";
import { URL } from "../Constants.js";
import axios from "axios";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";
import {
  Phone,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  UserRoundPlus,
  Zap,
  Edit3,
  Trash,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ViewTeam() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const itemsPerPage = 6;

  // Hover Glow Logic ke liye Motion Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const background = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, rgba(249, 115, 22, 0.12), transparent 80%)`;
  const borderOverlay = useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, rgba(249, 115, 22, 0.4), transparent 80%)`;

  const tagColors = [
    "text-cyan-400 bg-cyan-400/5 border-cyan-400/20",
    "text-purple-400 bg-purple-400/5 border-purple-400/20",
    "text-emerald-400 bg-emerald-400/5 border-emerald-400/20",
    "text-rose-400 bg-rose-400/5 border-rose-400/20",
    "text-amber-400 bg-amber-400/5 border-amber-400/20",
  ];

  useEffect(() => {
    const getTeamData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${URL}/team`, { withCredentials: true });
        setTeam(res.data?.data || []);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    getTeamData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${URL}/delete-team/${id}`, { withCredentials: true });
      setTeam((prev) => prev.filter((m) => m._id !== id));
      toast.success("Member Removed");
    } catch (err) {
      toast.error("Delete Failed");
    }
  };

  const totalPages = Math.ceil(team.length / itemsPerPage);
  const currentItems = team.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#020202]">
        <div className="w-10 h-10 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen px-6 lg:px-10 py-8 flex flex-col gap-8 bg-[#020202] text-[#e5e5e5]">
      
      <div className="flex flex-row w-full justify-between items-center text-left">
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-orange-500/10 border border-orange-500/20 shadow-lg">
            <Sparkles size={24} className="text-orange-500" />
          </div>
          Talent Pool<span className="text-orange-500">.</span>
        </h1>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(`/dashboard/addTeamMember`)}
          className="flex items-center gap-2 px-6 py-3.5 bg-orange-500 text-black text-xs font-black uppercase italic rounded-2xl shadow-xl shadow-orange-500/20"
        >
          <UserRoundPlus size={18} />
          Onboard Talent
        </motion.button>
      </div>

      {/* TEAM GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {currentItems.map((member, idx) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onMouseMove={handleMouseMove}
              className="group relative rounded-[2rem] p-[1px] overflow-hidden bg-white/5 transition-all duration-500"
            >
              {/* INTERACTIVE GLOW EFFECTS */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background }}
              />
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: borderOverlay }}
              />

              {/* CARD INNER CONTENT */}
              <div className="relative z-10 h-full rounded-[2rem] bg-[#0a0a0a]/90 backdrop-blur-3xl p-6 border border-white/[0.05] flex flex-col gap-5 text-left">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-orange-600 to-orange-400 flex items-center justify-center text-black text-xl font-black shadow-lg shadow-orange-500/20">
                      {member.name?.[0]}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                        {member.name}
                      </h3>
                      <div
                        className={`mt-1 px-3 py-0.5 rounded-full border inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${member.status === "busy" ? "bg-red-500/10 border-yellow-500/20 text-yellow-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"}`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full animate-pulse ${member.status === "busy" ? "bg-yellow-500" : "bg-emerald-500"}`}
                        />
                        {member.status || "Active"}
                      </div>
                    </div>
                  </div>

                  {/* CARD ACTIONS */}
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        navigate(`/dashboard/editTeam/${member._id}`)
                      }
                      className="p-2.5 bg-yellow-400/10 text-yellow-500 rounded-xl hover:scale-110 transition-all"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(member._id)}
                      className="p-2.5 bg-red-400/10 text-red-500 rounded-xl hover:scale-110 transition-all"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>

                {/* SKILLS */}
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 flex items-center gap-2 font-black">
                    <Zap size={12} className="text-orange-500" /> Stack
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {member.skills?.map((skill, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1 border rounded-lg text-[10px] font-bold uppercase ${tagColors[i % tagColors.length]}`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* BOTTOM INFO */}
                <div className="mt-auto pt-4 border-t border-white/[0.05] flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                      Contact
                    </p>
                    <div className="flex items-center gap-2 text-xs font-bold text-white/80">
                      <Phone size={12} className="text-orange-500/60" />{" "}
                      {member.contact}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                      Payout
                    </p>
                    <div className="text-xl font-bold text-white italic">
                      ₹{member.payoutPerProject}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-center gap-8 py-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-orange-500 disabled:opacity-20 transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm font-bold text-white/40 uppercase tracking-widest">
          Page {currentPage} / {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-orange-500 disabled:opacity-20 transition-all"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

export default ViewTeam;
