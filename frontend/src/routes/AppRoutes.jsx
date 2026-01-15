import { Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing.jsx";
import React from "react";
import Login from "../pages/Login.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
