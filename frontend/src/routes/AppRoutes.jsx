import { Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing.jsx";
import React from "react";
import Login from "../pages/Login.jsx";
import WhyUs from "../pages/WhyUs.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/why-us" element={<WhyUs />} />
    </Routes>
  );
}
