import React, { useEffect, useState } from "react";
import axios from "axios";
import ShimmerProjects from "./ProjectsShimmer.jsx";
import { useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";
import {
  Search,
  Filter,
  Calendar,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
  User,
  Briefcase,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { URL } from "../Constants.js";
import ViewAProject from "./ViewAProject.jsx";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPage: 1 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchProjects = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`${URL}/projects?page=${page}&limit=10`, {
        withCredentials: true,
      });
      setProjects(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(pagination.page);
  }, [pagination.page]);

  const filteredProjects = projects.filter((proj) => {
    const matchesSearch =
      proj.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.clientId.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || proj.projectStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-10 space-y-10 font-sans selection:bg-orange-500/30">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Sparkles size={22} className="text-orange-500" />
          <h1 className="text-2xl lg:text-3xl font-semibold text-white tracking-tight">
            Projects<span className="text-orange-500">.</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-orange-500/60 focus-within:border-orange-500/50 transition-all">
            <Search size={16} className="text-orange-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects or clients"
              className="bg-transparent outline-none text-sm text-white/80 w-52 font-normal placeholder:text-white/30"
            />
          </div>

          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-orange-500/60">
            <Filter size={16} className="text-orange-500/80" />
            <select
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent outline-none text-sm text-white/70 font-medium cursor-pointer"
            >
              <option value="all" className="bg-[#0b0f14] text-white">
                All States
              </option>
              <option value="active" className="bg-[#0b0f14] text-white">
                Active
              </option>
              <option value="lead" className="bg-[#0b0f14] text-white">
                Lead
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4 min-h-[500px]">
        {loading ? (
          <ShimmerProjects />
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj, index) => (
              <ProjectCard key={proj._id} proj={proj} index={index} />
            ))}
          </AnimatePresence>
        )}
      </div>

      <div className="flex items-center justify-center gap-8 pt-6">
        <button
          disabled={pagination.page === 1}
          onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
          className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/50 hover:text-orange-500 disabled:opacity-20 transition-all"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[10px] font-medium text-white/30 uppercase tracking-widest mb-1">
            Page
          </span>
          <span className="text-sm font-medium text-white">
            {pagination.page}
            <span className="text-white/30 mx-1">/</span>
            {pagination.totalPage}
          </span>
        </div>

        <button
          disabled={pagination.page === pagination.totalPage}
          onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
          className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/50 hover:text-orange-500 disabled:opacity-20 transition-all"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

const ProjectCard = ({ proj, index }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const navigate = useNavigate();

  const background = useMotionTemplate`
    radial-gradient(
      350px circle at ${mouseX}px ${mouseY}px,
      rgba(249, 115, 22, 0.15),
      transparent 80%
    )
  `;

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0, transition: { delay: index * 0.05 } }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2rem] p-6 flex flex-col lg:flex-row items-center justify-between gap-8 overflow-hidden shadow-2xl"
    >
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
        style={{ background }}
      />

      {/* LEFT */}
      <div className="flex items-center gap-6 flex-1 min-w-0 z-10">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-500 ${
            proj.projectStatus === "active"
              ? "bg-orange-500 text-black shadow-orange-500/20"
              : "bg-white/5 text-white/40"
          }`}
        >
          <Briefcase size={22} />
        </div>

        <div className="truncate">
          <h3 className="text-base font-medium text-white truncate tracking-tight group-hover:text-orange-500 transition-colors">
            {proj.projectName}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-xs font-normal text-white/50">
            <User size={12} className="text-orange-500" />
            {proj.clientId.name}
            <span className="text-white/20">|</span>
            <span
              className={
                proj.projectStatus === "active" ? "text-green-500" : ""
              }
            >
              {proj.projectStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-row flex-wrap items-center justify-between lg:justify-start gap-10 lg:gap-16 flex-[2] z-10 w-full lg:w-auto">
        <InfoItem label="Budget">
          <IndianRupee size={14} className="text-orange-500" />
          <span className="font-semibold text-white">
            {proj.clientBudget.toLocaleString()}
          </span>
        </InfoItem>

        <InfoItem label="Deadline">
          <Calendar size={14} className="text-orange-500" />
          <span className="font-semibold text-white">
            {new Date(proj.deadline).toLocaleDateString("en-GB")}
          </span>
        </InfoItem>

        <InfoItem label="Lead">
          <span className="font-semibold text-white/70">
            {proj.assignedTo?.name || "Pending"}
          </span>
        </InfoItem>
      </div>

      <motion.button
        whileHover={{ x: 5, backgroundColor: "#f97316", color: "#000" }}
        onClick={() => navigate(`/dashboard/viewProject/${proj._id}`)}
        className="p-4 bg-white/5 rounded-2xl border border-white/10 text-white/40 transition-all z-10"
      >
        <ArrowRight size={20} />
      </motion.button>
    </motion.div>
  );
};

const InfoItem = ({ label, children }) => (
  <div className="flex flex-col gap-0.5 min-w-fit">
    <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wide">
      {label}
    </p>
    <div className="flex items-center gap-2 text-sm">{children}</div>
  </div>
);

export default Projects;
