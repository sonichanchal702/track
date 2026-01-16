import express from "express";
import Project from "../models/project.schema.js";
import Client from "../models/client.schema.js";
import Team from "../models/team.schema.js";
import { getDateRanges, percentageChange } from "../config/helpersFunc.js";

const router = express.Router();

export const overview = async (req, res) => {
  try {
    const agencyId = req.user.id;

    const { startOfThisMonth, startOfLastMonth } = getDateRanges();

    const totalProjects = await Project.countDocuments({ createdBy: agencyId });

    const activeProjects = await Project.countDocuments({
      createdBy: agencyId,
      projectStatus: "active",
    });

    const currentMonthProjects = await Project.countDocuments({
      createdBy: agencyId,
      createdAt: { $gte: startOfThisMonth },
    });

    const lastMonthProjects = await Project.countDocuments({
      createdBy: agencyId,
      createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth },
    });

    const projectChange = percentageChange(
      currentMonthProjects,
      lastMonthProjects
    );

    // -------- CLIENTS --------
    const totalClients = await Client.countDocuments({ userId: agencyId });

    const currentMonthClients = await Client.countDocuments({
      userId: agencyId,
      createdAt: { $gte: startOfThisMonth },
    });

    const lastMonthClients = await Client.countDocuments({
      userId: agencyId,
      createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth },
    });

    const clientChange = percentageChange(
      currentMonthClients,
      lastMonthClients
    );
    // ------------ TEAM----------------
    const totalTeam = await Team.countDocuments({
      agencyId,
    });

    // -------- FINAL RESPONSE --------
    res.json({
      projects: {
        total: totalProjects,
        active: activeProjects,
        change: projectChange,
      },
      clients: {
        total: totalClients,
        change: clientChange,
      },
      totalTeamMembers: totalTeam,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Dashboard overview failed" });
  }
};

export default router;
