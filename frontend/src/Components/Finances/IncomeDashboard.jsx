import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  animate,
  useTransform,
} from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  IndianRupee,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
} from "lucide-react";
import { URL } from "../../Constants.js";

const Finance = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinances = async () => {
      try {
        const res = await axios.get(`${URL}/finances`, {
          withCredentials: true,
        });
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFinances();
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#020202]">
        <div className="w-10 h-10 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen px-6 lg:px-10 py-10 bg-[#020202] text-[#e5e5e5] space-y-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-3">
            <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Banknote size={22} className="text-emerald-500" />
            </span>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center">
              Finances <span className="text-orange-500">.</span>
            </h1>
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Revenue, expenses & liquidity summary
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
          <p className="text-xs text-white/40">Fiscal Period</p>
          <p className="text-sm font-medium">
            {new Date().toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FinanceCard
          title="Total Revenue"
          amount={data.income.total}
          monthly={data.income.thisMonth}
          icon={<TrendingUp />}
          color="52, 211, 153"
        />

        <FinanceCard
          title="Total Expenses"
          amount={data.expenses.total}
          monthly={data.expenses.thisMonth}
          icon={<TrendingDown />}
          color="248, 113, 113"
        />

        <FinanceCard
          title="Net Profit"
          amount={data.profit.total}
          monthly={data.profit.thisMonth}
          icon={<PieChart />}
          color="251, 191, 36"
        />
      </div>
    </div>
  );
};

/* ===== FINANCE CARD ===== */
const FinanceCard = ({ title, amount, monthly, icon, color }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const glow = useMotionTemplate`
    radial-gradient(300px circle at ${mouseX}px ${mouseY}px,
    rgba(${color},0.12), transparent 80%)
  `;

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="relative rounded-2xl bg-white/[0.03] border border-white/10 p-6 overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
        style={{ background: glow }}
      />

      <div className="relative space-y-5">
        <div className="flex justify-between items-start">
          <div
            className="p-3 rounded-xl bg-white/5"
            style={{ color: `rgb(${color})` }}
          >
            {React.cloneElement(icon, { size: 22 })}
          </div>

          <div className="text-right">
            <p className="text-xs text-white/40">This Month</p>
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                monthly >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {monthly >= 0 ? (
                <ArrowUpRight size={14} />
              ) : (
                <ArrowDownRight size={14} />
              )}
              ₹<AnimatedNumber value={Math.abs(monthly)} />
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm text-white/40">{title}</p>
          <div className="text-3xl font-semibold tracking-tight">
            ₹<AnimatedNumber value={amount} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ===== ANIMATED NUMBER ===== */
const AnimatedNumber = ({ value }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    const controls = animate(count, value || 0, {
      duration: 1.4,
      ease: "easeOut",
    });
    return controls.stop;
  }, [value]);

  return <motion.span>{rounded}</motion.span>;
};

export default Finance;
