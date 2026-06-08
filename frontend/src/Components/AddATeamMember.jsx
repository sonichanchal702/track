import React, { useState } from "react";
import axios from "axios";
import { URL } from "../Constants.js";
import {
  Plus,
  X,
  Loader2,
  Sparkles,
  UserPlus,
  Zap,
  Wallet,
  Phone,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const AddTeamMember = () => {
  const [form, setForm] = useState({
    name: "",
    contact: "",
    payoutPerProject: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...form,
        skills,
        payoutPerProject: Number(form.payoutPerProject),
      };

      await axios.post(`${URL}/add-new-member`, payload, {
        withCredentials: true,
      });

      toast.success("Team member added successfully");
      navigate("/dashboard/team");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add team member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center px-4 py-10 font-sans">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/10 blur-[120px] pointer-events-none" />

      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover="hover"
        whileTap={{ scale: 0.9, x: -10 }} // Click karne par piche push hoga
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white/40 overflow-hidden relative group self-center md:ml-[-480px] transition-all duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/10 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* ANIMATED ARROW */}
        <motion.div
          variants={{
            hover: { x: -5 }, // Hover par arrow piche move hoga
          }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <ArrowLeft
            size={18}
            className="group-hover:text-orange-500 transition-colors"
          />
        </motion.div>

        <span className="text-[10px] font-black uppercase tracking-[0.4em] group-hover:text-white transition-colors relative z-10">
          Back
        </span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-3xl shadow-2xl relative z-10"
      >
        <div className="mb-10 text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[12px] font-medium uppercase tracking-[0.3em] mb-2">
            <Sparkles size={12} /> Resource Entry
          </div>
          <h1 className="text-4xl font-bold tracking-tighter italic uppercase text-white">
            Onboard <span className="text-orange-500">Talent.</span>
          </h1>
          <p className="text-white/70 text-xs font-medium uppercase tracking-widest">
            Register new talent to the pool
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div className="space-y-2">
            <label className="text-[12px] font-medium uppercase tracking-widest text-white/70 flex items-center gap-2 px-1">
              <UserPlus size={12} className="text-orange-500" /> Full Identity
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ex. Gourav Thakur"
              className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/5 focus:border-orange-500/50 focus:bg-white/[0.08] outline-none transition-all font-medium text-sm placeholder:text-white/40"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[12px] font-medium uppercase tracking-widest text-white/70 flex items-center gap-2 px-1">
                <Phone size={12} className="text-orange-500" /> Connection
              </label>
              <input
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder="98765-XXXXX"
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/5 focus:border-orange-500/50 focus:bg-white/[0.08] outline-none transition-all font-medium text-sm placeholder:text-white/40"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-medium uppercase tracking-widest text-white/70 flex items-center gap-2 px-1">
                <Wallet size={12} className="text-orange-500" /> Payout (₹)
              </label>
              <input
                type="number"
                name="payoutPerProject"
                value={form.payoutPerProject}
                onChange={handleChange}
                placeholder="5000"
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/5 focus:border-orange-500/50 focus:bg-white/[0.08] outline-none transition-all font-medium text-sm placeholder:text-white/40"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[12px] font-medium uppercase tracking-widest text-white/70 flex items-center gap-2 px-1">
              <Zap size={12} className="text-orange-500" /> Expertise Stack
            </label>

            <div className="flex gap-3">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const val = skillInput.trim();
                    if (val && !skills.includes(val)) {
                      setSkills([...skills, val]);
                      setSkillInput("");
                    }
                  }
                }}
                placeholder="Add skill (e.g. React)"
                className="flex-1 px-5 py-4 rounded-2xl bg-white/5 border border-white/5 focus:border-orange-500/50 outline-none transition-all font-medium text-sm placeholder:text-white/40"
              />
              <button
                type="button"
                onClick={() => {
                  const val = skillInput.trim();
                  if (val && !skills.includes(val)) {
                    setSkills([...skills, val]);
                    setSkillInput("");
                  }
                }}
                className="px-6 rounded-2xl bg-orange-500 text-medium font-bold hover:bg-orange-400 transition-all active:scale-95 shadow-lg shadow-orange-500/20"
              >
                <Plus size={20} strokeWidth={3} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <AnimatePresence>
                {skills.map((skill) => (
                  <motion.span
                    key={skill}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center gap-2 px-4 py-2 text-[12px] font-bold uppercase tracking-wider rounded-xl bg-white/5 border border-white/10 text-orange-400 group"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() =>
                        setSkills(skills.filter((s) => s !== skill))
                      }
                      className="hover:text-white transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full py-5 mt-4 rounded-[1.5rem] bg-orange-500 text-white uppercase tracking-[0.1em] text-2xs hover:bg-orange-400 transition-all shadow-xl shadow-orange-500/10 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Initialize Onboarding"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddTeamMember;
