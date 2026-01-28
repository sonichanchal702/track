import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { URL } from "../Constants.js";
import {
  Phone,
  Mail,
  ChevronRight,
  Users,
  Search,
  Sparkles,
  MoreHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get(`${URL}/clients`, {
          withCredentials: true,
        });
        setClients(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch clients", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const filteredClients = useMemo(() => {
    const query = searchText.toLowerCase().trim();
    if (!query) return clients;

    return clients.filter(
      (c) =>
        c.name?.toLowerCase().includes(query) ||
        c.email?.toLowerCase().includes(query),
    );
  }, [clients, searchText]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 px-6 lg:px-10 py-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 shadow-lg shadow-orange-500/10">
              <Sparkles size={24} className="text-orange-500" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase flex flex-row italic leading-none items-center ">
                Clients Base
                <span className="text-orange-500">.</span>
              </h1>
            </div>
          </div>

          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
            <Users size={18} className="text-orange-500" />
            <span className="text-sm font-bold text-white">
              {filteredClients.length}
              <span className="text-slate-400 ml-1">records</span>
            </span>
          </div>
        </div>

        {/* SEARCH */}
        <div className="relative group">
          <Search
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition"
          />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search clients by name or email…"
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6
            text-base placeholder:text-slate-600 focus:outline-none
            focus:border-orange-500/40 focus:bg-white/[0.08] transition-all"
          />
        </div>

        {/* LIST */}
        <div className="flex flex-col gap-5">
          <AnimatePresence>
            {filteredClients.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-24 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01]"
              >
                <p className="text-slate-500 uppercase tracking-[0.3em] text-xs font-bold">
                  No matching records found
                </p>
              </motion.div>
            ) : (
              filteredClients.map((client, idx) => (
                <motion.div
                  key={client._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  className="group relative bg-white/[0.03] border border-white/5 rounded-[2rem]
                  p-6 flex flex-wrap items-center justify-between overflow-hidden"
                >
                  {/* AVATAR */}
                  <div className="flex items-center gap-6 min-w-[280px]">
                    <div
                      className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-400
                    text-black flex items-center justify-center font-black text-xl shadow-lg shadow-orange-500/30
                    group-hover:rotate-3 transition-transform"
                    >
                      {client.name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition">
                        {client.name}
                      </h3>
                      <p className="text-[10px] text-slate-500 uppercase tracking-[0.25em] mt-2">
                        Client ID · {client._id.slice(-6)}
                      </p>
                    </div>
                  </div>

                  {/* INFO */}
                  <div className="flex flex-wrap gap-10 flex-1 justify-around py-4 md:py-0">
                    <Info
                      label="Phone"
                      value={client.phone}
                      color="blue"
                      icon={<Phone size={12} />}
                    />
                    <Info
                      label="Email"
                      value={client.email || "—"}
                      color="purple"
                      icon={<Mail size={12} />}
                    />
                    <Info
                      label="Onboarded"
                      value={new Date(client.createdAt).toLocaleDateString()}
                      color="emerald"
                      align="right"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <motion.button
                      onClick={() =>
                        navigate(`/dashboard/client/${client._id}`)
                      }
                      whileHover={{ x: 6 }}
                      className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 shadow-lg shadow-orange-500/20"
                    >
                      <ChevronRight size={22} />
                    </motion.button>
                  </div>

                  {/* GLOW */}
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/[0.04] to-orange-500/0
                  opacity-0 group-hover:opacity-100 transition pointer-events-none"
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value, icon, color, align = "left" }) => {
  const colors = {
    blue: "text-blue-300 bg-blue-500/5 border-blue-500/10",
    purple: "text-purple-300 bg-purple-500/5 border-purple-500/10",
    emerald: "text-emerald-300 bg-emerald-500/5 border-emerald-500/10",
  };

  return (
    <div
      className={`flex flex-col gap-1.5 ${
        align === "right" ? "text-right items-end" : ""
      }`}
    >
      <span className="text-[9px] uppercase tracking-widest font-bold text-white/40 flex items-center gap-1">
        {icon} {label}
      </span>
      <span
        className={`text-sm font-bold px-3 py-1 rounded-lg border ${colors[color]}`}
      >
        {value}
      </span>
    </div>
  );
};

export default Clients;
