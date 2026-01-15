import React from "react";

import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
          Create Account
        </h2>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border px-4 py-3 rounded-lg focus:outline-orange-500"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border px-4 py-3 rounded-lg focus:outline-orange-500"
          />
          <select className="w-full border px-4 py-3 rounded-lg focus:outline-orange-500">
            <option value="">Select Role</option>
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
            <option value="agency">Agency Owner</option>
          </select>
          <input
            type="password"
            placeholder="Password"
            className="w-full border px-4 py-3 rounded-lg focus:outline-orange-500"
          />
          <button className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600">
            Sign Up
          </button>
        </form>


        <p className="mt-4 text-center text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-500 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
