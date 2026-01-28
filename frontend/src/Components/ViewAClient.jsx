import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "../Constants.js";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  ArrowLeft,
  ExternalLink,
  IndianRupee,
  Clock,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

function ViewAClient() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchClient = async () => {
    try {
      const res = await axios.get(`${URL}/client/${clientId}`, {
        withCredentials: true,
      });
      setData(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClient();
  }, [clientId]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#020202]">
        <div className="w-10 h-10 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );

  const { client, projects } = data || {};

  return (
    <div className="min-h-screen bg-[#020202] text-[#e5e5e5] p-6 lg:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.button
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium uppercase tracking-widest text-white/60 hover:text-orange-500 transition-all backdrop-blur-3xl"
          >
            <ArrowLeft size={18} /> Back
          </motion.button>

          <div className="px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center gap-2">
            <Sparkles size={16} className="text-orange-500" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-orange-200">
              Verified Client Profile
            </span>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-black text-4xl font-bold shadow-xl shadow-orange-500/10">
                {client?.name?.[0]}
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-white tracking-tight uppercase">
                  {client?.name}
                </h1>
                <p className="text-xs text-white/20 mt-2 font-medium tracking-[0.2em] uppercase">
                  Partner ID: {client?._id?.slice(-6)}
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[9px] font-medium text-white/20 uppercase tracking-widest">
                    Phone Number
                  </p>
                  <p className="text-sm font-medium">{client?.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                  <Mail size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-medium text-white/20 uppercase tracking-widest">
                    Email Address
                  </p>
                  <p className="text-sm font-medium truncate">
                    {client?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[9px] font-medium text-white/20 uppercase tracking-widest">
                    Member Since
                  </p>
                  <p className="text-sm font-medium">
                    {new Date(client?.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-semibold uppercase tracking-tight flex items-center gap-2">
                <Briefcase className="text-orange-500" size={20} />
                Active Engagements
              </h2>
              <span className="text-xs font-medium text-white/20 tracking-widest uppercase">
                {projects?.length} Total
              </span>
            </div>

            <div className="grid gap-4">
              {projects?.length > 0 ? (
                projects.map((project) => (
                  <motion.div
                    key={project._id}
                    whileHover={{ x: 8 }}
                    className="group bg-white/[0.02] border border-white/5 p-6 rounded-[1.8rem] flex items-center justify-between hover:bg-white/[0.04] transition-all"
                  >
                    <div className="flex items-center gap-6">
                      <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-orange-500/60">
                        <Clock size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white uppercase">
                          {project.projectName}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-[10px] font-medium text-white/30 uppercase tracking-[0.1em]">
                          <span className="text-emerald-500/80">
                            Active Stage
                          </span>
                          <span className="h-1 w-1 bg-white/10 rounded-full" />
                          <span>Ref: {project._id.slice(-6)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-[9px] font-medium text-white/20 uppercase tracking-widest mb-1">
                          Total Valuation
                        </p>
                        <p className="text-xl font-semibold text-orange-500 flex items-center gap-1 justify-end">
                          <IndianRupee size={16} />
                          {project.clientBudget?.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          navigate(`/dashboard/viewProject/${project._id}`)
                        }
                        className="p-3 bg-white/5 rounded-xl hover:text-orange-500 hover:bg-orange-500/60 text-white/20 border border-transparent"
                      >
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-20 text-center border border-dashed border-white/5 rounded-[2rem] bg-white/[0.01]">
                  <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/10">
                    No projects linked to this account
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ViewAClient;
