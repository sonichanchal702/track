import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { URL } from "../Constants.js";
import { Phone, Mail, Users, Search, Sparkles, Calendar } from "lucide-react";
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
          <div className="w-10 h-10 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 px-4 md:px-6 lg:px-10 py-6 md:py-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-2xl bg-orange-500/10 border border-orange-500/20 shadow-lg shadow-orange-500/10">
              <Sparkles size={24} className="text-orange-500" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase flex flex-row italic leading-none items-center ">
                Clients Base
                <span className="text-orange-500">.</span>
              </h1>
            </div>
          </div>

          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 w-fit">
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
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 md:py-5 pl-14 pr-6
            text-base placeholder:text-slate-600 focus:outline-none
            focus:border-orange-500/40 focus:bg-white/[0.08] transition-all"
          />
        </div>

        {/* LIST */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
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
                  onClick={() => navigate(`/dashboard/client/${client._id}`)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  className="group relative bg-white/[0.03] border border-white/5 rounded-[1.5rem] md:rounded-[2rem]
                  p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden cursor-pointer hover:border-orange-500/30 hover:bg-white/[0.05] transition-colors"
                >
                  {/* AVATAR & NAME */}
                  <div className="flex items-center gap-4 md:gap-6 min-w-0 w-full md:w-auto pr-4 md:pr-0">
                    <div
                      className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-400
                    text-black flex items-center justify-center font-black text-lg md:text-xl shadow-lg shadow-orange-500/30
                    group-hover:rotate-3 transition-transform shrink-0"
                    >
                      {client.name?.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg md:text-xl font-bold text-white truncate group-hover:text-orange-400 transition">
                        {client.name}
                      </h3>
                      <p className="text-[9px] md:text-[10px] text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.25em] mt-1 md:mt-2">
                        Client ID · {client._id.slice(-6)}
                      </p>
                    </div>
                  </div>

                  {/* INFO GRID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-wrap gap-y-4 gap-x-8 lg:gap-10 w-full md:w-auto md:flex-1 md:justify-end border-t border-white/5 md:border-0 pt-4 md:pt-0">
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
                    <div className="col-span-2 sm:col-span-1">
                      <Info
                        label="Onboarded"
                        value={new Date(client.createdAt).toLocaleDateString()}
                        color="emerald"
                        align="right"
                        icon={<Calendar size={12} />}
                      />
                    </div>
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
      className={`flex flex-col gap-1.5 min-w-0 ${
        align === "right" ? "md:text-right md:items-end" : ""
      }`}
    >
      <span className="text-[9px] uppercase tracking-widest font-bold text-white/40 flex items-center gap-1.5 md:justify-start">
        {icon} {label}
      </span>
      <span
        className={`text-xs md:text-sm font-bold px-3 py-1 rounded-lg border w-fit ${colors[color]} truncate max-w-full`}
      >
        {value}
      </span>
    </div>
  );
};

export default Clients;
