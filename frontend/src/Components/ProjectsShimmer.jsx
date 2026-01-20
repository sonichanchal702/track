import React from "react";
import { motion } from "framer-motion";

const ShimmerProjects = () => {
  const skeletonCards = Array(10).fill(0);

  return (
    <div className="space-y-4 w-full">
      {skeletonCards.map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * 0.05,
            duration: 0.5,
          }}
          className="relative bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 flex flex-col lg:flex-row items-center justify-between gap-8 overflow-hidden"
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent z-0"
          />

          <div className="flex items-center gap-6 flex-1 min-w-0 z-10 w-full lg:w-auto">
            {/* Project Icon Circle */}
            <div className="w-14 h-14 rounded-2xl bg-white/[0.05] shrink-0" />

            {/* Project Title & Client Name */}
            <div className="space-y-3 w-full max-w-[200px]">
              <div className="h-4 bg-white/[0.05] rounded-lg w-full" />
              <div className="h-3 bg-white/[0.05] rounded-md w-2/3" />
            </div>
          </div>

          {/* CENTER - Horizontal Info Row Skeleton */}
          <div className="flex flex-row flex-wrap items-center justify-between lg:justify-start gap-10 lg:gap-16 flex-[2] z-10 w-full lg:w-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-2 min-w-[100px]">
                {/* Label (Budget/Deadline/Assignee) */}
                <div className="h-2 bg-white/[0.03] rounded-md w-12" />
                {/* Value */}
                <div className="h-4 bg-white/[0.05] rounded-md w-24" />
              </div>
            ))}
          </div>

          {/* RIGHT - Action Button Skeleton */}
          <div className="w-14 h-14 rounded-2xl bg-white/[0.05] shrink-0 z-10 hidden lg:block" />
        </motion.div>
      ))}
    </div>
  );
};

export default ShimmerProjects;
