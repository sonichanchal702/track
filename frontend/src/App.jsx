import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./Components/Landing.jsx";
import Login from "./Components/Login.jsx";
import WhyUs from "./Components/WhyUs.jsx";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { AppStore } from "./Store/AppStore.js";
import Dashboard from "./Components/Dashboard.jsx";

export default function App() {
  return (
    <Provider store={AppStore}>
      <Toaster position="top-middle" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/why-us" element={<WhyUs />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Provider>
  );
}
