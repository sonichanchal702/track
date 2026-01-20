import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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
        <div className="w-10 h-10 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="px-6 lg:px-8 py-8 space-y-10 selection:bg-orange-500/30 overflow-x-hidden">
      {/* TOP BAR */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium text-white/50 hover:text-orange-500 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-medium">
          ID · {project?._id.slice(-6)}
        </div>
      </div>

      {/* TITLE */}
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-500 rounded-2xl text-black shadow-orange-500/30">
            <Briefcase size={22} />
          </div>
          <h1 className="text-3xl lg:text-4xl font-semibold text-white tracking-tight">
            {project?.projectName}
            <span className="text-orange-500">.</span>
          </h1>
        </div>

        <div className="flex items-center gap-4 text-sm text-white/40 ml-16">
          <span>
            Created · {new Date(project?.createdAt).toLocaleDateString("en-GB")}
          </span>
          <span className="w-1 h-1 bg-white/20 rounded-full" />
          <span className="text-orange-400 capitalize">
            {project?.projectStatus}
          </span>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailCard
              label="Client Budget"
              value={`₹${project?.clientBudget.toLocaleString()}`}
              icon={<IndianRupee size={18} />}
              sub="Payment pending"
            />
            <DetailCard
              label="Deadline"
              value={new Date(project?.deadline).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
              icon={<Calendar size={18} />}
              sub="Estimated delivery"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 group relative overflow-hidden">
            <div className="absolute top-6 right-6 opacity-[0.04] group-hover:opacity-[0.09] transition-opacity">
              <FileText size={96} />
            </div>

            <h3 className="text-xs font-medium uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
              <ShieldCheck size={14} className="text-orange-500" />
              Project Brief
            </h3>

            <p className="text-base text-white/80 leading-relaxed max-w-3xl">
              {project?.description || "No description provided."}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {project?.deliverables.map((item, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-orange-400"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 space-y-6">
            <h3 className="text-xs font-medium uppercase tracking-widest text-white/40">
              Client
            </h3>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center text-black text-xl font-semibold">
                {project?.clientId?.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">
                  {project?.clientId?.name}
                </h4>
                <p className="text-xs text-white/40">Verified client</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <ContactItem
                icon={<Phone size={14} />}
                label="Phone"
                value={project?.clientId?.phone}
              />
              <ContactItem
                icon={<Hash size={14} />}
                label="Client ID"
                value={project?.clientId?._id.slice(0, 10)}
              />
              <ContactItem
                icon={<User size={14} />}
                label="Assigned To"
                value={project?.assignedTo?.name || "None"}
              />
            </div>

            <button className="w-full py-3 bg-white/5 hover:bg-orange-500 hover:text-black border border-white/10 rounded-2xl text-sm font-medium transition-all">
              Edit Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* HELPERS */

const DetailCard = ({ label, value, icon, sub }) => (
  <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl hover:bg-white/[0.04] transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-white/5 text-orange-500 rounded-xl">{icon}</div>
    </div>
    <p className="text-xs font-medium uppercase tracking-wide text-white/40">
      {label}
    </p>
    <h4 className="text-2xl font-semibold text-white mt-1">{value}</h4>
    <p className="text-xs text-white/30 mt-3">{sub}</p>
  </div>
);

const ContactItem = ({ icon, label, value }) => (
  <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
    <div className="flex items-center gap-3 text-white/40 text-xs">
      <span className="text-orange-500">{icon}</span>
      {label}
    </div>
    <span className="text-sm text-white/70">{value}</span>
  </div>
);

export default ViewProject;
