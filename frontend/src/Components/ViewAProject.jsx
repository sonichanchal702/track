import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";
import {
  IndianRupee,
  Calendar,
  Briefcase,
  ArrowLeft,
  FileText,
  Phone,
  Hash,
  BadgeCheck,
  Wallet,
  Link as LinkIcon,
  Globe,
  UserPlus,
  X,
  Copy,
  Check,
  Sparkles,
  UserCircle,
} from "lucide-react";
import { URL } from "../Constants.js";
import toast from "react-hot-toast";

const ViewProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [links, setLinks] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals State
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Team Assignment State
  const [team, setTeam] = useState([]);
  const [fetchingTeam, setFetchingTeam] = useState(false);
  const [assigning, setAssigning] = useState(false);

  // 1. Core Fetch
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

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  // 2. Assignment Flow
  const onAssignFreelancer = async () => {
    setShowAssignModal(true);
    setFetchingTeam(true);
    try {
      const res = await axios.get(`${URL}/view-team`, {
        withCredentials: true,
      });
      setTeam(res.data.team || res.data.data);
    } catch (err) {
      toast.error("Network sync failed");
    } finally {
      setFetchingTeam(false);
    }
  };

  const handleAssign = async (freelancerId) => {
    setAssigning(true);
    try {
      await axios.post(
        `${URL}/projects/${id}/assign`,
        { freelancerId },
        { withCredentials: true },
      );
      toast.success("Professional Node Linked");
      setShowAssignModal(false);
      fetchProjectDetails();
    } catch (err) {
      toast.error("Assignment sequence failed");
    } finally {
      setAssigning(false);
    }
  };

  // 3. Link Flow
  const handleCreateLinks = async () => {
    try {
      setShowLinkModal(true);
      const res = await axios.post(
        `${URL}/projects/${id}/generate-links`,
        {},
        { withCredentials: true },
      );
      setLinks(res.data);
    } catch (error) {
      toast.error("Encryption failed");
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#020202]">
        <div className="w-12 h-12 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="relative h-[calc(100vh-32px)] px-6 lg:px-10 py-6 flex flex-col gap-6 overflow-hidden selection:bg-orange-500/30 text-[#e5e5e5] font-sans">
      {/* 🌌 AMBIENT GLOWS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-orange-900/5 blur-[100px] rounded-full" />
      </div>

      {/* 🛠️ TOP NAV */}
      <div className="relative z-10 flex items-center justify-between shrink-0">
        <motion.button
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium uppercase tracking-widest text-white/60 hover:text-orange-500 transition-all backdrop-blur-3xl"
        >
          <ArrowLeft size={18} /> Back
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateLinks}
          className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-black font-medium text-xs uppercase tracking-[0.2em] rounded-2xl shadow-[0_12px_30px_rgba(249,115,22,0.3)]"
        >
          <LinkIcon size={16} /> Create Links
        </motion.button>
      </div>

      {/* 🧱 MAIN GRID */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 flex flex-col gap-6 min-h-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6 shrink-0"
          >
            <div className="p-4 bg-gradient-to-br from-orange-400 to-orange-700 rounded-[1.8rem] text-black shadow-xl rotate-1 shrink-0">
              <Briefcase size={28} />
            </div>
            <div className="min-w-0">
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase flex flex-row italic leading-none items-center">
                {project?.projectName}
                <span className="text-orange-500">.</span>
              </h1>
              <div className="flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.3em] text-white/30 mt-2">
                <span className="text-orange-400">
                  ID · {project?._id.slice(-8)}
                </span>
                <span className="w-1 h-1 bg-white/10 rounded-full" />
                <span>{project?.projectStatus}</span>
                <span className="w-1 h-1 bg-white/10 rounded-full" />
                <span>Payment: {project?.paymentStatus}</span>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 shrink-0">
            <DetailCard
              label="Budget"
              value={`₹${project?.clientBudget.toLocaleString()}`}
              icon={<IndianRupee />}
              color="text-emerald-400"
              bgColor="bg-emerald-400/10"
            />
            <DetailCard
              label="Payout"
              value={`₹${project?.teamBudget.toLocaleString()}`}
              icon={<Wallet />}
              color="text-sky-400"
              bgColor="bg-sky-400/10"
            />
            <DetailCard
              label="Deadline"
              value={new Date(project?.deadline).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              })}
              icon={<Calendar />}
              color="text-orange-500"
              bgColor="bg-orange-500/10"
            />
          </div>

          {/* Intel */}
          <SpotlightCard className="group relative flex-1 min-h-0 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 overflow-hidden shadow-2xl flex flex-col">
            <FileText
              size={140}
              className="absolute top-4 right-4 opacity-[0.02]"
            />
            <h3 className="text-[12px] font-medium  uppercase text-white/30 mb-4 border-l-2 border-orange-500 pl-4 shrink-0">
              Project Description
            </h3>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <p className="text-xl font-medium text-white/80 leading-relaxed  font-sans">
                "{project?.description}"
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 shrink-0">
              {project?.deliverables.map((item, i) => (
                <span
                  key={i}
                  className="px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-xl text-[12px] font-medium uppercase tracking-widest text-orange-400"
                >
                  {item}
                </span>
              ))}
            </div>
          </SpotlightCard>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6 min-h-0">
          <GlassInfoCard title="Client" className="flex-1  font-medium">
            <ProfileHeader name={project?.clientId?.name} />
            <div className="space-y-3 pt-6 overflow-y-auto">
              <ContactItem
                icon={<Phone size={12} />}
                label="Phone"
                value={project?.clientId?.phone}
              />
              <ContactItem
                icon={<Globe size={12} />}
                label="Email"
                value={project?.clientId?.email}
              />
            </div>
          </GlassInfoCard>

          <GlassInfoCard
            title="Talent Assigned"
            className="flex-1 border-t-orange-500/20"
          >
            {project?.assignedTo ? (
              <>
                <ProfileHeader
                  name={project?.assignedTo?.name}
                  subtitle={project?.assignedTo?.status}
                  color="bg-orange-500"
                />
                <div className="space-y-3 pt-6 overflow-y-auto">
                  <ContactItem
                    icon={<Phone size={12} />}
                    label="Phone"
                    value={project?.assignedTo?.contact}
                  />
                </div>
              </>
            ) : (
              <button
                onClick={onAssignFreelancer}
                className="group relative w-full h-full flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.02] hover:bg-orange-500/5 hover:border-orange-500/40 transition-all duration-500 overflow-hidden"
              >
                <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-orange-500 group-hover:text-black transition-all shadow-xl">
                  <UserPlus size={24} />
                </div>
                <p className="text-[12px] font-medium uppercase tracking-[0.3em] text-white/20 group-hover:text-white transition-colors">
                  Awaiting Talent
                </p>
              </button>
            )}
          </GlassInfoCard>
        </div>
      </div>

      {/* 🚀 MODAL 1: LINK GENERATOR */}
      <AnimatePresence>
        {showLinkModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLinkModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-[#080808] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                  <h2 className="text-2xl font-medium italic tracking-tighter text-white uppercase">
                    Secure Access<span className="text-orange-500">.</span>
                  </h2>
                  <p className="text-[9px] font-medium uppercase tracking-widest text-white/20">
                    End-to-End Encrypted Node Links
                  </p>
                </div>
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="p-2 hover:bg-white/5 rounded-xl text-white/20"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-6">
                <LinkField
                  label="Client Access Node"
                  url={
                    links
                      ? `${window.location.origin}/client/${links.clientToken}`
                      : "GENERATING..."
                  }
                />
                <LinkField
                  label="Professional Access Node"
                  url={
                    links
                      ? `${window.location.origin}/talent/${links.freelancerToken}`
                      : "GENERATING..."
                  }
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🚀 MODAL 2: TALENT ASSIGNMENT */}
      <AnimatePresence>
        {showAssignModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !assigning && setShowAssignModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-[#080808] border border-white/10 rounded-[2.5rem] flex flex-col max-h-[80vh] overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 bg-white/[0.01]">
                <h2 className="text-2xl font-medium italic uppercase tracking-tighter">
                  Assign Professional<span className="text-orange-500">.</span>
                </h2>
                <p className="text-[12px] font-medium text-white/20 uppercase tracking-[0.2em]">
                  Deploying Node to Talent Network
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {fetchingTeam ? (
                  <div className="py-20 flex flex-col items-center opacity-20 animate-pulse">
                    <UserCircle size={48} />
                    <p className="text-[12px] font-medium mt-4 uppercase">
                      Syncing Registry...
                    </p>
                  </div>
                ) : (
                  team.map((member) => (
                    <div
                      key={member._id}
                      className="group flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/30 font-medium text-xl group-hover:bg-orange-500 group-hover:text-black transition-all shadow-inner">
                          {member.name.charAt(0)}
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-medium uppercase italic tracking-tight">
                            {member.name}{" "}
                            <span
                              className={`w-1.5 h-1.5 rounded-full inline-block ml-2 ${member.status === "busy" ? "bg-red-500" : "bg-green-500 animate-pulse"}`}
                            />
                          </h4>
                          <p className="text-[9px] font-medium text-white/20 uppercase tracking-widest">
                            {member.skills.join(" // ")}
                          </p>
                        </div>
                      </div>
                      <button
                        disabled={assigning}
                        onClick={() => handleAssign(member._id)}
                        className="px-6 py-2.5 bg-white/5 hover:bg-orange-500 hover:text-black rounded-xl text-[12px] font-medium uppercase tracking-widest transition-all"
                      >
                        SELECT
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ---------------- HELPER COMPONENTS ---------------- */

const LinkField = ({ label, url }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Node Linked to Clipboard");
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="space-y-3 group">
      <label className="text-[12px] font-medium uppercase tracking-[0.2em] text-white/20 ml-2 group-hover:text-orange-500 transition-colors">
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          readOnly
          value={url}
          className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 text-[12px] font-medium text-white/40 outline-none truncate"
        />
        <button
          onClick={handleCopy}
          className={`absolute right-2 p-2.5 rounded-xl transition-all ${copied ? "bg-green-500 text-black shadow-lg shadow-green-500/20" : "bg-white/5 text-white/40 hover:bg-orange-500 hover:text-black"}`}
        >
          {copied ? <Check size={16} strokeWidth={4} /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
};

const SpotlightCard = ({ children, className }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
  return (
    <motion.div
      onMouseMove={handleMouseMove}
      className={className}
      whileHover={{ y: -4 }}
    >
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(249,115,22,0.08), transparent 80%)`,
        }}
      />
      {children}
    </motion.div>
  );
};

const GlassInfoCard = ({ title, children, className }) => (
  <SpotlightCard
    className={`bg-[#050505]/60 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 flex flex-col shadow-2xl group ${className}`}
  >
    <h3 className="text-[12px] font-medium tracking-[0.4em]  mb-6 text-orange-500 transition-colors uppercase">
      {title}
    </h3>
    {children}
  </SpotlightCard>
);

const DetailCard = ({ label, value, icon, color, bgColor }) => (
  <motion.div
    whileHover={{ y: -6 }}
    className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-6 rounded-[2rem] shadow-xl relative overflow-hidden group"
  >
    <div
      className={`p-3 ${bgColor} ${color} rounded-xl mb-4 w-fit group-hover:rotate-6 transition-transform`}
    >
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <p className="text-[12px] font-medium uppercase  text-white/20 mb-1">
      {label}
    </p>
    <h4 className="text-xl font-medium text-white italic tracking-tighter truncate uppercase">
      {value}
    </h4>
  </motion.div>
);

const ProfileHeader = ({ name, subtitle, color = "bg-orange-500" }) => (
  <div className="flex items-center gap-5 shrink-0">
    <div
      className={`w-16 h-16 rounded-[1.2rem] ${color} flex items-center justify-center text-black text-2xl font-medium shadow-lg shrink-0`}
    >
      {name?.charAt(0)}
    </div>
    <div className="min-w-0">
      <h4 className="text-xl font-medium text-white italic tracking-tighter  uppercase leading-tight">
        {name}
      </h4>
      <p className="text-[12px] font-medium text-orange-500 uppercase tracking-widest opacity-80">
        {subtitle}
      </p>
    </div>
  </div>
);

const ContactItem = ({ icon, label, value }) => (
  <div className="flex items-center justify-between py-3 border-b border-white/[0.03] last:border-0 group/item">
    <div className="flex items-center gap-3 text-[12px] font-medium uppercase tracking-widest text-orange-500 transition-colors">
      <span className="text-orange-500/60">{icon}</span> {label}
    </div>
    <span className="text-[13px] font-medium text-white/80 truncate ml-4 group-hover/item:text-white transition-colors">
      {value || "N/A"}
    </span>
  </div>
);

export default ViewProject;
