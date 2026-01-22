import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
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
    setLoading(true);
    try {
      // deliverables ko comma-separated se array mein convert krna
      const finalData = {
        ...formData,
        deliverables: formData.deliverables
          .split(",")
          .map((item) => item.trim()),
      };

      const res = await axios.post(URL + "/createProject", finalData, {
        withCredentials: true,
      });
      console.log(res);
      toast.success("Project created Successfully");
      navigate("/dashboard/projects");
    } catch (err) {
      console.error("Project add error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-5xl mx-auto space-y-10 selection:bg-orange-500/30">
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-orange-500" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
            New Operation
          </p>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
          Initialize Project<span className="text-orange-500">.</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: IDENTITY */}
        <FormSection title="01. Identity & Client">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Project Name"
              name="projectName"
              icon={<FolderPlus size={16} />}
              placeholder="e.g. Video Shoot"
              onChange={handleChange}
              required
            />
            <InputField
              label="Client Name"
              name="clientName"
              icon={<User size={16} />}
              placeholder="e.g. Bucky"
              onChange={handleChange}
              required
            />
            <InputField
              label="Phone"
              name="phone"
              icon={<Phone size={16} />}
              placeholder="+91 00000 00000"
              onChange={handleChange}
            />
            <InputField
              label="Email Address"
              name="email"
              type="email"
              icon={<Mail size={16} />}
              placeholder="client@example.com"
              onChange={handleChange}
            />
          </div>
        </FormSection>

        {/* SECTION 2: FINANCIALS */}
        <FormSection title="02. Financial Architecture">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Client Budget (₹)"
              name="clientBudget"
              type="number"
              icon={<IndianRupee size={16} />}
              placeholder="10000"
              onChange={handleChange}
              required
            />
            <InputField
              label="Team Payout (₹)"
              name="teamBudget"
              type="number"
              icon={<LayoutGrid size={16} />}
              placeholder="0"
              onChange={handleChange}
            />
            <SelectField
              label="Payment Status"
              name="paymentStatus"
              onChange={handleChange}
            >
              <option className="text-white bg-black" value="pending">
                Pending
              </option>
              <option className="text-white bg-black" value="partial">
                Partial
              </option>
              <option className="text-white bg-black" value="completed">
                Completed
              </option>
            </SelectField>
            <SelectField
              label="Initial Status"
              name="projectStatus"
              onChange={handleChange}
            >
              <option className="text-white bg-black" value="lead">
                Lead
              </option>
              <option className="text-white bg-black" value="active">
                Active
              </option>
            </SelectField>
          </div>
        </FormSection>

        {/* SECTION 3: DELIVERY & BRIEF */}
        <FormSection title="03. Timeline & Deliverables">
          <div className="grid grid-cols-1 gap-6">
            <InputField
              label="Deadline"
              name="deadline"
              type="date"
              icon={<Calendar size={16} />}
              onChange={handleChange}
              required
            />
            <InputField
              label="Deliverables (Comma Separated)"
              name="deliverables"
              icon={<CheckCircle2 size={16} />}
              placeholder="Script, Editing, Voiceover"
              onChange={handleChange}
            />
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">
                Project Brief / Description
              </label>
              <div className="relative group">
                <FileText
                  className="absolute left-4 top-4 text-white/20 group-focus-within:text-orange-500 transition-colors"
                  size={18}
                />
                <textarea
                  name="description"
                  rows="4"
                  onChange={handleChange}
                  placeholder="Describe the scope of work..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-orange-500/50 transition-all resize-none"
                ></textarea>
              </div>
            </div>
          </div>
        </FormSection>

        {/* SUBMIT BUTTON */}
        <div className="pt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full md:w-auto px-12 py-4 bg-orange-500 text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-[0_10px_30px_rgba(249,115,22,0.3)] hover:shadow-orange-500/50 transition-all flex items-center justify-center gap-3"
          >
            {loading ? (
              "Creating Project.."
            ) : (
              <>
                Create Project <CheckCircle2 size={16} />
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

const FormSection = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-10 space-y-8"
  >
    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white border-l-2 border-orange-500 pl-4">
      {title}
    </h3>
    {children}
  </motion.div>
);

const InputField = ({ label, icon, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-orange-500 transition-colors">
        {icon}
      </div>
      <input
        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-orange-500/50 transition-all font-medium placeholder:text-white/10"
        {...props}
      />
    </div>
  </div>
);

const SelectField = ({ label, children, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">
      {label}
    </label>
    <select
      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm outline-none focus:border-orange-500/50 transition-all font-medium text-white/60 appearance-none cursor-pointer"
      {...props}
    >
      {children}
    </select>
  </div>
);

export default AddProject;
