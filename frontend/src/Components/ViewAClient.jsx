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
    <div className="min-h-screen bg-[#020202] text-[#e5e5e5] px-4 md:px-6 lg:px-10 py-6 md:py-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-10">
        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
          <motion.button
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-xs md:text-sm font-medium uppercase tracking-widest text-white/60 hover:text-orange-500 transition-all backdrop-blur-3xl w-fit"
          >
            <ArrowLeft size={16} className="md:w-[18px] md:h-[18px]" /> Back
          </motion.button>

          <div className="px-3 md:px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center gap-2 w-fit">
            <Sparkles
              size={14}
              className="text-orange-500 md:w-[16px] md:h-[16px]"
            />
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-orange-200">
              Verified Client Profile
            </span>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* LEFT CARD: CLIENT INFO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 bg-white/[0.03] border border-white/5 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 space-y-6 md:space-y-8 shadow-2xl h-fit"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-black text-3xl md:text-4xl font-black shadow-xl shadow-orange-500/10">
                {client?.name?.[0]}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight uppercase">
                  {client?.name}
                </h1>
                <p className="text-[10px] md:text-xs text-white/20 mt-2 font-bold tracking-[0.2em] uppercase">
                  Partner ID: {client?._id?.slice(-6)}
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-2.5 md:p-3 bg-blue-500/10 rounded-xl text-blue-400 shrink-0">
                  <Phone size={16} className="md:w-[18px] md:h-[18px]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">
                    Phone Number
                  </p>
                  <p className="text-xs md:text-sm font-bold truncate">
                    {client?.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-2.5 md:p-3 bg-purple-500/10 rounded-xl text-purple-400 shrink-0">
                  <Mail size={16} className="md:w-[18px] md:h-[18px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">
                    Email Address
                  </p>
                  <p className="text-xs md:text-sm font-bold truncate">
                    {client?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-2.5 md:p-3 bg-emerald-500/10 rounded-xl text-emerald-400 shrink-0">
                  <Calendar size={16} className="md:w-[18px] md:h-[18px]" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">
                    Member Since
                  </p>
                  <p className="text-xs md:text-sm font-bold">
                    {new Date(client?.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE: PROJECTS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-4 md:space-y-6"
          >
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg md:text-xl font-bold uppercase tracking-tight flex items-center gap-2">
                <Briefcase className="text-orange-500" size={18} />
                Active Engagements
              </h2>
              <span className="text-[10px] md:text-xs font-black text-white/20 tracking-widest uppercase">
                {projects?.length} Total
              </span>
            </div>

            <div className="grid gap-4">
              {projects?.length > 0 ? (
                projects.map((project) => (
                  <motion.div
                    key={project._id}
                    whileHover={{ x: 5 }}
                    className="group bg-white/[0.02] border border-white/5 p-5 md:p-6 rounded-[1.5rem] md:rounded-[1.8rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-5 md:gap-6 hover:bg-white/[0.04] transition-all"
                  >
                    <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                      <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-white/5 flex items-center justify-center text-orange-500/60 shrink-0">
                        <Clock size={20} className="md:w-[24px] md:h-[24px]" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base md:text-lg font-bold text-white uppercase truncate">
                          {project.projectName}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-[9px] md:text-[10px] font-bold text-white/30 uppercase tracking-[0.1em]">
                          <span className="text-emerald-500/80">
                            Active Stage
                          </span>
                          <span className="h-1 w-1 bg-white/10 rounded-full" />
                          <span>Ref: {project._id.slice(-6)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full md:w-auto gap-4 md:gap-8 border-t border-white/5 md:border-0 pt-3 md:pt-0">
                      <div className="text-left md:text-right">
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-0.5">
                          Total Valuation
                        </p>
                        <p className="text-lg md:text-xl font-black text-orange-500 flex items-center md:justify-end gap-0.5">
                          <IndianRupee
                            size={14}
                            className="md:w-[16px] md:h-[16px]"
                            strokeWidth={3}
                          />
                          {project.clientBudget?.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          navigate(`/dashboard/viewProject/${project._id}`)
                        }
                        className="p-2.5 md:p-3 bg-white/5 rounded-xl text-white/20 hover:text-orange-500 hover:bg-orange-500/10 border border-transparent hover:border-orange-500/20 transition-all"
                      >
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-20 text-center border border-dashed border-white/5 rounded-[2rem] bg-white/[0.01]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/10">
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
