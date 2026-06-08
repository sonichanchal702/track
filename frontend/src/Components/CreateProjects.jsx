import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderPlus,
  User,
  Phone,
  Mail,
  IndianRupee,
  Calendar,
  FileText,
  CheckCircle2,
  LayoutGrid,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { URL } from "../Constants.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    projectName: "",
    clientName: "",
    phone: "",
    email: "",
    clientBudget: "",
    teamBudget: "",
    description: "",
    deadline: "",
    paymentStatus: "pending",
    deliverables: "",
    projectStatus: "lead",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend Validations aligning with backend controllers
    if (
      !formData.projectName.trim() ||
      !formData.clientName.trim() ||
      !formData.phone.trim() ||
      !formData.clientBudget ||
      !formData.deadline ||
      !formData.description.trim()
    ) {
      return toast.error("Please fill all required fields correctly.");
    }

    // Process deliverables safety check
    const cleanDeliverables = formData.deliverables
      ? formData.deliverables
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    if (cleanDeliverables.length === 0) {
      return toast.error("At least one deliverable is required");
    }

    setLoading(true);
    try {
      const finalData = {
        ...formData,
        clientBudget: Number(formData.clientBudget),
        teamBudget: Number(formData.teamBudget) || 0,
        deliverables: cleanDeliverables,
      };

      const res = await axios.post(`${URL}/createProject`, finalData, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Project created successfully 🚀");
        navigate("/dashboard/projects");
      }
    } catch (err) {
      console.error("Project add error:", err);
      const serverMessage =
        err.response?.data?.message || "Something went wrong";
      toast.error(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10 selection:bg-orange-500/30 text-white min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-orange-500 animate-pulse" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
            System Operations
          </p>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
          Initialize Project<span className="text-orange-500">.</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: IDENTITY & CLIENT */}
        <FormSection title="01. Identity & Client Architecture">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Project Name *"
              name="projectName"
              value={formData.projectName}
              icon={<FolderPlus size={16} />}
              placeholder="e.g. Premium UI Redesign"
              onChange={handleChange}
              required
            />
            <InputField
              label="Client Name *"
              name="clientName"
              value={formData.clientName}
              icon={<User size={16} />}
              placeholder="e.g. Anupam Joshi"
              onChange={handleChange}
              required
            />
            <InputField
              label="Phone Number *"
              name="phone"
              value={formData.phone}
              icon={<Phone size={16} />}
              placeholder="e.g. +91 XXXXX XXXXX"
              onChange={handleChange}
              required
            />
            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              icon={<Mail size={16} />}
              placeholder="client@domain.com"
              onChange={handleChange}
            />
          </div>
        </FormSection>

        {/* SECTION 2: FINANCIALS */}
        <FormSection title="02. Financial Allocation">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Client Budget (₹) *"
              name="clientBudget"
              type="number"
              value={formData.clientBudget}
              icon={<IndianRupee size={16} />}
              placeholder="50000"
              onChange={handleChange}
              required
            />
            <InputField
              label="Team Payout (₹)"
              name="teamBudget"
              type="number"
              value={formData.teamBudget}
              icon={<LayoutGrid size={16} />}
              placeholder="20000"
              onChange={handleChange}
            />
            <SelectField
              label="Payment Status"
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
            >
              <option value="pending">Pending </option>
              <option value="partial">Partial</option>
              <option value="completed">Paid</option>
            </SelectField>
            <SelectField
              label="Project Pipeline Status"
              name="projectStatus"
              value={formData.projectStatus}
              onChange={handleChange}
            >
              <option value="lead">Lead</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </SelectField>
          </div>
        </FormSection>

        {/* SECTION 3: TIMELINE & DETAILS */}
        <FormSection title="03. Directives & Scope">
          <div className="grid grid-cols-1 gap-6">
            <InputField
              label="Target Deadline *"
              name="deadline"
              type="date"
              value={formData.deadline}
              icon={<Calendar size={16} />}
              onChange={handleChange}
              required
            />
            <InputField
              label="Deliverables * (Split with commas)"
              name="deliverables"
              value={formData.deliverables}
              icon={<CheckCircle2 size={16} />}
              placeholder="Next.js App, Pitch Deck, Motion Graphics"
              onChange={handleChange}
              required
            />
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">
                Project Brief / Scope of Work *
              </label>
              <div className="relative group">
                <FileText
                  className="absolute left-4 top-4 text-white/20 group-focus-within:text-orange-500 transition-colors duration-300"
                  size={18}
                />
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Elaborate structural milestones, expectations, and visual style preferences..."
                  className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-orange-500/50 focus:bg-white/[0.04] transition-all duration-300 resize-none shadow-inner text-white/80"
                ></textarea>
              </div>
            </div>
          </div>
        </FormSection>

        {/* SUBMIT COMPONENT */}
        <div className="pt-4 flex justify-end">
          <motion.button
            whileHover={{
              scale: 1.01,
              boxShadow: "0 0 25px rgba(249,115,22,0.4)",
            }}
            whileTap={{ scale: 0.99 }}
            disabled={loading}
            className="w-full md:w-auto px-10 py-4 bg-orange-500 text-black font-medium text-xs uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                Processing Pipeline...
              </div>
            ) : (
              <>
                Initialize Project <CheckCircle2 size={18} />
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

/* INNER COMPONENT LAYOUT ARCHITECTURE */
const FormSection = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className="bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/5 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 space-y-6"
  >
    <h3 className="text-xs font-black uppercase tracking-[0.25em] text-orange-500/90 border-l-2 border-orange-500 pl-3">
      {title}
    </h3>
    {children}
  </motion.div>
);

const InputField = ({ label, icon, ...props }) => (
  <div className="space-y-2">
    <label className="text-[12px] font-medium uppercase tracking-widest text-white/70 ml-2">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 group-focus-within:text-orange-500 transition-colors duration-300">
        {icon}
      </div>
      <input
        className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-orange-500/50 focus:bg-white/[0.04] transition-all duration-300 font-medium placeholder:text-white/40 text-white/90"
        {...props}
      />
    </div>
  </div>
);

const SelectField = ({ label, children, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">
      {label}
    </label>
    <div className="relative">
      <select
        className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 px-5 text-sm outline-none focus:border-orange-500/50 focus:bg-white/[0.04] transition-all duration-300 font-medium text-white/70 appearance-none cursor-pointer pr-12"
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none group-focus-within:text-orange-500 transition-colors"
        size={16}
      />
    </div>
  </div>
);

export default AddProject;
