import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  PanelLeftOpen,
  PanelRightClose,
  Eye,
  Banknote,
  File,
  Megaphone,
  Menu,
  Sparkles,
} from "lucide-react";
import { useSelector } from "react-redux";

/* ------------------ LAYOUT ------------------ */

const DashboardLayout = () => {
  const [open, setOpen] = useState(true);
  const agency = useSelector((s) => s.agency);

  return (
    <div className="flex min-h-screen bg-[#020202] text-white overflow-hidden font-sans">
      {/* SIDEBAR */}
      <motion.aside
        animate={{ width: open ? 260 : 76 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="relative z-50 h-screen bg-black/50 backdrop-blur-3xl border-r border-white/10 flex flex-col"
      >
        {/* HEADER */}
        <div className="h-20 px-4 flex items-center justify-between">
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-orange-500 text-black flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <span className="text-lg font-semibold">
                  Track<span className="text-orange-500">.</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg text-white/40 hover:text-orange-500 hover:bg-white/5 transition"
          >
            {open ? <PanelRightClose size={22} /> : <PanelLeftOpen size={22} />}
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-3 space-y-6">
          <SidebarSection open={open} title="Dashboard">
            <SidebarItem
              to="/dashboard"
              icon={<LayoutDashboard size={18} />}
              label="Overview"
              open={open}
              end
            />
          </SidebarSection>

          <SidebarSection open={open} title="Operations">
            <SidebarItem
              to="/dashboard/projects"
              icon={<Briefcase size={18} />}
              label="Projects"
              open={open}
            />
            <SidebarItem
              to="/dashboard/clients"
              icon={<Eye size={18} />}
              label="Clients"
              open={open}
            />
            <SidebarItem
              to="/dashboard/team"
              icon={<Users size={18} />}
              label="Team"
              open={open}
            />
          </SidebarSection>

          <SidebarDivider />

          <SidebarSection open={open} title="Finance">
            <SidebarItem
              to="/dashboard/income"
              icon={<Banknote size={18} />}
              label="Income"
              open={open}
            />
            <SidebarItem
              to="/dashboard/invoices"
              icon={<File size={18} />}
              label="Invoices"
              open={open}
            />
          </SidebarSection>

          <SidebarDivider />

          <SidebarSection open={open} title="Updates">
            <SidebarItem
              to="/dashboard/alerts"
              icon={<Megaphone size={18} />}
              label="Alerts"
              open={open}
            />
          </SidebarSection>
        </nav>

        {/* FOOTER */}
        <div className="p-3">
          <div
            className={`flex items-center rounded-xl p-3 bg-orange-500/10 transition-all
            ${open ? "gap-3 justify-start" : "justify-center"}`}
          >
            <div className="w-9 h-9 rounded-lg bg-orange-500 text-black flex items-center justify-center font-semibold">
              {agency?.name?.[0] || "A"}
            </div>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="text-sm font-medium truncate">{agency?.name}</p>
                  <p className="text-xs text-white/40">Agency</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

/* ------------------ SIDEBAR ITEM ------------------ */

const SidebarItem = ({ to, icon, label, open, end }) => (
  <NavLink to={to} end={end} className="block relative">
    {({ isActive }) => (
      <motion.div
        whileHover="hover"
        initial="rest"
        animate="rest"
        className={`relative flex items-center rounded-xl overflow-hidden
        ${open ? "px-3 py-2.5 gap-3" : "p-3 justify-center"}
        ${isActive ? "text-black" : "text-white/60"}`}
      >
        {/* MIRROR HOVER LAYER */}
        <motion.div
          variants={{
            rest: { opacity: 0, x: "-200%" },
            hover: { opacity: 1, x: "0%" },
          }}
          transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
          className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/20 to-white/5 backdrop-blur-xl"
        />

        {/* ACTIVE BG */}
        {isActive && (
          <motion.div
            layoutId="active-bg"
            className="absolute inset-0 bg-orange-500"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}

        {/* ICON */}
        <span className="relative z-10">{icon}</span>

        {/* TEXT */}
        <AnimatePresence>
          {open && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.25, delay: 0.08 }}
              className="relative z-10 text-sm font-medium"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    )}
  </NavLink>
);

/* ------------------ HELPERS ------------------ */

const SidebarSection = ({ title, open, children }) => (
  <div>
    <AnimatePresence>
      {open && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-xs text-white/30 font-medium px-3 mb-2"
        >
          {title}
        </motion.p>
      )}
    </AnimatePresence>
    <div className="space-y-1">{children}</div>
  </div>
);

const SidebarDivider = () => <div className="h-px bg-white/10 mx-2 my-4" />;

export default DashboardLayout;
