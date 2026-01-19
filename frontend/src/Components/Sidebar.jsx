import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Eye,
  Activity,
  TrendingUp,
  Bell,
  Search,
  Menu,
  Sparkles,
  ChevronRight,
  Banknote,
  File,
  Megaphone,
} from "lucide-react";
import { useSelector } from "react-redux";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const agency = useSelector((store) => store.agency);

  return (
    <div className="flex min-h-screen bg-[#020202] text-[#e5e5e5] font-sans overflow-hidden">
      {/* BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[25%] w-[40%] h-[40%] bg-orange-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-orange-500/20 blur-[120px]" />
      </div>

      {/* SIDEBAR */}
      <motion.aside
        animate={{ width: isSidebarOpen ? 280 : 90 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-black/40 backdrop-blur-3xl border-r border-white/5 flex flex-col h-screen z-50"
      >
        {/* LOGO */}
        <div className="h-20 px-6 flex items-center justify-between">
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
                  <Sparkles size={18} className="text-black" />
                </div>
                <span className="text-lg font-semibold">
                  Track<span className="text-orange-500">.</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-orange-500"
          >
            <Menu size={18} />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
          {/* DASHBOARD */}
          <SidebarCategory title="Dashboard" open={isSidebarOpen}>
            <SidebarLink
              to="/dashboard"
              icon={<LayoutDashboard size={18} />}
              label="Overview"
              open={isSidebarOpen}
              end
            />
          </SidebarCategory>
          {/* OPERATIONS */}
          <SidebarCategory title="Operations" open={isSidebarOpen}>
            <SidebarLink
              to="/dashboard/projects"
              icon={<Briefcase size={18} />}
              label="Projects"
              open={isSidebarOpen}
            />
            <SidebarLink
              to="/dashboard/clients"
              icon={<Eye size={18} />}
              label="Clients"
              open={isSidebarOpen}
            />
            <SidebarLink
              to="/dashboard/team"
              icon={<Users size={18} />}
              label="Team Pool"
              open={isSidebarOpen}
            />
          </SidebarCategory>
          {/* FINANCE */}
          <SidebarCategory title="Finance" open={isSidebarOpen}>
            <SidebarLink
              to="/dashboard/income"
              icon={<Banknote size={18} />}
              label="Income"
              open={isSidebarOpen}
            />
            <SidebarLink
              to="/dashboard/invoices"
              icon={<File size={18} />}
              label="Invoices"
              open={isSidebarOpen}
            />
          </SidebarCategory>

          <SidebarCategory title="Updates" open={isSidebarOpen}>
            <SidebarLink
              to="/dashboard/alerts"
              icon={<Megaphone size={18} />}
              label="Alerts"
              open={isSidebarOpen}
            />
          </SidebarCategory>
        </nav>

        {/* AGENCY */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 bg-white/[0.04] p-3 rounded-xl">
            <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center text-black font-semibold">
              {agency?.name?.[0] || "A"}
            </div>
            {isSidebarOpen && (
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{agency?.name}</p>
                <p className="text-xs text-white/40">Agency</p>
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 px-10 flex items-center justify-between border-b border-white/5 bg-[#020202]/60 backdrop-blur-xl">
          <div>
            <h2 className="text-lg font-semibold">
              Welcome, <span className="text-orange-500">{agency?.name}</span>
            </h2>
            <p className="text-xs text-white/40">Overview</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <Search
                size={14}
                className="absolute left-3 top-2.5 text-white/30"
              />
              <input className="bg-white/[0.04] border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm outline-none w-56" />
            </div>
            <button className="p-2.5 bg-white/[0.04] rounded-lg border border-white/10">
              <Bell size={18} />
            </button>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
};

/* CATEGORY */
const SidebarCategory = ({ title, open, children }) => (
  <div>
    {open && (
      <p className="text-xs text-white/30 font-medium px-3 mb-2">{title}</p>
    )}
    <div className="space-y-1">{children}</div>
  </div>
);

/* LINK */
const SidebarLink = ({ to, icon, label, open, end = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
      ${isActive ? "text-black" : "text-white/60 hover:bg-white/[0.04] hover:text-white"}`
    }
  >
    {({ isActive }) => (
      <>
        <span className="z-10">{icon}</span>

        {open && <span className="z-10 text-sm font-medium">{label}</span>}

        {isActive && (
          <motion.div
            layoutId="sidebar-active"
            className="absolute inset-0 bg-orange-500 rounded-xl z-0"
          />
        )}

        {isActive && open && (
          <ChevronRight size={14} className="ml-auto z-10" />
        )}
      </>
    )}
  </NavLink>
);

export default DashboardLayout;
