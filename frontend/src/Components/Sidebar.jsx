import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
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
  Sparkles,
  LogOut,
  Menu,
  X,
  UserCog,
  Settings,
  Bell,
  MessageSquare,
  User,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { URL } from "../Constants.js";
import toast from "react-hot-toast";
import { removeAgency } from "../Store/agencySlice";

const sidebarTransition = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1,
};

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
      toast.success("Logged out");
      dispatch(removeAgency());
      navigate("/");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="flex h-screen bg-[#020202] text-[#e5e5e5] overflow-hidden font-sans selection:bg-orange-500/30">
      {/* 📱 MOBILE OVERLAY & MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[110] bg-[#050505] flex flex-col lg:hidden h-[100dvh]"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-black flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <Sparkles size={20} />
                </div>
                <span className="text-xl  font-medium text-bold  uppercase tracking-tighter text-white">
                  Track<span className="text-orange-500">.</span>
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-3 bg-white/5 rounded-xl text-white/60"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 p-6 space-y-8 overflow-y-auto no-scrollbar">
              <SidebarSection open={true} title="Operations">
                <SidebarItem
                  to="/dashboard"
                  icon={<LayoutDashboard />}
                  label="Overview"
                  open={true}
                  end
                />
                <SidebarItem
                  to="/dashboard/projects"
                  icon={<Briefcase />}
                  label="Projects"
                  open={true}
                />
                <SidebarItem
                  to="/dashboard/clients"
                  icon={<Eye />}
                  label="Clients"
                  open={true}
                />
                <SidebarItem
                  to="/dashboard/team"
                  icon={<Users />}
                  label="Team"
                  open={true}
                />
              </SidebarSection>

              <SidebarSection open={true} title="Finance">
                <SidebarItem
                  to="/dashboard/income"
                  icon={<Banknote />}
                  label="Income"
                  open={true}
                />
                <SidebarItem
                  to="/dashboard/invoices"
                  icon={<File />}
                  label="Invoices"
                  open={true}
                />
              </SidebarSection>

              <SidebarSection open={true} title="Intelligence">
                <SidebarItem
                  to="/dashboard/alerts"
                  icon={<Bell />}
                  label="Alerts"
                  open={true}
                />
              </SidebarSection>
            </nav>

            <div className="p-6 border-t border-white/5 bg-black/20">
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

      {/* 🖥️ DESKTOP SIDEBAR */}
      <motion.aside
        initial={false}
        animate={{ width: open ? 260 : 88 }}
        transition={sidebarTransition}
        className="hidden lg:flex relative z-50 h-screen bg-[#050505] border-r border-white/5 flex-col shrink-0 overflow-hidden"
      >
        {/* LOGO SECTION */}
        <div className="h-24 flex items-center px-6 shrink-0 relative overflow-hidden">
          <div className="flex items-center gap-4">
            {/* Icon always stays in place */}
            <motion.div
              layout
              className="w-10 h-10 rounded-2xl bg-orange-500 text-black flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0 z-20"
            >
              <Sparkles size={20} />
            </motion.div>

            {/* Text Fades In/Out */}
            <AnimatePresence>
              {open && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-xl  font-medium   uppercase tracking-tighter whitespace-nowrap text-white"
                >
                  Track<span className="text-orange-500">.</span>
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 space-y-8 mt-2 overflow-y-auto no-scrollbar overflow-x-hidden pb-10">
          <SidebarSection open={open} title="Dashboard">
            <SidebarItem
              to="/dashboard"
              icon={<LayoutDashboard />}
              label="Overview"
              open={open}
              end
            />
            <SidebarItem
              to="/dashboard/projects"
              icon={<Briefcase />}
              label="Projects"
              open={open}
            />
            <SidebarItem
              to="/dashboard/clients"
              icon={<Eye />}
              label="Clients"
              open={open}
            />
            <SidebarItem
              to="/dashboard/team"
              icon={<Users />}
              label="Team"
              open={open}
            />
          </SidebarSection>

          <SidebarSection open={open} title="Finances">
            <SidebarItem
              to="/dashboard/income"
              icon={<Banknote />}
              label="Income"
              open={open}
            />
            <SidebarItem
              to="/dashboard/invoices"
              icon={<File />}
              label="Invoices"
              open={open}
            />
          </SidebarSection>

          {/* ALERTS AT THE END */}
          <SidebarSection open={open} title="System">
            <SidebarItem
              to="/dashboard/alerts"
              icon={<Bell />}
              label="Alerts"
              open={open}
            />
          </SidebarSection>
        </nav>

        {/* PROFILE SECTION */}
        <div className="p-4 border-t border-white/5 shrink-0 bg-[#050505]">
          <ProfileSection
            open={open}
            agency={agency}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            handleLogout={handleLogout}
          />
        </div>

        {/* TOGGLE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="absolute -right-3 top-10 w-6 h-6 bg-orange-500 text-black rounded-full flex items-center justify-center border-4 border-[#020202] hover:scale-125 transition-all shadow-xl z-[100]"
        >
          {open ? (
            <PanelRightClose size={12} strokeWidth={3} />
          ) : (
            <PanelLeftOpen size={12} strokeWidth={3} />
          )}
        </button>
      </motion.aside>

      {/* MOBILE TRIGGER */}
      <div className="lg:hidden fixed top-4 left-4 z-[100]">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-3 bg-white/5 border border-white/10 rounded-2xl text-orange-500 backdrop-blur-xl active:scale-90 transition-all"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative bg-[#020202] pt-16 lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
};

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
          className="fixed  inset-0 z-[140] bg-transparent cursor-default"
        />
      )}
    </AnimatePresence>

    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={() => setMenuOpen(!menuOpen)}
      className={`relative z-[145] bg-orange-500/10 border-orange-500/20 w-full  flex items-center rounded-2xl p-2 transition-all border  hover:border-white/10 overflow-hidden
      ${open ? "gap-3" : "justify-center"}`}
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 text-black flex items-center justify-center  font-bold text-lg shadow-lg shrink-0">
        {agency?.name?.[0] || "A"}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="text-left overflow-hidden whitespace-nowrap min-w-0"
          >
            <p className="text-sm  font-bold text-white truncate tracking-tighter leading-none mb-1">
              {agency?.name}
            </p>
            <p className="text-[12px] text-white/80  font-medium tracking-widest">
              {agency?.email}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>

    <AnimatePresence>
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={`absolute z-[150] bg-[#0d0d0d] border border-white/10 rounded-[1rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)]
          ${isMobile ? "bottom-20 left-0 right-0" : open ? "bottom-20 left-0 right-0" : "bottom-20 left-14 w-56"}`}
        >
          <div className="p-2 space-y-1">
            <PopoverItem
              label="View Profile"
              icon={<UserCog size={16} />}
              onClick={() => setMenuOpen(false)}
            />
            <PopoverItem
              label="Give Suggestions"
              icon={<MessageSquare size={16} />}
              onClick={() => setMenuOpen(false)}
            />
            <div className="h-px bg-white/5 mx-3 my-1" />
            <PopoverItem
              label="Logout"
              icon={<LogOut size={16} />}
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
  const [hovered, setHovered] = useState(false);

  return (
    <NavLink to={to} end={end} className="block relative">
      {({ isActive }) => (
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="relative group h-12 flex items-center" // Fixed height container
        >
          {/* Active Indicator Line */}
          {isActive && (
            <motion.div
              layoutId="active-line"
              className="absolute -left-4 w-1 h-6 bg-orange-500 rounded-r-full z-20"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}

          <div
            className={`
            relative flex items-center w-full h-full rounded-xl transition-all duration-300 overflow-hidden
            ${isActive ? "bg-orange-500/10 text-orange-500" : "text-white/40 hover:bg-white/[0.03] hover:text-white"}
          `}
          >
            <div className="w-[56px] h-full flex items-center justify-center shrink-0">
              <motion.div
                animate={
                  !isActive && hovered
                    ? { scale: 1.15 }
                    : { scale: 1, rotate: 0 }
                }
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                {React.cloneElement(icon, {
                  size: 20,
                  strokeWidth: isActive ? 2.5 : 2,
                })}
              </motion.div>
            </div>

            {/* 📝 LABEL CONTAINER: Animated Width/Opacity */}
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  <span className="text-[13px] font-[700] font-medium uppercase tracking-wider  ">
                    {label}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {isActive && (
              <motion.div
                layoutId="glow"
                className="absolute inset-0 bg-orange-500/[0.02] border border-orange-500/10 rounded-xl pointer-events-none"
              />
            )}
          </div>

          {/* 💡 MINI TOOLTIP (Only visible when sidebar closed) */}
          {!open && hovered && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.9 }}
              animate={{ opacity: 1, x: 20, scale: 1 }}
              className="fixed left-20 px-3 py-1.5 bg-orange-500 text-black text-[10px]  font-medium uppercase tracking-widest rounded-lg shadow-2xl   whitespace-nowrap z-[200] pointer-events-none"
            >
              {label}
              <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-orange-500 rotate-45 rounded-[1px]" />
            </motion.div>
          )}
        </div>
      )}
    </NavLink>
  );
};

const SidebarSection = ({ title, open, children }) => (
  <div className="space-y-2">
    <div
      className={`h-4 flex items-center px-4 mb-2 transition-all duration-300 ${open ? "opacity-100" : "opacity-0"}`}
    >
      <p className="text-[10px] text-white/60  font-medium uppercase tracking-[0.1rem] whitespace-nowrap overflow-hidden">
        {title}
      </p>
    </div>
    <div className="space-y-1">{children}</div>
  </div>
);

const PopoverItem = ({ label, icon, onClick, danger }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 text-[10px]  font-medium uppercase tracking-widest rounded-xl transition-all
    ${danger ? "text-red-500 hover:bg-red-500/10" : "text-white/80 hover:bg-white/5 hover:text-white"}`}
  >
    {icon} <span>{label}</span>
  </button>
);

export default DashboardLayout;
