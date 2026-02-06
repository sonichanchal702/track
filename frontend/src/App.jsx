import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

import { AppStore } from "./Store/AppStore.js";

import Landing from "./Components/Landing.jsx";
import Login from "./Components/Login.jsx";
import WhyUs from "./Components/WhyUs.jsx";

// layout + pages
import Overview from "./Components/Layout/Overview.jsx";
import DashboardLayout from "./Components/Sidebar.jsx";
import Projects from "./Components/Projects.jsx";
import Clients from "./Components/Clients.jsx";
import ViewAProject from "./Components/ViewAProject.jsx";
import AddProject from "./Components/CreateProjects.jsx";
import ViewTeam from "./Components/ViewTeam.jsx";
import ViewAClient from "./Components/ViewAClient.jsx";
import EditProject from "./Components/EditProject.jsx";
import AddTeamMember from "./Components/AddATeamMember.jsx";
import EditTeamMember from "./Components/EditTeamMember.jsx";
import IncomeDashboard from "./Components/Finances/IncomeDashboard.jsx";
import Invoice from "./Components/Invoices/Invoice.jsx";

const ProtectedRoute = ({ children }) => {
  const agency = useSelector((store) => store.agency);
  return agency ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/why-us" element={<WhyUs />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="projects" element={<Projects />} />
        <Route path="viewProject/:id" element={<ViewAProject />} />
        <Route path="editProject/:id" element={<EditProject />} />
        <Route path="create-project" element={<AddProject />} />
        <Route path="clients" element={<Clients />} />
        <Route path="client/:clientId" element={<ViewAClient />} />
        <Route path="team" element={<ViewTeam />} />
        <Route path="addTeamMember" element={<AddTeamMember />} />
        <Route path="editTeam/:memberId" element={<EditTeamMember />} />

        {/* finances */}
        <Route path="income" element={<IncomeDashboard />} />
        <Route path="invoices" element={<Invoice />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Provider store={AppStore}>
      <Toaster position="top-center" />
      <AppRoutes />
    </Provider>
  );
}
