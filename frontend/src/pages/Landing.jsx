import React from "react";

import Navbar from "../components/layout/Navbar.jsx";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <>
      <Navbar />
      <section className="min-h-screen flex items-center justify-center px-10 bg-slate-50">
        <div className="max-w-4xl text-center">
          <h1 className="text-5xl font-extrabold text-slate-900 leading-tight">
            Manage Freelance & Agency Projects
            <span className="text-orange-500"> Smarter</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600">
            Track workloads, deadlines, milestones, and team availability —
            all in one unified platform.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/signup"
              className="bg-orange-500 text-white px-6 py-3 rounded-xl text-lg hover:bg-orange-600"
            >
              Start Free
            </Link>
            <Link
              to="/login"
              className="border border-slate-300 px-6 py-3 rounded-xl text-lg hover:border-orange-500"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
