import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";
import { motion } from "framer-motion"; // Animations ke liye

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const agency = useSelector((s) => s.agency);

  return (
    <div className="flex min-h-screen bg-[#020202] text-white relative overflow-hidden">
      {/* ===== PREMIUM AMBIENT BACKGROUND LAYER ===== */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Animated Orange Glow (Top Left) */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.2, 0.15],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-orange-600 blur-[120px] rounded-full"
        />

        {/* Deep Purple Glow (Bottom Right) */}
        <div className="absolute bottom-[-5%] right-[-5%] w-[35%] h-[35%] bg-purple-900/20 blur-[140px] rounded-full" />

        {/* Subtle Cyan Hint (Center-Right) */}
        <div className="absolute top-[30%] right-[10%] w-[25%] h-[25%] bg-cyan-500/5 blur-[100px] rounded-full" />
      </div>
      {/* ===== CONTENT LAYOUT ===== */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        agency={agency}
      />

      {/* Main content area should be relative and z-10 to stay above glows */}
      <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
