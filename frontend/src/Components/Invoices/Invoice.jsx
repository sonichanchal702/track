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
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [tax, setTax] = useState(0);
  const [items, setItems] = useState([{ title: "", amount: "" }]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [invRes, projRes] = await Promise.all([
          axios.get(`${URL}/invoices`, { withCredentials: true }),
          axios.get(`${URL}/projects`, { withCredentials: true }),
        ]);
        setInvoices(invRes.data.invoices || []);
        setProjects(projRes.data.projects || projRes.data.data || []);
      } catch (err) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filteredProjects = projects.filter((p) =>
    p.projectName?.toLowerCase().includes(projectSearch.toLowerCase()),
  );

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

  const removeItem = (index) => {
    if (items.length === 1) return;
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#020202]">
        <div className="w-10 h-10 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#020202] text-white px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-sans selection:bg-orange-500/30">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 shadow-lg shrink-0">
              <FileText size={24} className="text-orange-500" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter uppercase italic flex items-center">
              Invoices<span className="text-orange-500">.</span>
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreate(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 text-black text-sm font-bold uppercase rounded-2xl shadow-xl shadow-orange-500/20 hover:bg-orange-400 transition-all"
          >
            <Plus size={20} strokeWidth={3} /> New Invoice
          </motion.button>
        </div>

        <div className="space-y-4">
          {invoices.length === 0 ? (
            <div className="py-20 sm:py-32 text-center border border-dashed border-white/10 rounded-[2.5rem] bg-white/[0.01]">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">
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
                  className={`relative overflow-hidden rounded-[2rem] p-5 sm:p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border transition-all ${
                    paid
                      ? "bg-emerald-500/5 border-emerald-500/20"
                      : "bg-white/[0.02] border-white/5 hover:border-orange-500/30"
                  }`}
                >
                  <div className="flex items-center gap-5 w-full lg:w-auto">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl flex items-center justify-center ${
                        paid
                          ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                          : "bg-orange-500/10 text-orange-500"
                      }`}
                    >
                      {paid ? (
                        <CheckCircle size={20} className="sm:w-6 sm:h-6" />
                      ) : (
                        <Clock size={20} className="sm:w-6 sm:h-6" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-base sm:text-lg uppercase tracking-tight truncate pr-4">
                        {inv.projectId?.projectName || "Unknown Project"}
                      </h3>
                      <p className="text-xs sm:text-[15px] font-medium text-white/40 uppercase mt-0.5">
                        <span className="text-white">
                          ₹{inv.totalAmount.toLocaleString()}
                        </span>{" "}
                        — #{inv.invoiceNumber || inv._id.slice(-6)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full lg:w-auto">
                    <button
                      onClick={() => downloadInvoice(inv)}
                      className="h-12 w-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-orange-500 hover:bg-white/10 transition-all active:scale-95 shrink-0"
                      title="Download PDF"
                    >
                      <Download size={20} />
                    </button>

                    <div className="flex-1 lg:w-[160px]">
                      {paid ? (
                        <div className="h-12 w-full flex items-center justify-center bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase rounded-xl border border-emerald-500/20 select-none">
                          Paid ✓
                        </div>
                      ) : (
                        <button
                          onClick={() => markPaid(inv._id)}
                          className="h-12 w-full flex items-center justify-center text-[10px] font-bold uppercase bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-xl hover:bg-orange-500 hover:text-black transition-all active:scale-95 whitespace-nowrap"
                        >
                          Mark Paid
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

      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreate(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.form
              onSubmit={createInvoice}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-[#080808] border-t sm:border border-white/10 rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 sm:p-10 w-full max-w-2xl flex flex-col shadow-2xl max-h-[90vh]"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-6 mb-6 shrink-0">
                <h2 className="text-2xl sm:text-3xl font-medium uppercase tracking-tighter text-white">
                  Draft Node<span className="text-orange-500">.</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="p-2 hover:bg-white/5 rounded-full text-white/20 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="overflow-y-auto custom-scrollbar space-y-8 pr-2">
                <div className="space-y-3 relative z-50">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-2">
                    Project Name
                  </label>
                  <div className="relative">
                    <div
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className={`w-full bg-white/5 border rounded-2xl px-5 py-4 flex items-center justify-between cursor-pointer group transition-all ${
                        dropdownOpen
                          ? "border-orange-500/50"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <span
                        className={
                          selectedProject
                            ? "text-white font-medium truncate pr-4"
                            : "text-white/20 text-sm"
                        }
                      >
                        {selectedProject
                          ? selectedProject.projectName
                          : "Select Active Node..."}
                      </span>
                      <ChevronDown
                        className={`text-white/20 transition-transform duration-300 shrink-0 ${dropdownOpen ? "rotate-180 text-orange-500" : ""}`}
                      />
                    </div>

                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.98 }}
                          className="absolute z-50 w-full mt-2 bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                        >
                          <div className="p-3 border-b border-white/5 flex items-center gap-3 bg-white/[0.02]">
                            <Search size={16} className="text-white/20" />
                            <input
                              autoFocus
                              placeholder="Filter nodes..."
                              value={projectSearch}
                              onChange={(e) => setProjectSearch(e.target.value)}
                              className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-white/20"
                            />
                          </div>
                          <div className="max-h-48 overflow-y-auto custom-scrollbar">
                            {filteredProjects.length > 0 ? (
                              filteredProjects.map((p) => (
                                <div
                                  key={p._id}
                                  onClick={() => {
                                    setSelectedProject(p);
                                    setDropdownOpen(false);
                                  }}
                                  className="px-5 py-3 hover:bg-orange-500 hover:text-black cursor-pointer text-sm font-medium transition-colors border-b border-white/[0.02] flex justify-between items-center group last:border-0"
                                >
                                  <span className="truncate">
                                    {p.projectName}
                                  </span>
                                  <ArrowRight
                                    size={14}
                                    className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
                                  />
                                </div>
                              ))
                            ) : (
                              <div className="px-5 py-6 text-center text-white/20 text-xs font-medium uppercase tracking-widest">
                                No nodes found
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                      Ledger Items
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setItems([...items, { title: "", amount: "" }])
                      }
                      className="text-[10px] font-bold text-orange-500 uppercase hover:text-orange-400 transition-colors"
                    >
                      + New Entry
                    </button>
                  </div>

                  <div className="space-y-3">
                    {items.map((item, i) => (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row gap-3 items-stretch"
                      >
                        <input
                          placeholder="Service Description"
                          value={item.title}
                          onChange={(e) => {
                            const copy = [...items];
                            copy[i].title = e.target.value;
                            setItems(copy);
                          }}
                          className="flex-1 bg-white/5 border border-white/5 focus:border-white/20 rounded-2xl px-5 py-3 sm:py-4 outline-none text-sm font-medium text-white transition-colors"
                        />
                        <div className="flex gap-3">
                          <input
                            type="number"
                            placeholder="Amount"
                            value={item.amount}
                            onChange={(e) => {
                              const copy = [...items];
                              copy[i].amount = e.target.value;
                              setItems(copy);
                            }}
                            className="w-full sm:w-36 bg-white/5 border border-white/5 focus:border-white/20 rounded-2xl px-5 py-3 sm:py-4 outline-none text-sm font-medium text-orange-500 text-center transition-colors placeholder:text-white/20"
                          />
                          {items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(i)}
                              className="w-12 sm:w-14 flex items-center justify-center bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shrink-0"
                            >
                              <Trash2 size={20} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 pt-6 border-t border-white/5 items-center">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 px-2">
                      Global Tax (₹)
                    </label>
                    <input
                      type="number"
                      value={tax}
                      onChange={(e) => setTax(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 focus:border-white/20 rounded-2xl px-5 py-4 outline-none text-sm font-medium text-white transition-colors"
                    />
                  </div>
                  <div className="flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-end bg-white/[0.02] sm:bg-transparent p-4 sm:p-0 rounded-2xl sm:rounded-none border border-white/5 sm:border-none">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest sm:mb-1">
                      Total Valuation
                    </p>
                    <p className="text-2xl sm:text-4xl font-medium text-white tracking-tighter">
                      ₹
                      {(
                        items.reduce((s, i) => s + Number(i.amount || 0), 0) +
                        Number(tax || 0)
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-white/5 shrink-0">
                <button
                  disabled={creating}
                  className="w-full py-4 sm:py-5 bg-orange-500 text-black font-bold uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl shadow-orange-500/20 transition-all hover:bg-orange-400 hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {creating ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Create Invoice"
                  )}
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Invoices;
