import React, { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../../Constants.js";
import {
  FileText,
  Download,
  CheckCircle,
  Clock,
  IndianRupee,
  Plus,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  /* CREATE MODAL */
  const [showCreate, setShowCreate] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [tax, setTax] = useState(0);
  const [items, setItems] = useState([{ title: "", amount: "" }]);
  const [creating, setCreating] = useState(false);

  /* FETCH DATA */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [invRes, projRes] = await Promise.all([
          axios.get(`${URL}/invoices`, { withCredentials: true }),
          axios.get(`${URL}/projects`, { withCredentials: true }),
        ]);

        setInvoices(invRes.data.invoices || []);
        setProjects(projRes.data.projects || []);
      } catch {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  /* CREATE INVOICE */
  const createInvoice = async (e) => {
    e.preventDefault();

    if (!projectId || items.some((i) => !i.title || !i.amount)) {
      return toast.error("Fill all fields");
    }

    try {
      setCreating(true);
      const res = await axios.post(
        `${URL}/create-invoice`,
        {
          projectId,
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
      setItems([{ title: "", amount: "" }]);
      setProjectId("");
      setTax(0);
    } catch {
      toast.error("Creation failed");
    } finally {
      setCreating(false);
    }
  };

  /* MARK PAID */
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

      toast.success("Marked as paid");
    } catch {
      toast.error("Failed");
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#020202]">
        <div className="w-10 h-10 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#020202] text-white px-6 lg:px-10 py-10">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20">
              <FileText size={24} className="text-orange-500" />
            </div>
            <h1 className="text-4xl uppercase font-semibold">
              Invoices<span className="text-orange-500">.</span>
            </h1>
          </div>

          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-5 py-3 bg-orange-500 text-black text-xs font-bold uppercase rounded-2xl"
          >
            <Plus size={16} /> Create Invoice
          </button>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {invoices.map((inv) => {
            const paid = inv.status === "paid";

            return (
              <div
                key={inv._id}
                className={`rounded-3xl p-6 flex flex-col md:flex-row justify-between gap-6 border transition-all
                  ${
                    paid
                      ? "bg-emerald-500/5 border-emerald-500/30"
                      : "bg-white/[0.03] border-white/5 hover:bg-white/[0.05]"
                  }`}
              >
                <div className="flex items-center gap-4 min-w-[250px]">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      paid
                        ? "bg-emerald-500 text-black"
                        : "bg-orange-500/10 text-orange-500"
                    }`}
                  >
                    {paid ? <CheckCircle /> : <Clock />}
                  </div>

                  <div>
                    <h3 className="font-semibold">{inv.invoiceNumber}</h3>
                    <p className="text-[11px] uppercase text-white/40">
                      ₹{inv.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={inv.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:text-orange-500"
                  >
                    <Download size={18} />
                  </a>

                  {paid ? (
                    <span className="px-4 py-2 bg-emerald-500 text-black text-xs font-bold rounded-xl">
                      Paid ✓
                    </span>
                  ) : (
                    <button
                      onClick={() => markPaid(inv._id)}
                      className="px-4 py-2 text-xs uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-black"
                    >
                      Mark Paid
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CREATE MODAL */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              onClick={() => setShowCreate(false)}
              className="absolute inset-0 bg-black/80"
            />
            <motion.form
              onSubmit={createInvoice}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 w-full max-w-xl space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl uppercase font-bold">
                  Create Invoice<span className="text-orange-500">.</span>
                </h2>
                <button type="button" onClick={() => setShowCreate(false)}>
                  <X />
                </button>
              </div>

              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.projectName}
                  </option>
                ))}
              </select>

              {items.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <input
                    placeholder="Title"
                    value={item.title}
                    onChange={(e) => {
                      const copy = [...items];
                      copy[i].title = e.target.value;
                      setItems(copy);
                    }}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={item.amount}
                    onChange={(e) => {
                      const copy = [...items];
                      copy[i].amount = e.target.value;
                      setItems(copy);
                    }}
                    className="w-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() => setItems([...items, { title: "", amount: "" }])}
                className="text-xs text-orange-500 uppercase"
              >
                + Add item
              </button>

              <input
                type="number"
                placeholder="Tax"
                value={tax}
                onChange={(e) => setTax(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
              />

              <button
                disabled={creating}
                className="w-full py-4 bg-orange-500 text-black uppercase font-bold rounded-2xl"
              >
                {creating ? "Creating..." : "Create Invoice"}
              </button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Invoices;
