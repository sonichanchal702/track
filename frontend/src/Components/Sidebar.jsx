import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";
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
  Sparkles,
  LogOut,
  Menu,
  X,
  UserCog,
  Settings,
  Bell,
  MessageSquare,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { URL } from "../Constants.js";
import toast from "react-hot-toast";
import { removeAgency } from "../Store/agencySlice";

const DashboardLayout = () => {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const agency = useSelector((s) => s.agency);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    setMenuOpen(false);
    try {
      await axios.post(URL + "/logout");
      toast.success("Identity Secured.");
      dispatch(removeAgency());
      navigate("/");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="flex h-screen bg-[#020202] text-[#e5e5e5] overflow-hidden font-medium ">
      {/* MOBILE TRIGGER */}
      <div className="lg:hidden fixed top-4 left-4 z-[100]">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-orange-500 backdrop-blur-xl active:scale-90 transition-all"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* MOBILE FULLSCREEN MENU - FIXED HEIGHT & SECTIONS */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[110] bg-[#050505] flex flex-col lg:hidden h-[100dvh]"
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500 text-black flex items-center justify-center shadow-lg">
                  <Sparkles size={16} />
                </div>
                <span className="text-xl font-[900]   uppercase tracking-tight text-white">
                  Track<span className="text-orange-500">.</span>
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 bg-white/5 rounded-lg text-white/40"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Nav - Scrollable Area */}
            <nav className="flex-1 px-6 py-4 space-y-6 overflow-y-auto no-scrollbar">
              <SidebarSection open={true} title="Operations">
                <SidebarItem
                  to="/dashboard"
                  icon={<LayoutDashboard size={20} />}
                  label="Overview"
                  open={true}
                  end
                />
                <SidebarItem
                  to="/dashboard/projects"
                  icon={<Briefcase size={20} />}
                  label="Projects"
                  open={true}
                />
                <SidebarItem
                  to="/dashboard/clients"
                  icon={<Eye size={20} />}
                  label="Clients"
                  open={true}
                />
                <SidebarItem
                  to="/dashboard/team"
                  icon={<Users size={20} />}
                  label="Team"
                  open={true}
                />
              </SidebarSection>

              <SidebarSection open={true} title="Financials">
                <SidebarItem
                  to="/dashboard/income"
                  icon={<Banknote size={20} />}
                  label="Income"
                  open={true}
                />
                <SidebarItem
                  to="/dashboard/invoices"
                  icon={<File size={20} />}
                  label="Invoices"
                  open={true}
                />
              </SidebarSection>

              <SidebarSection open={true} title="Intelligence">
                <SidebarItem
                  to="/dashboard/alerts"
                  icon={<Bell size={20} />}
                  label="Alerts"
                  open={true}
                />
              </SidebarSection>
            </nav>

            {/* Mobile Bottom Profile - Always Visible */}
            <div className="p-6 border-t border-white/5 bg-black/20 shrink-0">
              <ProfileSection
                open={true}
                agency={agency}
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
                handleLogout={handleLogout}
                isMobile={true}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <motion.aside
        animate={{ width: open ? 240 : 84 }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
        className="hidden lg:flex relative z-50 h-screen bg-[#050505] border-r border-white/5 flex-col shadow-2xl"
      >
        <div className="h-20 px-6 flex items-center shrink-0">
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div
                key="f"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-500 text-black flex items-center justify-center shadow-lg">
                  <Sparkles size={16} />
                </div>
                <span className="text-xl font-[900]   uppercase tracking-tighter text-white leading-none">
                  Track<span className="text-orange-500">.</span>
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="s"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mx-auto w-10 h-10 rounded-xl bg-orange-500 text-black flex items-center justify-center shadow-lg"
              >
                <Sparkles size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 px-3 space-y-6 mt-2 overflow-y-auto no-scrollbar pb-4">
          <SidebarSection open={open} title="Operations">
            <SidebarItem
              to="/dashboard"
              icon={<LayoutDashboard size={18} />}
              label="Overview"
              open={open}
              end
            />
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

          <SidebarSection open={open} title="Intelligence">
            <SidebarItem
              to="/dashboard/alerts"
              icon={<Bell size={18} />}
              label="Alerts"
              open={open}
            />
          </SidebarSection>

          <SidebarSection open={open} title="Financials">
            <SidebarItem
              to="/dashboard/income"
              icon={<Banknote size={18} />}
              label="Inflow"
              open={open}
            />
            <SidebarItem
              to="/dashboard/invoices"
              icon={<File size={18} />}
              label="Ledger"
              open={open}
            />
          </SidebarSection>
        </nav>

        <div className="p-3 border-t border-white/[0.03] shrink-0">
          <ProfileSection
            open={open}
            agency={agency}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            handleLogout={handleLogout}
          />
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="absolute -right-3 top-10 w-6 h-6 bg-orange-500 text-black rounded-full flex items-center justify-center border-4 border-[#020202] hover:scale-110 transition-all z-[100]"
        >
          {open ? <PanelRightClose size={12} /> : <PanelLeftOpen size={12} />}
        </button>
      </motion.aside>

      <main className="flex-1 overflow-y-auto relative bg-[#020202]">
        <Outlet />
      </main>
    </div>
  );
};

/* ---------------- PROFILE NODE ---------------- */

const ProfileSection = ({
  open,
  agency,
  menuOpen,
  setMenuOpen,
  handleLogout,
  isMobile,
}) => (
  <div className="relative">
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-[140] bg-black/40 backdrop-blur-sm lg:bg-transparent"
        />
      )}
    </AnimatePresence>

    <motion.button
      whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setMenuOpen(!menuOpen)}
      className={`relative z-[145] w-full flex items-center rounded-xl p-2 transition-all
      ${open ? "gap-3 px-3 bg-white/[0.02] border border-white/5" : "justify-center"}`}
    >
      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-orange-700 text-black flex items-center justify-center font-medium text-sm shadow-lg shrink-0">
        {agency?.name?.[0] || "A"}
      </div>
      {open && (
        <div className="text-left overflow-hidden">
          <p className="text-xs font-medium text-white truncate uppercase tracking-tight leading-none mb-1">
            {agency?.name}
          </p>
          <p className="text-[10px] text-white/20 font-medium uppercase tracking-widest">
            Master Identity
          </p>
        </div>
      )}
    </motion.button>

    <AnimatePresence>
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: isMobile ? -10 : 10 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95, y: isMobile ? -10 : 10 }}
          className={`absolute z-[150] bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl 
          ${isMobile ? "bottom-16 left-0 right-0 mb-2" : open ? "bottom-16 left-0 right-0" : "bottom-16 left-14 w-48"}`}
        >
          <div className="p-1.5 space-y-0.5">
            <PopoverItem
              label="Edit Profile"
              icon={<UserCog size={14} />}
              onClick={() => setMenuOpen(false)}
            />
            <PopoverItem
              label="Give a feedback"
              icon={<MessageSquare size={14} />}
              onClick={() => setMenuOpen(false)}
            />
            <div className="h-px bg-white/5 mx-2 my-1" />
            <PopoverItem
              label="Logout"
              icon={<LogOut size={14} />}
              onClick={handleLogout}
              danger
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const SidebarItem = ({ to, icon, label, open, end }) => {
  return (
    <NavLink to={to} end={end} className="block relative px-3 py-1">
      {({ isActive }) => (
        <div className="relative flex items-center group">
          {/* 🟢 ACTIVE INDICATOR (Vertical Line) */}
          {isActive && (
            <motion.div
              layoutId="active-line"
              className="absolute left-[-12px] w-[3px] h-5 bg-orange-500 rounded-full z-20"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}

          <motion.div
            className={`
              relative flex items-center w-full rounded-lg transition-all duration-200
              ${open ? "px-3 py-2 gap-3" : "p-2.5 justify-center"}
              ${
                isActive
                  ? "bg-orange-500/10 text-orange-500"
                  : "text-white/40 hover:bg-white/[0.03] hover:text-white"
              }
            `}
          >
            {/* 🛠️ ICON: Subtle Scale on Hover */}
            <div
              className={`
              relative z-10 transition-transform duration-200 
              ${!isActive && "group-hover:scale-110 group-active:scale-95"}
            `}
            >
              {React.cloneElement(icon, {
                size: 20,
                strokeWidth: isActive ? 2.5 : 2,
              })}
            </div>

            {/* 📝 LABEL: Clean Typography */}
            <AnimatePresence mode="wait">
              {open && (
                <motion.span
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  transition={{ duration: 0.15 }}
                  className={`
                    text-sm font-bold tracking-tight uppercase italic
                    ${isActive ? "text-white" : "text-inherit"}
                  `}
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>

            {/* ⚡ ACTIVE GLOW (Very Subtle) */}
            {isActive && (
              <motion.div
                layoutId="active-glow"
                className="absolute inset-0 bg-orange-500/[0.03] rounded-lg border border-orange-500/20"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.div>

          {/* 💡 TOOLTIP (Minimalist) */}
          {!open && (
            <div className="absolute left-full ml-4 px-3 py-1.5 bg-[#111] border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-md opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-200 pointer-events-none whitespace-nowrap z-[100] shadow-2xl">
              {label}
            </div>
          )}
        </div>
      )}
    </NavLink>
  );
};

const SidebarSection = ({ title, open, children }) => (
  <div className="space-y-5">
    {open && (
      <p className="text-[10px] text-white/50 font-medium uppercase tracking-[0.2em] px-4">
        {title}
      </p>
    )}
    <div className="space-y-0.5">{children}</div>
  </div>
);

const PopoverItem = ({ label, icon, onClick, danger }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 text-[11px] font-medium uppercase tracking-widest rounded-lg transition-all ${danger ? "text-red-500 hover:bg-red-500/10" : "text-white/40 hover:bg-white/5 hover:text-white"}`}
  >
    {icon} <span>{label}</span>
  </button>
);

export default DashboardLayout;
