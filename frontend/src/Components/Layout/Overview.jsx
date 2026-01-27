import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useMotionTemplate,
} from "framer-motion";
import {
  Users,
  Briefcase,
  Activity,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { URL } from "../../Constants.js";

const Overview = () => {
  const [data, setData] = useState({
    clients: { total: 0, change: 0 },
    projects: { total: 0, active: 0, change: 0 },
    team: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${URL}/overview`, {
          withCredentials: true,
        });
        setData({
          clients: res.data.clients,
          projects: res.data.projects,
          team: res.data.totalTeamMembers,
        });
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="px-10 py-8 space-y-10">
      {/* HEADER */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">
          System / Intelligence
        </p>
        <h1 className="text-2xl font-semibold text-white">Agency Overview</h1>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Clients"
          value={data.clients.total}
          change={data.clients.change}
          icon={<Users size={18} />}
          color="249, 115, 22"
        />
        <StatCard
          title="Projects"
          value={data.projects.total}
          change={data.projects.change}
          icon={<Briefcase size={18} />}
          color="6, 182, 212"
        />
        <StatCard
          title="Active"
          value={data.projects.active}
          icon={<Activity size={18} />}
          neutral
          color="168, 85, 247"
        />
        <StatCard
          title="Team"
          value={data.team}
          icon={<TrendingUp size={18} />}
          neutral
          color="34, 197, 94"
        />
      </div>

      {/* PLACEHOLDER */}
      <div className="rounded-[1.5rem] border border-dashed border-white/5 h-60 flex items-center justify-center bg-white/[0.01]">
        <p className="text-[10px] uppercase tracking-widest text-white/20">
          Data Pipeline Active
        </p>
      </div>
    </div>
  );
};

/* ===== STAT CARD ===== */
const StatCard = ({ title, value, change, icon, neutral, color }) => {
  const positive = change >= 0;
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const background = useMotionTemplate`
    radial-gradient(
      320px circle at ${mouseX}px ${mouseY}px,
      rgba(${color}, 0.15),
      transparent 80%
    )
  `;

  const borderOverlay = useMotionTemplate`
    radial-gradient(
      180px circle at ${mouseX}px ${mouseY}px,
      rgba(${color}, 0.45),
      transparent 80%
    )
  `;

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="group relative rounded-[1.5rem] p-[1px] overflow-hidden transition-all duration-500"
      style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
    >
      {/* GLOW */}
      <motion.div
        className="absolute inset-0 opacity-100 transition-opacity duration-500"
        style={{ background }}
      />
      <motion.div
        className="absolute inset-0 opacity-100 transition-opacity duration-500"
        style={{ background: borderOverlay }}
      />

      {/* CONTENT */}
      <div className="relative z-10 rounded-[1.5rem] bg-[#0a0a0a]/90 backdrop-blur-3xl p-6 border border-white/[0.05]">
        <div className="flex items-start justify-between mb-6">
          <div
            className="p-3 rounded-xl bg-white/[0.03]"
            style={{ color: `rgb(${color})` }}
          >
            {icon}
          </div>

          {!neutral && change !== undefined && (
            <div
              className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg ${
                positive
                  ? "text-green-500 bg-green-500/10"
                  : "text-red-500 bg-red-500/10"
              }`}
            >
              {positive ? (
                <ArrowUpRight size={14} />
              ) : (
                <ArrowDownRight size={14} />
              )}
              {Math.abs(change)}%
            </div>
          )}
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wide text-white/40 mb-1">
            {title}
          </p>
          <div className="text-3xl font-semibold text-white tabular-nums">
            <AnimatedNumber value={value || 0} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ===== COUNT UP ===== */
const AnimatedNumber = ({ value }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.4,
      ease: [0.32, 0.23, 0.4, 0.9],
    });
    return controls.stop;
  }, [value]);

  return <motion.span>{rounded}</motion.span>;
};

export default Overview;
