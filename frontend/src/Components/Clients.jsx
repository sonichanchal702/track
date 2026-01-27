import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { URL } from "../Constants.js";
import {
  User,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  Plus,
  Users,
  Search,
  Sparkles,
  MoreHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

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
    return clients.filter((client) => {
      const nameMatch = client.name
        ?.toLowerCase()
        .includes(searchText.toLowerCase());
      const emailMatch = client.email
        ?.toLowerCase()
        .includes(searchText.toLowerCase());
      return nameMatch || emailMatch;
    });
  }, [clients, searchText]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="text-orange-500 font-bold tracking-widest text-xs uppercase">
            Syncing Database...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 p-6 lg:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* --- SAME TOP HEADER (As you requested) --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 flex flex-row gap-4 items-center">
            <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20">
              <Sparkles className="text-orange-500" size={24} />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              Clients Base<span className="text-orange-500">.</span>
            </h1>
          </div>

          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
            <Users size={18} className="text-orange-500" />
            <span className="text-sm font-bold text-white">
              {filteredClients.length}{" "}
              <span className="text-slate-500 font-medium">results</span>
            </span>
          </div>
        </div>

        <div className="relative group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors"
            size={20}
          />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Type name or email to filter..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.08] transition-all text-base placeholder:text-slate-600"
          />
        </div>

        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {filteredClients.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-24 text-center border border-dashed border-white/10 rounded-[2rem] bg-white/[0.01]"
              >
                <p className="text-slate-600 uppercase tracking-[0.3em] text-[10px] font-black">
                  No matching records found
                </p>
              </motion.div>
            ) : (
              filteredClients.map((client, idx) => (
                <motion.div
                  layout
                  key={client._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.02 }}
                  whileHover={{
                    y: -3,
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  }}
                  className="group relative w-full bg-white/[0.02] border border-white/5 p-6 rounded-[1.5rem] flex flex-wrap items-center justify-between transition-all duration-300 shadow-xl overflow-hidden"
                >
                  <div className="flex items-center gap-6 min-w-[280px] relative z-10 cursor-pointer">
                    <div className="h-14 w-14 rounded-2xl bg-orange-500/80  flex items-center justify-center text-black font-black text-xl shadow-lg group-hover:scale-105 transition-transform">
                      {client.name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-orange-500 transition-colors uppercase tracking-tight leading-none">
                        {client.name}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
                        Partner Entry: {client._id.slice(-6)}
                      </p>
                    </div>
                  </div>

                  {/* Client Info Grid */}
                  <div className="flex flex-wrap items-center gap-10 flex-1 justify-around px-6 py-4 md:py-0 relative z-10">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest flex items-center gap-1">
                        <Phone size={10} /> Connectivity
                      </span>
                      <span className="text-sm font-medium text-slate-300">
                        {client.phone}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest flex items-center gap-1">
                        <Mail size={10} /> Communication
                      </span>
                      <span className="text-sm font-medium text-slate-300 truncate max-w-[150px]">
                        {client.email || "—"}
                      </span>
                    </div>

                    <div className="hidden lg:flex flex-col text-right gap-1">
                      <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">
                        Onboarded
                      </span>
                      <span className="text-sm font-medium text-slate-400 italic">
                        {new Date(client.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 relative z-10">
                    <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-white transition-all">
                      <MoreHorizontal size={18} />
                    </button>
                    <motion.button
                      whileHover={{ x: 5 }}
                      className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 shadow-lg shadow-orange-500/5 transition-all"
                    >
                      <ChevronRight size={22} />
                    </motion.button>
                  </div>

                  {/* Glow Background Effect on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/[0.01] to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-white/5 flex justify-center">
          <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.6em]">
            Registry Terminal v2.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Clients;
