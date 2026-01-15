import React from "react";

import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
          Welcome Back
        </h2>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border px-4 py-3 rounded-lg focus:outline-orange-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border px-4 py-3 rounded-lg focus:outline-orange-500"
          />
          <button className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600">
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-slate-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-orange-500 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
