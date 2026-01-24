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
  Briefcase,
  Phone,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
  BadgeCheck,
  Zap,
  UserRoundPlus,
  User,
  Edit3,
} from "lucide-react";

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
      <div className="space-y-1 flex flex-row w-full justify-between">
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase flex flex-row italic leading-none">
          <Sparkles
            size={24}
            className="text-orange-500 position-relative top-[2px]"
          />
          Talent Pool<span className="text-orange-500">.</span>
        </h1>
        <button className="flex items-center gap-2 px-5 py-3 bg-orange-500 hover:bg-orange-600 text-black text-sm font-semibold rounded-xl shadow-lg transition-all duration-200 active:scale-95">
          <UserRoundPlus size={18} />
          Add Team Member
        </button>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {currentItems.map((member, idx) => (
              <TeamMemberCard key={member._id} member={member} index={idx} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center gap-8 py-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-orange-500 disabled:opacity-20"
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
          className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-orange-500 disabled:opacity-20"
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>
    </div>
  );
}

const TeamMemberCard = ({ member, index }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const background = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, rgba(249, 115, 22, 0.12), transparent 80%)`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -5 }}
      className="group relative bg-[#050505]/60 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-6 shadow-2xl flex flex-col gap-5"
    >
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100"
        style={{ background }}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-orange-600 to-orange-400 flex items-center justify-center text-black text-xl font-semibold shadow-lg">
            {member.name?.charAt(0)}
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">
              {member.name}
            </h3>

            <div className="mt-2 flex items-center">
              <div
                className={`px-3 py-1 rounded-full border flex items-center gap-2 text-xs font-medium ${
                  member.status === "busy"
                    ? "bg-red-500/10 border-red-500/20 text-red-400"
                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    member.status === "busy" ? "bg-red-500" : "bg-emerald-500"
                  }`}
                />
                {member.status || "Active"}
              </div>
            </div>
          </div>
        </div>

        <button className="p-2 bg-white/5 hover:bg-orange-500 hover:text-black text-white/40 rounded-xl transition">
          <Edit3 size={16} />
        </button>
      </div>

      <div className="relative z-10 space-y-2">
        <p className="text-xs font-medium text-white/30 flex items-center gap-2">
          <Zap size={12} className="text-orange-500/40" /> Skills
        </p>
        <div className="flex flex-wrap gap-2">
          {member.skills?.map((skill, i) => (
            <span
              key={i}
              className={`px-3 py-1 border rounded-lg text-xs font-medium ${tagColors[i % tagColors.length]}`}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-auto pt-4 border-t border-white/[0.03] flex items-center justify-between">
        <div>
          <p className="text-xs text-white/30">Contact</p>
          <div className="flex items-center gap-2 text-sm font-medium text-white/80">
            <Phone size={12} className="text-orange-500/60" /> {member.contact}
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-white/30">Payout</p>
          <div className="text-lg font-semibold text-white">
            ₹{member.payoutPerProject}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ViewTeam;
