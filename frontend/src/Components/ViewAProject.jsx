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
  Globe,
  UserPlus,
  X,
  Copy,
  Check,
  Sparkles,
  UserCircle,
  Link as LinkIcon,
  Wallet,
  History,
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

  // 1. Fetch Project Details
  const fetchProjectDetails = async () => {
    try {
      const res = await axios.get(`${URL}/projects/${id}`, {
        withCredentials: true,
      });
      setProject(res.data.project);
    } catch (err) {
      console.error("Project details error:", err);
      toast.error("Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const onAssignFreelancer = async () => {
    setShowAssignModal(true);
    setFetchingTeam(true);
    try {
      const res = await axios.get(`${URL}/team`, {
        withCredentials: true,
      });
      setTeam(res.data.team || res.data.data || []);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setFetchingTeam(false);
    }
  };

  const handleAssign = async (freelancerId) => {
    setAssigning(true);
    try {
      // Backend expects 'teamId' in body according to your controller
      await axios.patch(
        `${URL}/projects/${id}/assign-team`,
        { teamId: freelancerId }, // 👈 FreelancerId ko teamId key mein bhejo
        { withCredentials: true },
      );

      toast.success("Team assigned to project.");
      setShowAssignModal(false);
      fetchProjectDetails(); // Refresh project to show newly assigned member
    } catch (err) {
      // Backend se error message uthao
      const errMsg = err.response?.data || "Assignment sequence failed";
      toast.error(errMsg);
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
    <div className="relative min-h-screen px-6 lg:px-10 py-6 flex flex-col gap-6 overflow-x-hidden selection:bg-orange-500/30 text-[#e5e5e5] font-sans bg-[#020202]">
      {/* 🌌 AMBIENT GLOWS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-orange-900/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <motion.button
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium uppercase tracking-widest text-white/60 hover:text-orange-500 transition-all backdrop-blur-3xl w-fit"
        >
          <ArrowLeft size={18} /> Back
        </motion.button>

        {/* TOP RIGHT ACTION BUTTONS */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* VIEW TIMELINE BUTTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/dashboard/projects/${id}/timeline`)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 text-white/70 hover:text-orange-500 hover:border-orange-500/30 rounded-2xl text-xs uppercase tracking-[0.2em] transition-all font-bold"
          >
            <History size={16} />{" "}
            <span className="hidden sm:inline">View Timeline</span>{" "}
            <span className="sm:hidden">Timeline</span>
          </motion.button>

          {/* CREATE LINKS BUTTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateLinks}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-orange-500 text-black font-medium text-xs uppercase tracking-[0.2em] rounded-2xl shadow-[0_12px_30px_rgba(249,115,22,0.3)]"
          >
            <LinkIcon size={16} />{" "}
            <span className="hidden sm:inline">Create Links</span>{" "}
            <span className="sm:hidden">Links</span>
          </motion.button>
        </div>
      </div>

      {/* HEADER SECTION */}
      <div className="relative z-10 flex items-center justify-between gap-6 shrink-0 ">
        <div className="flex items-center gap-6 min-w-0">
          <div className="p-4 bg-gradient-to-br from-orange-400 to-orange-700 rounded-[1.8rem] text-black shadow-xl rotate-1 shrink-0">
            <Briefcase size={28} />
          </div>

          <div className="min-w-0">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic truncate">
              {project?.projectName}
              <span className="text-orange-500">.</span>
            </h1>

            <div className="flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.3em] text-white/30 mt-2">
              <span className="bg-green-500/10 px-2 py-0.5 rounded-2xl border border-green-500 text-green-500">
                {project?.projectStatus}
              </span>
              <span className="w-1 h-1 bg-white/10 rounded-full" />
              <span className="bg-yellow-500/10 px-2 py-0.5 rounded-2xl border border-yellow-500 text-yellow-500">
                Payment: {project?.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 pb-10">
        <div className="lg:col-span-2 flex flex-col gap-6 min-h-0">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
            <DetailCard
              label="Valuation"
              value={`₹${project?.clientBudget?.toLocaleString()}`}
              icon={<IndianRupee />}
              color="text-emerald-400"
              bgColor="bg-emerald-400/10"
            />
            <DetailCard
              label="Allocation"
              value={`₹${project?.teamBudget?.toLocaleString()}`}
              icon={<Wallet />}
              color="text-sky-400"
              bgColor="bg-sky-400/10"
            />
            <DetailCard
              label="Deadline"
              value={
                project?.deadline
                  ? new Date(project.deadline).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"
              }
              icon={<Calendar />}
              color="text-orange-500"
              bgColor="bg-orange-500/10"
            />
          </div>

          {/* Intel Box */}
          <SpotlightCard className="group relative flex-1 min-h-[300px] bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 overflow-hidden shadow-2xl flex flex-col">
            <FileText
              size={140}
              className="absolute top-4 right-4 opacity-[0.02] text-orange-500"
            />
            <h3 className="text-[12px] font-bold uppercase tracking-[0.4em] text-orange-500 mb-6 border-l-2 border-orange-500 pl-4 shrink-0">
              Technical Description
            </h3>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <p className="text-xl font-medium text-white/80 leading-relaxed italic">
                "
                {project?.description ||
                  "No description provided for this node."}
                "
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-2 shrink-0 border-t border-white/5 pt-6">
              {project?.deliverables?.map((item, i) => (
                <span
                  key={i}
                  className="px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-orange-400"
                >
                  {item}
                </span>
              ))}
            </div>
          </SpotlightCard>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6 min-h-0">
          <GlassInfoCard title="Primary Client" className="flex-1">
            <ProfileHeader name={project?.clientId?.name || "Client Name"} />
            <div className="space-y-1 pt-6 overflow-y-auto">
              <ContactItem
                icon={<Phone size={18} />}
                label="Phone "
                value={project?.clientId?.phone}
              />
              <ContactItem
                icon={<Globe size={18} />}
                label="Email"
                value={project?.clientId?.email}
              />
            </div>
          </GlassInfoCard>

          <GlassInfoCard
            title="Assigned Talent"
            className={`flex-1 ${!project?.assignedTo && "border-t-orange-500/30"}`}
          >
            {project?.assignedTo ? (
              <>
                <ProfileHeader
                  name={project?.assignedTo?.name}
                  subtitle={project?.assignedTo?.status || "Active"}
                  color="bg-orange-500"
                />
                <div className="space-y-1 pt-6 overflow-y-auto">
                  <ContactItem
                    icon={<Phone size={18} />}
                    label="Phone"
                    value={project?.assignedTo?.contact}
                  />
                  <div className="pt-4 flex flex-wrap gap-1.5">
                    {project?.assignedTo?.skills?.slice(0, 3).map((s, i) => (
                      <span
                        key={i}
                        className="text-[9px] border border-cyan-500/50 font-bold text-cyan-500 uppercase tracking-widest bg-cyan-500/10 px-2 py-1 rounded-2xl"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <button
                onClick={onAssignFreelancer}
                className="group relative w-full h-full min-h-[160px] flex flex-col items-center justify-center gap-4 rounded-[2rem] border-2 border-dashed border-white/5 bg-white/[0.01] hover:bg-orange-500/5 hover:border-orange-500/40 transition-all duration-500 overflow-hidden"
              >
                <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-orange-500 group-hover:text-black transition-all shadow-xl scale-110">
                  <UserPlus size={24} />
                </div>
                <div className="text-center">
                  <p className="text-[12px] font-medium uppercase tracking-[0.3em] text-white/20 group-hover:text-white transition-colors">
                    Awaiting Talent
                  </p>
                  <p className="text-[9px] font-bold text-white/10 uppercase mt-1">
                    Deploy Node to Network
                  </p>
                </div>
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
                  <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase">
                    Secure Access<span className="text-orange-500">.</span>
                  </h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">
                    End-to-End Encrypted Node Links
                  </p>
                </div>
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="p-2 hover:bg-white/5 rounded-xl text-white/20 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-6">
                <LinkField
                  label="Client Access Link"
                  url={
                    links
                      ? `${window.location.origin}/user/client/project/${links.clientToken}/feedback`
                      : "Generating Link..."
                  }
                />
                <LinkField
                  label="Team Access Link"
                  url={
                    links
                      ? `${window.location.origin}/user/talent/project/${links.freelancerToken}/update`
                      : "Generating Link..."
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
                <h2 className="text-2xl font-black italic uppercase tracking-tighter">
                  Assign Professional<span className="text-orange-500">.</span>
                </h2>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
                  Deploying Node to Talent Network
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                {fetchingTeam ? (
                  <div className="py-20 flex flex-col items-center opacity-20 animate-pulse">
                    <UserCircle size={48} />
                    <p className="text-[10px] font-bold mt-4 uppercase tracking-[0.3em]">
                      Syncing Registry...
                    </p>
                  </div>
                ) : team.length === 0 ? (
                  <div className="py-20 text-center opacity-40">
                    <p className="text-xs uppercase tracking-widest">
                      No Professionals Found
                    </p>
                  </div>
                ) : (
                  team.map((member) => (
                    <div
                      key={member._id}
                      className="group flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all hover:border-orange-500/30"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/20 font-black text-xl group-hover:bg-orange-500 group-hover:text-black transition-all shadow-inner">
                          {member.name?.charAt(0)}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold uppercase italic tracking-tight flex items-center gap-2">
                            {member.name}
                            <span
                              className={`w-2 h-2 rounded-full ${member.status === "busy" ? "bg-red-500" : "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"}`}
                            />
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {member.skills?.map((s, i) => (
                              <span
                                key={i}
                                className="text-[8px] font-black text-white/20 uppercase tracking-widest border border-white/5 px-1.5 rounded"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button
                        disabled={assigning}
                        onClick={() => handleAssign(member._id)}
                        className="px-6 py-2.5 bg-white/5 hover:bg-orange-500 hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-30"
                      >
                        {assigning ? "DEPLOYNIG..." : "SELECT"}
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
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 ml-2 group-hover:text-orange-500 transition-colors">
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          readOnly
          value={url}
          className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 text-[13px] font-bold text-white/80 outline-none truncate pr-14"
        />
        <button
          onClick={handleCopy}
          className={`absolute right-2 p-2.5 rounded-[1.1rem] transition-all ${copied ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" : "bg-white/5 text-white/40 hover:bg-orange-500 hover:text-black"}`}
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
    <h3 className="text-[10px] font-black tracking-[0.4em] mb-6 text-orange-500 transition-colors uppercase">
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
      {React.cloneElement(icon, { size: 20, strokeWidth: 2.5 })}
    </div>
    <p className="text-[10px] font-black uppercase text-white/20 mb-1 tracking-widest">
      {label}
    </p>
    <h4 className="text-xl font-bold text-white italic tracking-tighter truncate uppercase">
      {value || "₹0"}
    </h4>
  </motion.div>
);

const ProfileHeader = ({ name, subtitle, color = "bg-orange-500" }) => (
  <div className="flex items-center gap-5 shrink-0">
    <div
      className={`w-14 h-14 rounded-[1.2rem] ${color} flex items-center justify-center text-black text-2xl font-black shadow-lg shrink-0`}
    >
      {name?.charAt(0)}
    </div>
    <div className="min-w-0">
      <h4 className="text-lg font-bold text-white italic tracking-tighter uppercase leading-tight truncate">
        {name}
      </h4>
      {subtitle && (
        <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest opacity-80 mt-0.5">
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

const ContactItem = ({ icon, label, value }) => (
  <div className="flex items-center justify-between py-3 border-b border-white/[0.03] last:border-0 group/item">
    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-orange-500/60 transition-colors group-hover/item:text-orange-500">
      {icon} {label}
    </div>
    <span className="text-[12px] font-bold text-white/60 truncate ml-4 group-hover/item:text-white transition-colors">
      {value || "Not Linked"}
    </span>
  </div>
);

export default ViewProject;
