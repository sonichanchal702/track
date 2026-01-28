import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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
    projectStatus: "active",
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
        projectStatus: p.projectStatus || "active",
        paymentStatus: p.paymentStatus || "pending",
      });
    } catch (err) {
      toast.error("Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  // 🔹 Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.patch(
        `${URL}/edit/project/${id}`,
        {
          ...form,
          deliverables: form.deliverables
            .split(",")
            .map((d) => d.trim())
            .filter(Boolean),
        },
        { withCredentials: true },
      );

      toast.success("Project updated successfully");
      navigate(-1);
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#020202]">
        <div className="w-10 h-10 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white p-6 lg:p-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 uppercase tracking-tight">
          Edit Project<span className="text-orange-500">.</span>
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white/[0.03] border border-white/10 rounded-3xl p-8"
        >
          {/* Project Name */}
          <Field
            label="Project Name"
            name="projectName"
            value={form.projectName}
            onChange={handleChange}
          />

          {/* Budgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field
              label="Client Budget"
              name="clientBudget"
              type="number"
              value={form.clientBudget}
              onChange={handleChange}
            />
            <Field
              label="Team Budget"
              name="teamBudget"
              type="number"
              value={form.teamBudget}
              onChange={handleChange}
            />
          </div>

          {/* Deadline */}
          <Field
            label="Deadline"
            name="deadline"
            type="date"
            value={form.deadline}
            onChange={handleChange}
          />

          {/* Description */}
          <Textarea
            label="Project Description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          {/* Deliverables */}
          <Textarea
            label="Deliverables (comma separated)"
            name="deliverables"
            value={form.deliverables}
            onChange={handleChange}
          />

          {/* Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Project Status"
              name="projectStatus"
              value={form.projectStatus}
              onChange={handleChange}
              options={["active", "completed", "paused"]}
            />
            <Select
              label="Payment Status"
              name="paymentStatus"
              value={form.paymentStatus}
              onChange={handleChange}
              options={["pending", "paid"]}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 rounded-xl border border-white/20 text-white/60 hover:text-white"
            >
              Cancel
            </button>
            <button
              disabled={saving}
              className="px-6 py-2 rounded-xl bg-orange-500 text-black font-semibold disabled:opacity-60"
            >
              {saving ? "Saving..." : "Update Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProject;

/* -------------------- SMALL COMPONENTS -------------------- */

const Field = ({ label, ...props }) => (
  <div>
    <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">
      {label}
    </label>
    <input
      {...props}
      className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">
      {label}
    </label>
    <textarea
      {...props}
      rows={4}
      className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500 resize-none"
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">
      {label}
    </label>
    <select
      {...props}
      className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);
