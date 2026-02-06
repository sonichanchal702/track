import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "../Constants.js";
import {
  Plus,
  X,
  Loader2,
  Sparkles,
  Edit3,
  Zap,
  Wallet,
  Phone,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const EditTeamMember = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    contact: "",
    payoutPerProject: "",
  });
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${URL}/team/${memberId}`, {
          withCredentials: true,
        });
        const member = res.data.team;
        if (member) {
          setForm({
            name: member.name || "",
            contact: member.contact || "",
            payoutPerProject: member.payoutPerProject || "",
          });
          setSkills(member.skills || []);
        }
        setLoading(false);
      } catch (err) {
        toast.error("Could not find team member");
        navigate("/dashboard/team");
      }
    };
    if (memberId) fetchMember();
  }, [memberId, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.contact ||
      !form.payoutPerProject ||
      skills.length === 0
    ) {
      toast.error("Fields cannot be empty");
      return;
    }

    try {
      setUpdating(true);
      const payload = {
        ...form,
        skills,
        payoutPerProject: Number(form.payoutPerProject),
      };
      await axios.patch(`${URL}/edit-team/${memberId}`, payload, {
        withCredentials: true,
      });
      toast.success("Identity Modified Successfully");
      navigate("/dashboard/team");
    } catch (err) {
      toast.error(err.response?.data?.message || "Modification Failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#020202]">
        <Loader2 className="animate-spin text-orange-500 mb-2" size={32} />
        <p className="text-orange-500 font-medium tracking-widest text-[14px] uppercase italic">
          Syncing...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center px-4 py-6 font-sans">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-orange-500/10 blur-[100px] pointer-events-none" />

      {/* COMPACT BACK BUTTON */}
      <motion.button
        whileHover={{ x: -5, color: "#f97316" }}
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2 text-white/40 self-center md:ml-[-400px] transition-all"
      >
        <ArrowLeft size={16} />
        <span className="text-[12px] font-medium uppercase tracking-[0.2em]">
          Cancel
        </span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-white/[0.02] border border-white/10 rounded-[2rem] p-8 backdrop-blur-3xl shadow-2xl relative z-10"
      >
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[12px] font-medium uppercase tracking-[0.2em] mb-3">
            <Edit3 size={12} /> Edit Mode
          </div>
          <h1 className="text-3xl font-medium tracking-tighter italic uppercase text-white leading-none">
            Update <span className="text-orange-500">Node.</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium uppercase tracking-widest text-white/30 px-1">
              Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 focus:border-orange-500/50 outline-none transition-all font-medium text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium uppercase tracking-widest text-white/30 px-1 flex items-center gap-1.5">
                <Phone size={10} /> Contact
              </label>
              <input
                name="contact"
                value={form.contact}
                onChange={handleChange}
                className="w-full text-[12px] px-4 py-3 rounded-xl bg-white/5 border border-white/5 focus:border-orange-500/50 outline-none transition-all font-medium text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium uppercase tracking-widest text-white/30 px-1 flex items-center gap-1.5">
                <Wallet size={10} /> Payout
              </label>
              <input
                type="number"
                name="payoutPerProject"
                value={form.payoutPerProject}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 focus:border-orange-500/50 outline-none transition-all font-medium text-xs"
              />
            </div>
          </div>

          {/* SKILLS - Compact input and tags */}
          <div className="space-y-3">
            <label className="text-[12px] font-medium uppercase tracking-widest text-white/30 px-1 flex items-center gap-1.5">
              <Zap size={10} /> Skills
            </label>
            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (
                      skillInput.trim() &&
                      !skills.includes(skillInput.trim())
                    ) {
                      setSkills([...skills, skillInput.trim()]);
                      setSkillInput("");
                    }
                  }
                }}
                placeholder="Add skill..."
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/5 focus:border-orange-500/50 outline-none transition-all text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  if (
                    skillInput.trim() &&
                    !skills.includes(skillInput.trim())
                  ) {
                    setSkills([...skills, skillInput.trim()]);
                    setSkillInput("");
                  }
                }}
                className="px-5 rounded-xl bg-orange-500 text-black font-medium transition-all active:scale-95"
              >
                <Plus size={18} strokeWidth={3} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <AnimatePresence>
                {skills.map((skill) => (
                  <motion.span
                    key={skill}
                    layout
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="flex items-center gap-2 px-3 py-1.5 text-[12px] font-medium uppercase tracking-widest rounded-lg bg-white/5 border border-white/10 text-orange-400 group"
                  >
                    {skill}
                    <X
                      size={12}
                      className="cursor-pointer hover:text-white transition-colors"
                      onClick={() =>
                        setSkills(skills.filter((s) => s !== skill))
                      }
                    />
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <button
            disabled={updating}
            className="w-full py-4 mt-2 rounded-2xl bg-orange-500 text-black font-medium uppercase tracking-[0.2em] text-[14px] hover:bg-orange-400 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {updating ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              "Apply Changes"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default EditTeamMember;
