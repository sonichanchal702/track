import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  X,
  FolderPlus,
  IndianRupee,
  Calendar,
  FileText,
  LayoutGrid,
} from "lucide-react";
import { URL } from "../Constants.js";
import toast from "react-hot-toast";

function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    projectName: "",
    clientBudget: "",
    teamBudget: "",
    deadline: "",
    description: "",
    deliverables: "",
    projectStatus: "lead", // Aligned default with schema
    paymentStatus: "pending",
  });

  const fetchProject = async () => {
    try {
      const res = await axios.get(`${URL}/projects/${id}`, {
        withCredentials: true,
      });

      const p = res.data.project;

      setForm({
        projectName: p.projectName || "",
        clientBudget: p.clientBudget || "",
        teamBudget: p.teamBudget || "",
        deadline: p.deadline
          ? new Date(p.deadline).toISOString().slice(0, 10)
          : "",
        description: p.description || "",
        deliverables: p.deliverables?.join(", ") || "",
        projectStatus: p.projectStatus || "lead",
        paymentStatus: p.paymentStatus || "pending",
      });
    } catch (err) {
      toast.error("Failed to load project parameters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Aligning strict backend validations
    if (
      !form.projectName.trim() ||
      !form.clientBudget ||
      !form.deadline ||
      !form.description.trim()
    ) {
      return toast.error("Please fill all required configurations.");
    }

    const cleanDeliverables = form.deliverables
      ? form.deliverables
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean)
      : [];

    if (cleanDeliverables.length === 0) {
      return toast.error("At least one deliverable is required");
    }

    setSaving(true);

    try {
      await axios.patch(
        `${URL}/edit/project/${id}`,
        {
          ...form,
          clientBudget: Number(form.clientBudget),
          teamBudget: Number(form.teamBudget) || 0,
          deliverables: cleanDeliverables,
        },
        { withCredentials: true },
      );

      toast.success("Project updated successfully");
      navigate(-1);
    } catch (err) {
      console.error(err);
      const serverMessage =
        err.response?.data?.message || "Update compiled with errors";
      toast.error(serverMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#020202]">
        <div className="relative flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
          <Sparkles
            size={14}
            className="text-orange-500 absolute animate-pulse"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white p-6 lg:p-10 selection:bg-orange-500/30">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* HEADER */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-orange-500" />
            <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/40">
              Modifying Core Ledger
            </p>
          </div>
          <h1 className="text-4xl font-medium text-white tracking-tighter uppercase italic">
            Edit Project Parameters<span className="text-orange-500">.</span>
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/5 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-10 shadow-2xl"
        >
          {/* Project Name */}
          <Field
            label="Project Name *"
            name="projectName"
            value={form.projectName}
            onChange={handleChange}
            icon={<FolderPlus size={16} />}
            required
          />

          {/* Budgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field
              label="Client Budget (₹) *"
              name="clientBudget"
              type="number"
              value={form.clientBudget}
              onChange={handleChange}
              icon={<IndianRupee size={16} />}
              required
            />
            <Field
              label="Team Budget Payout (₹)"
              name="teamBudget"
              type="number"
              value={form.teamBudget}
              onChange={handleChange}
              icon={<LayoutGrid size={16} />}
            />
          </div>

          {/* Deadline */}
          <Field
            label="Target Deadline *"
            name="deadline"
            type="date"
            value={form.deadline}
            onChange={handleChange}
            icon={<Calendar size={16} />}
            required
          />

          {/* Description */}
          <Textarea
            label="Project Description / Brief *"
            name="description"
            value={form.description}
            onChange={handleChange}
            icon={<FileText size={18} />}
            required
          />

          {/* Deliverables */}
          <Textarea
            label="Deliverables * (Comma Separated)"
            name="deliverables"
            value={form.deliverables}
            onChange={handleChange}
            icon={<CheckCircle2 size={18} />}
            placeholder="e.g. Script, Video Editing, Subtitles"
            required
          />

          {/* Status Controllers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Project Status"
              name="projectStatus"
              value={form.projectStatus}
              onChange={handleChange}
              options={[
                { label: "Lead", value: "lead" },
                { label: "Active", value: "active" },
                { label: "Completed", value: "completed" },
                { label: "On Hold", value: "on_hold" },
              ]}
            />
            <Select
              label="Payment Status"
              name="paymentStatus"
              value={form.paymentStatus}
              onChange={handleChange}
              options={[
                { label: "Pending ", value: "pending" },
                { label: "Partial ", value: "partial" },
                { label: "Settled ", value: "completed" },
              ]}
            />
          </div>

          {/* System Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => navigate(-1)}
              className="px-8 py-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 text-white/70 hover:text-white font-medium text-xs uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              Cancel <X size={14} />
            </motion.button>

            <motion.button
              type="submit"
              whileHover={{
                scale: 1.01,
                boxShadow: "0 0 25px rgba(249,115,22,0.4)",
              }}
              whileTap={{ scale: 0.99 }}
              disabled={saving}
              className="px-10 py-4 bg-orange-500 text-black font-medium text-xs uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  Saving Changes...
                </div>
              ) : (
                <>
                  Update
                  <CheckCircle2 size={16} />
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------- RE-OPTIMIZED SUB-COMPONENTS -------------------- */

const Field = ({ label, icon, ...props }) => (
  <div className="space-y-2">
    <label className="block text-[11px] font-medium uppercase tracking-widest text-white/70 ml-2">
      {label}
    </label>
    <div className="relative group">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-orange-500 transition-colors duration-300">
          {icon}
        </div>
      )}
      <input
        {...props}
        className={`w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 pr-4 text-sm outline-none focus:border-orange-500/50 focus:bg-white/[0.04] transition-all duration-300 font-medium text-white/80 ${icon ? "pl-12" : "pl-5"}`}
      />
    </div>
  </div>
);

const Textarea = ({ label, icon, ...props }) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-medium uppercase tracking-widest text-white/70 ml-2">
      {label}
    </label>
    <div className="relative group">
      {icon && (
        <div className="absolute left-4 top-4 text-white/20 group-focus-within:text-orange-500 transition-colors duration-300">
          {icon}
        </div>
      )}
      <textarea
        {...props}
        rows={4}
        className={`w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 pr-4 text-sm outline-none focus:border-orange-500/50 focus:bg-white/[0.04] transition-all duration-300 text-white/80 resize-none shadow-inner ${icon ? "pl-12" : "pl-5"}`}
      />
    </div>
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-medium uppercase tracking-widest text-yellow-500 ml-2">
      {label}
    </label>
    <select
      {...props}
      className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl py-4 px-5 text-sm outline-none focus:border-orange-500/50 focus:bg-white/[0.04] transition-all duration-300 font-medium text-white/70 cursor-pointer"
    >
      {options.map((o) => (
        <option
          key={o.value}
          value={o.value}
          className="bg-[#0f0f0f] text-white"
        >
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

export default EditProject;
