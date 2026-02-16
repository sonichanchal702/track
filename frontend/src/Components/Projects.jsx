import React, { useEffect, useState } from "react";
import axios from "axios";
import ShimmerProjects from "./ProjectsShimmer.jsx";
import { Link, useNavigate } from "react-router-dom";
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
  Plus,
  CalendarClock,
  SquarePen,
} from "lucide-react";
import { URL } from "../Constants.js";

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

  const filterDeadline = () => {
    const sorted = [...projects].sort((a, b) => {
      return new Date(a.deadline) - new Date(b.deadline);
    });
    setProjects(sorted);
  };

  const filteredProjects = projects.filter((proj) => {
    const matchesSearch =
      proj.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.clientId?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || proj.projectStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 md:p-6 lg:p-10 space-y-6 lg:space-y-10 font-sans selection:bg-orange-500/30">
      {/* HEADER SECTION */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        {/* LEFT: TITLE */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-2.5 rounded-2xl bg-orange-500/10 border border-orange-500/20 shadow-lg shadow-orange-500/10">
            <Briefcase size={24} className="text-orange-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold  text-white tracking-tighter uppercase flex flex-row italic leading-none items-center">
            Projects<span className="text-orange-500">.</span>
          </h1>
        </div>

        {/* RIGHT: CONTROLS */}
        <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-3 md:gap-4 w-full xl:w-auto">
          {/* SEARCH */}
          <div
            className="flex items-center min-h-[48px] gap-3 px-4 rounded-2xl
            bg-white/[0.03] border border-orange-500/60
            focus-within:border-orange-500/50
            transition-all w-full md:w-[280px]"
          >
            <Search size={18} className="text-orange-500 shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="bg-transparent outline-none text-sm text-white/80 w-full placeholder:text-white/30"
            />
          </div>

          <div className="grid grid-cols-2 md:flex items-center gap-3 w-full md:w-auto">
            {/* SORT */}
            <div className="relative group w-full md:w-auto">
              <div
                onClick={filterDeadline}
                className="flex items-center justify-center min-h-[48px] px-4
                rounded-2xl bg-white/[0.03] border border-orange-500/60 cursor-pointer hover:bg-white/[0.05] transition-colors"
              >
                <CalendarClock size={20} className="text-orange-500/80" />
              </div>
              <div
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                px-3 py-1.5 rounded-lg bg-medium text-white text-xs font-medium
                opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100
                transition-all duration-200 ease-out pointer-events-none whitespace-nowrap z-20"
              >
                Sort by deadline
              </div>
            </div>

            {/* FILTER */}
            <div
              className="flex items-center justify-center md:justify-start min-h-[48px] gap-2 px-4 rounded-2xl
              bg-white/[0.03] border border-orange-500/60 w-full md:w-auto"
            >
              <Filter size={18} className="text-orange-500/80 shrink-0" />
              <select
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent outline-none text-sm text-white/70 font-medium cursor-pointer w-full md:w-auto"
              >
                <option value="all" className="bg-[#0b0f14] text-white">
                  All
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

          {/* ADD PROJECT BUTTON */}
          <Link to="/dashboard/create-project" className="w-full md:w-auto">
            <button
              className="flex items-center justify-center gap-2 min-h-[48px] px-6 w-full md:w-auto
              rounded-2xl bg-orange-600 text-medium font-bold uppercase tracking-wide text-xs
              transition-transform duration-200 ease-out text-black
              hover:bg-orange-500 hover:scale-[1.02] active:scale-95 shadow-lg shadow-orange-500/20"
            >
              Add Project <Plus size={18} strokeWidth={3} />
            </button>
          </Link>
        </div>
      </div>

      {/* PROJECTS LIST */}
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

      {/* PAGINATION */}
      <div className="flex items-center justify-center gap-4 md:gap-8 pt-6 pb-8">
        <button
          disabled={pagination.page === 1}
          onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
          className="p-3 md:p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/50 hover:text-orange-500 disabled:opacity-20 transition-all active:scale-95"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[10px] md:text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-1">
            Page
          </span>
          <span className="text-sm md:text-base font-medium text-white">
            {pagination.page}
            <span className="text-white/30 mx-2">/</span>
            {pagination.totalPage}
          </span>
        </div>

        <button
          disabled={pagination.page === pagination.totalPage}
          onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
          className="p-3 md:p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/50 hover:text-orange-500 disabled:opacity-20 transition-all active:scale-95"
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
      400px circle at ${mouseX}px ${mouseY}px,
      rgba(249, 115, 22, 0.1),
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="group relative bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8 overflow-hidden shadow-2xl"
    >
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
        style={{ background }}
      />

      {/* --- SECTION 1: INFO --- */}
      <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0 z-10 w-full lg:w-auto">
        <div
          className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-500 bg-orange-500 text-medium shadow-lg shadow-orange-500/20 text-black`}
        >
          <Briefcase size={20} className="md:w-6 md:h-6" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-base md:text-lg font-bold text-white truncate tracking-tight group-hover:text-orange-500 transition-colors">
            {proj.projectName}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] md:text-xs font-medium text-white/50">
            <span className="flex items-center gap-1.5 text-orange-400 font-bold uppercase tracking-wider">
              <User size={10} strokeWidth={3} /> {proj.clientId?.name}
            </span>
            <span className="text-white/20">|</span>
            <span
              className={`px-2 py-0.5 rounded border uppercase text-[9px] font-bold tracking-wider ${
                proj.projectStatus === "active"
                  ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                  : "text-white/40 border-white/10 bg-white/5"
              }`}
            >
              {proj.projectStatus}
            </span>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: STATS --- */}
      <div className="grid grid-cols-2 md:flex md:flex-row items-start md:items-center gap-y-4 gap-x-8 lg:gap-12 flex-[2] z-10 w-full lg:w-auto border-t border-b border-white/5 lg:border-0 py-4 lg:py-0">
        <InfoItem label="Budget">
          <IndianRupee size={14} className="text-orange-500" />
          <span className="font-bold text-white text-sm md:text-base">
            {proj.clientBudget.toLocaleString()}
          </span>
        </InfoItem>

        <InfoItem label="Deadline">
          <Calendar size={14} className="text-orange-500" />
          <span className="font-bold text-white text-sm md:text-base">
            {new Date(proj.deadline).toLocaleDateString("en-GB")}
          </span>
        </InfoItem>

        <InfoItem label="Lead">
          <span className="font-bold text-white/70 text-sm md:text-base truncate max-w-[100px]">
            {proj.assignedTo?.name || "Pending"}
          </span>
        </InfoItem>
      </div>

      {/* --- SECTION 3: ACTIONS --- */}
      <div className="flex items-center gap-3 w-full lg:w-auto justify-end mt-2 lg:mt-0 z-10">
        <motion.button
          whileHover={{
            scale: 1.05,
            backgroundColor: "rgba(37, 99, 235, 0.2)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(`/dashboard/editProject/${proj._id}`)}
          className="p-3 md:p-3.5 bg-blue-500/10 rounded-xl border border-blue-500/30 text-blue-400 transition-all flex-1 lg:flex-none justify-center flex"
        >
          <SquarePen size={18} />
        </motion.button>
        <motion.button
          whileHover={{
            scale: 1.05,
            backgroundColor: "#f97316",
            color: "#000",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(`/dashboard/viewProject/${proj._id}`)}
          className="p-3 md:p-3.5 bg-orange-500/10 rounded-xl border border-orange-500/30 text-orange-500 transition-all flex-1 lg:flex-none justify-center flex"
        >
          <ArrowRight size={18} strokeWidth={3} />
        </motion.button>
      </div>
    </motion.div>
  );
};

const InfoItem = ({ label, children }) => (
  <div className="flex flex-col gap-1 min-w-fit">
    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
      {label}
    </p>
    <div className="flex items-center gap-2">{children}</div>
  </div>
);

export default Projects;
