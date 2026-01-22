import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  IndianRupee,
  Calendar,
  User,
  Briefcase,
  ArrowLeft,
  ShieldCheck,
  FileText,
  Phone,
  Hash,
  BadgeCheck,
  Wallet,
  Link as LinkIcon,
  Sparkles,
  Globe,
} from "lucide-react";
import { URL } from "../Constants.js";

const ViewProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const res = await axios.get(`${URL}/projects/${id}`, {
          withCredentials: true,
        });
        setProject(res.data.project);
      } catch (err) {
        console.error("Project details error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [id]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#020202]">
        <div className="w-12 h-12 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="relative min-h-screen px-6 lg:px-12 py-10 space-y-12 overflow-hidden selection:bg-orange-500/30 text-[#e5e5e5]">
      {/* 🌌 AMBIENT BACKGROUND GLOWS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-orange-900/5 blur-[100px] rounded-full" />
      </div>

      {/* 🛠️ TOP NAVIGATION BAR */}
      <div className="relative z-10 flex items-center justify-between">
        <motion.button
          whileHover={{ x: -5 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white/50 hover:text-orange-500 transition-all backdrop-blur-md"
        >
          <ArrowLeft size={18} /> Back
        </motion.button>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-black font-black text-xs uppercase tracking-widest rounded-2xl shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-orange-500/60 transition-all"
          >
            <LinkIcon size={16} /> Create Links
          </motion.button>

          <div className="hidden md:block px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-orange-500 text-[10px] font-black tracking-[0.3em] uppercase">
            NODE · {project?._id.slice(-8)}
          </div>
        </div>
      </div>

      {/* 🏷️ HEADER SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 space-y-4"
      >
        <div className="flex items-center gap-5">
          <div className="p-4 bg-gradient-to-br from-orange-400 to-orange-600 rounded-[2rem] text-black shadow-2xl rotate-3">
            <Briefcase size={28} />
          </div>
          <div>
            <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase italic">
              {project?.projectName}
              <span className="text-orange-500">.</span>
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mt-2">
              <span className="flex items-center gap-2">
                <Sparkles size={12} className="text-orange-500" /> Created:{" "}
                {new Date(project?.createdAt).toLocaleDateString("en-GB")}
              </span>
              <span className="w-1.5 h-1.5 bg-white/10 rounded-full" />
              <span className="text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-lg bg-orange-500/5">
                {project?.projectStatus}
              </span>
              <span className="w-1.5 h-1.5 bg-white/10 rounded-full" />
              <span className="flex items-center gap-2">
                <Globe size={12} /> Payment: {project?.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 🧱 MAIN GRID */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT PANEL */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DetailCard
              label="Client Budget"
              value={`₹${project?.clientBudget.toLocaleString()}`}
              icon={<IndianRupee />}
            />
            <DetailCard
              label="Team Payout"
              value={`₹${project?.teamBudget.toLocaleString()}`}
              icon={<Wallet />}
            />
            <DetailCard
              label="Deadline"
              value={new Date(project?.deadline).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
              icon={<Calendar />}
            />
          </div>

          {/* GLASS BRIEF SECTION */}
          <motion.div
            whileHover={{ y: -5 }}
            className="group relative bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 overflow-hidden transition-all shadow-2xl"
          >
            <div className="absolute top-8 right-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
              <FileText size={160} />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-6 flex items-center gap-2">
              <ShieldCheck size={16} className="text-orange-500" /> Project
              Intel
            </h3>
            <p className="text-xl font-medium text-white/80 leading-relaxed italic max-w-3xl">
              "{project?.description}"
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              {project?.deliverables.map((item, i) => (
                <span
                  key={i}
                  className="px-5 py-2 bg-orange-500/5 border border-orange-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-orange-400"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-8">
          <GlassInfoCard title="Primary Client">
            <ProfileHeader
              name={project?.clientId?.name}
              subtitle="Verified Node"
            />
            <div className="space-y-4 pt-6">
              <ContactItem
                icon={<Phone size={14} />}
                label="Signal"
                value={project?.clientId?.phone}
              />
              <ContactItem
                icon={<Hash size={14} />}
                label="Registry ID"
                value={project?.clientId?._id.slice(0, 14)}
              />
            </div>
          </GlassInfoCard>

          {project?.assignedTo && (
            <GlassInfoCard title="Talent Assigned">
              <ProfileHeader
                name={project?.assignedTo?.name}
                subtitle={project?.assignedTo?.status}
                color="bg-orange-500"
              />
              <div className="space-y-3 pt-6">
                <ContactItem
                  icon={<Phone size={14} />}
                  label="Signal"
                  value={project?.assignedTo?.contact}
                />
                <ContactItem
                  icon={<BadgeCheck size={14} />}
                  label="Expertise"
                  value={project?.assignedTo?.skills.slice(0, 2).join(", ")}
                />
                <div className="mt-4 p-3 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center">
                  <span className="text-[9px] font-black uppercase text-white/20">
                    Final Payout
                  </span>
                  <span className="text-sm font-black text-orange-500 tracking-tighter italic">
                    ₹{project?.assignedTo?.payoutPerProject}
                  </span>
                </div>
              </div>
            </GlassInfoCard>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------------- PREMIUM GLASS COMPONENTS ---------------- */

const GlassInfoCard = ({ title, children }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-[#0a0a0a]/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-2xl relative overflow-hidden group"
  >
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-orange-500 transition-colors">
      {title}
    </h3>
    {children}
  </motion.div>
);

const ProfileHeader = ({ name, subtitle, color = "bg-orange-500" }) => (
  <div className="flex items-center gap-5">
    <div
      className={`w-16 h-16 rounded-[1.5rem] ${color} flex items-center justify-center text-black text-2xl font-black shadow-[0_10px_20px_rgba(0,0,0,0.3)]`}
    >
      {name?.charAt(0)}
    </div>
    <div>
      <h4 className="text-xl font-black text-white italic tracking-tight">
        {name}
      </h4>
      <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest">
        {subtitle}
      </p>
    </div>
  </div>
);

const DetailCard = ({ label, value, icon }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] group transition-all"
  >
    <div className="p-3.5 bg-orange-500/10 text-orange-500 rounded-2xl mb-5 w-fit group-hover:bg-orange-500 group-hover:text-black transition-all">
      {React.cloneElement(icon, { size: 22 })}
    </div>
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">
      {label}
    </p>
    <h4 className="text-3xl font-black text-white italic tracking-tighter tabular-nums">
      {value}
    </h4>
  </motion.div>
);

const ContactItem = ({ icon, label, value }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-white/[0.03] last:border-0">
    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/20">
      <span className="text-orange-500/60">{icon}</span>
      {label}
    </div>
    <span className="text-xs font-bold text-white/70 tracking-tight">
      {value}
    </span>
  </div>
);

export default ViewProject;
