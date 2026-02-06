import React, { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../../Constants.js";
import {
  FileText,
  Download,
  CheckCircle,
  Clock,
  Plus,
  X,
  Search,
  ChevronDown,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // CREATE MODAL & DROPDOWN STATE
  const [showCreate, setShowCreate] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  const [tax, setTax] = useState(0);
  const [items, setItems] = useState([{ title: "", amount: "" }]);
  const [creating, setCreating] = useState(false);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [invRes, projRes] = await Promise.all([
          axios.get(`${URL}/invoices`, { withCredentials: true }),
          axios.get(`${URL}/projects`, { withCredentials: true }),
        ]);

        setInvoices(invRes.data.invoices || []);
        // Backend check: projects list can be in .projects or .data
        setProjects(projRes.data.projects || projRes.data.data || []);
      } catch (err) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Filter projects for searchable dropdown
  const filteredProjects = projects.filter((p) =>
    p.projectName?.toLowerCase().includes(projectSearch.toLowerCase()),
  );

  /* ================= ACTIONS ================= */
  const downloadInvoice = async (invoice) => {
    try {
      const res = await axios.get(`${URL}/invoices/${invoice._id}/download`, {
        responseType: "blob",
        withCredentials: true,
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch {
      toast.error("Download failed");
    }
  };

  const markPaid = async (id) => {
    try {
      await axios.patch(
        `${URL}/invoices/${id}/paid`,
        {},
        { withCredentials: true },
      );
      setInvoices((prev) =>
        prev.map((inv) => (inv._id === id ? { ...inv, status: "paid" } : inv)),
      );
      toast.success("Invoice marked as paid");
    } catch {
      toast.error("Update failed");
    }
  };

  const createInvoice = async (e) => {
    e.preventDefault();
    if (!selectedProject || items.some((i) => !i.title || !i.amount)) {
      return toast.error("Fill all fields");
    }

    try {
      setCreating(true);
      const res = await axios.post(
        `${URL}/create-invoice`,
        {
          projectId: selectedProject._id,
          tax: Number(tax),
          items: items.map((i) => ({
            title: i.title,
            amount: Number(i.amount),
          })),
        },
        { withCredentials: true },
      );

      setInvoices((prev) => [res.data, ...prev]);
      toast.success("Invoice created");
      setShowCreate(false);
      resetForm();
    } catch {
      toast.error("Creation failed");
    } finally {
      setCreating(false);
    }
  };

  const resetForm = () => {
    setSelectedProject(null);
    setProjectSearch("");
    setTax(0);
    setItems([{ title: "", amount: "" }]);
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#020202]">
        <div className="w-10 h-10 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#020202] text-white px-6 lg:px-10 py-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 shadow-lg">
              <FileText size={24} className="text-orange-500" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center">
              Invoices<span className="text-orange-500">.</span>
            </h1>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-black text-xs font-medium uppercase rounded-2xl shadow-xl hover:bg-orange-400 transition-all active:scale-95"
          >
            <Plus size={18} strokeWidth={3} /> New Invoice
          </button>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {invoices.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-white/10 rounded-[2.5rem] bg-white/[0.01]">
              <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/20">
                Archive Empty
              </p>
            </div>
          ) : (
            invoices.map((inv) => {
              const paid = inv.status === "paid";
              return (
                <motion.div
                  layout
                  key={inv._id}
                  className={`rounded-[2rem] p-6 flex flex-col md:flex-row justify-between items-center gap-6 border transition-all ${paid ? "bg-emerald-500/5 border-emerald-500/20" : "bg-white/[0.02] border-white/5 hover:border-orange-500/30"}`}
                >
                  <div className="flex items-center gap-6 min-w-[280px]">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${paid ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" : "bg-orange-500/10 text-orange-500"}`}
                    >
                      {paid ? <CheckCircle size={24} /> : <Clock size={24} />}
                    </div>
                    <div>
                      <h3 className="font-medium text-lg uppercase tracking-tight">
                        {inv.projectId?.projectName || "Invoice"}
                      </h3>

                      <p className="text-[15px] font-medium text-white/20 uppercase  mt-1">
                        Total: ₹{inv.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => downloadInvoice(inv)}
                      className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-orange-500 transition-all"
                    >
                      <Download size={20} />
                    </button>
                    <div className="w-[140px] flex justify-end">
                      {paid ? (
                        <div className="w-full text-center px-6 py-2.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-medium uppercase rounded-xl border border-emerald-500/20">
                          Paid ✓
                        </div>
                      ) : (
                        <button
                          onClick={() => markPaid(inv._id)}
                          className="w-full px-6 py-2.5 text-[10px] font-medium uppercase bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-xl hover:bg-orange-500 hover:text-black transition-all"
                        >
                          Mark as Paid
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* CREATE MODAL */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreate(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.form
              onSubmit={createInvoice}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-[#080808] border border-white/10 rounded-[2.5rem] p-10 w-full max-w-2xl space-y-8 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <h2 className="text-3xl font-medium   uppercase tracking-tighter text-white">
                  Draft Node<span className="text-orange-500">.</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="p-2 hover:bg-white/5 rounded-xl text-white/20"
                >
                  <X />
                </button>
              </div>

              {/* CUSTOM SEARCHABLE SELECT */}
              <div className="space-y-3 relative">
                <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/30 ml-2">
                  Project Name
                </label>
                <div className="relative">
                  <div
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex items-center justify-between cursor-pointer group hover:border-orange-500/50 transition-all"
                  >
                    <span
                      className={
                        selectedProject
                          ? "text-white font-medium"
                          : "text-white/20 text-sm"
                      }
                    >
                      {selectedProject
                        ? selectedProject.projectName
                        : "Select Active Node..."}
                    </span>
                    <ChevronDown
                      className={`text-white/20 transition-transform duration-300 ${dropdownOpen ? "rotate-180 text-orange-500" : ""}`}
                    />
                  </div>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-50 w-full mt-2 bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-3xl"
                      >
                        <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-white/[0.02]">
                          <Search size={16} className="text-white/20" />
                          <input
                            autoFocus
                            placeholder="Filter nodes..."
                            value={projectSearch}
                            onChange={(e) => setProjectSearch(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm w-full text-white"
                          />
                        </div>
                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                          {filteredProjects.length > 0 ? (
                            filteredProjects.map((p) => (
                              <div
                                key={p._id}
                                onClick={() => {
                                  setSelectedProject(p);
                                  setDropdownOpen(false);
                                }}
                                className="px-6 py-4 hover:bg-orange-500 hover:text-black cursor-pointer text-sm font-medium transition-colors border-b border-white/[0.02] flex justify-between items-center group"
                              >
                                <span>{p.projectName}</span>
                                <ArrowRight
                                  size={14}
                                  className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
                                />
                              </div>
                            ))
                          ) : (
                            <div className="px-6 py-8 text-center text-white/20 text-xs font-medium uppercase tracking-widest">
                              No nodes found
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* ITEMS SECTION */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">
                    Ledger Items
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setItems([...items, { title: "", amount: "" }])
                    }
                    className="text-[10px] font-medium text-orange-500 uppercase hover:underline"
                  >
                    + New Entry
                  </button>
                </div>
                {items.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <input
                      placeholder="Service/Description"
                      value={item.title}
                      onChange={(e) => {
                        const copy = [...items];
                        copy[i].title = e.target.value;
                        setItems(copy);
                      }}
                      className="flex-1 bg-white/5 border border-white/5 focus:border-white/20 rounded-2xl px-6 py-4 outline-none text-sm font-medium text-white"
                    />
                    <input
                      type="number"
                      placeholder="₹"
                      value={item.amount}
                      onChange={(e) => {
                        const copy = [...items];
                        copy[i].amount = e.target.value;
                        setItems(copy);
                      }}
                      className="w-36 bg-white/5 border border-white/5 focus:border-white/20 rounded-2xl px-6 py-4 outline-none text-sm font-medium text-orange-500 text-center"
                    />
                  </div>
                ))}
              </div>

              {/* TAX & TOTAL */}
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5 items-center">
                <div className="space-y-2">
                  <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/30 px-2">
                    Global Tax (₹)
                  </label>
                  <input
                    type="number"
                    value={tax}
                    onChange={(e) => setTax(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none text-sm font-medium text-white"
                  />
                </div>
                <div className="text-right pr-4">
                  <p className="text-[10px] font-medium text-white/20 uppercase tracking-widest mb-1">
                    Total Valuation
                  </p>
                  <p className="text-4xl font-medium text-white   tracking-tighter">
                    ₹
                    {(
                      items.reduce((s, i) => s + Number(i.amount || 0), 0) +
                      Number(tax || 0)
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                disabled={creating}
                className="w-full py-6 bg-orange-500 text-black font-medium uppercase tracking-[0.3em] text-xs rounded-3xl shadow-2xl shadow-orange-500/20 transition-all hover:bg-orange-400 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {creating ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Create Invoice"
                )}
              </button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Invoices;
