import { Link } from "react-router-dom";
import React from "react";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-slate-200 bg-white">
      <h1 className="text-2xl font-bold text-slate-900">
        TRACK<span className="text-orange-500">.</span>
      </h1>

      <div className="space-x-4">
        <Link to="/login" className="text-slate-700 hover:text-orange-500">
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}
