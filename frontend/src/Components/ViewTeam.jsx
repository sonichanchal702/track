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

const tagColors = [
  "text-cyan-400 bg-cyan-400/5 border-cyan-400/20",
  "text-purple-400 bg-purple-400/5 border-purple-400/20",
  "text-emerald-400 bg-emerald-400/5 border-emerald-400/20",
  "text-rose-400 bg-rose-400/5 border-rose-400/20",
  "text-amber-400 bg-amber-400/5 border-amber-400/20",
];

function ViewTeam() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${URL}/delete-team/${id}`, {
        withCredentials: true,
      });
      // Filter out the deleted member from the state
      setTeam((prev) => prev.filter((m) => m._id !== id));
      toast.success("Team Member deleted successfully");
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  useEffect(() => {
    const getTeamData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${URL}/team`, { withCredentials: true });
        let finalData = res.data?.data || [];
        setTeam(finalData);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    getTeamData();
  }, []);

  const totalPages = Math.ceil(team.length / itemsPerPage);
  const currentItems = team.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#020202]">
        <div className="w-12 h-12 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="relative min-h-screen px-6 lg:px-10 py-8 flex flex-col gap-8 overflow-hidden text-[#e5e5e5] font-sans">
      <div className="space-y-1 flex flex-row w-full justify-between items-center text-left">
        <h1 className="text-4xl font-medium text-white tracking-tighter uppercase flex flex-row italic leading-none items-center">
          <div className="p-2 mr-2 rounded-2xl bg-orange-500/10 border border-orange-500/20 shadow-lg shadow-orange-500/10">
            <Sparkles size={24} className="text-orange-500" />
          </div>
          Talent Pool<span className="text-orange-500 ml-2">.</span>
        </h1>
        <button className="flex items-center gap-2 px-5 py-3 bg-orange-500 hover:bg-orange-600 text-black text-sm font-bold rounded-xl shadow-lg transition-all duration-200 active:scale-95 uppercase tracking-tight">
          <UserRoundPlus size={18} />
          Add Team Member
        </button>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {currentItems.map((member, idx) => (
              // FIX: Yahan handleDelete pass kiya hai
              <TeamMemberCard
                key={member._id}
                member={member}
                index={idx}
                handleDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center gap-8 py-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-orange-500 disabled:opacity-20 transition-colors"
        >
          <ChevronLeft size={20} />
        </motion.button>
        <span className="text-sm font-medium text-white/40">
          Page {currentPage} / {totalPages}
        </span>
        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-orange-500 disabled:opacity-20 transition-colors"
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>
    </div>
  );
}

const TeamMemberCard = ({ member, index, handleDelete }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const color = "249, 115, 22";

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const background = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, rgba(${color}, 0.12), transparent 80%)`;
  const borderOverlay = useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, rgba(${color}, 0.4), transparent 80%)`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onMouseMove={handleMouseMove}
      className="group relative rounded-[2rem] p-[1px] overflow-hidden transition-all duration-500"
      style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
    >
      <motion.div
        className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
        style={{ background }}
      />
      <motion.div
        className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
        style={{ background: borderOverlay }}
      />

      <div className="relative z-10 h-full rounded-[2rem] bg-[#0a0a0a]/90 backdrop-blur-3xl p-6 border border-white/[0.05] flex flex-col gap-5 text-left">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-orange-600 to-orange-400 flex items-center justify-center text-black text-xl font-bold shadow-lg shadow-orange-500/20">
              {member.name?.charAt(0)}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-white truncate uppercase tracking-tight">
                {member.name}
              </h3>
              <div className="mt-1 flex items-center">
                <div
                  className={`px-3 py-0.5 rounded-full border flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${member.status === "busy" ? "bg-red-500/10 border-yellow-500/20 text-yellow-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"}`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full animate-pulse ${member.status === "busy" ? "bg-yellow-500" : "bg-emerald-500"}`}
                  />
                  {member.status || "Active"}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-2 relative z-20">
            <button className="p-2.5 bg-yellow-400/10 hover:scale-110 text-yellow-500 rounded-xl transition-all duration-300">
              <Edit3 size={18} />
            </button>
            <button
              onClick={() => handleDelete(member._id)}
              className="p-2.5 bg-red-400/10 hover:scale-110 text-red-500 rounded-xl transition-all duration-300"
            >
              <Trash size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
            <Zap size={12} className="text-orange-500" /> Stack & Expertise
          </p>
          <div className="flex flex-wrap gap-2">
            {member.skills?.map((skill, i) => (
              <span
                key={i}
                className={`px-3 py-1 border rounded-lg text-[10px] font-bold uppercase transition-all duration-300 ${tagColors[i % tagColors.length]}`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-white/[0.05] flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
              Contact
            </p>
            <div className="flex items-center gap-2 text-[12px] font-semibold text-white/80">
              <Phone size={12} className="text-orange-500/60" />{" "}
              {member.contact}
            </div>
          </div>
          <div className="text-right space-y-0.5">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
              Rate
            </p>
            <div className="text-xl font-medium text-white italic">
              ₹{member.payoutPerProject}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ViewTeam;
