import express from "express";
import { signup, login, logout } from "../controllers/user.auth.controller.js";
import { userAuth } from "../middlewares/user.middleware.js";

//Team routes
import { addTeamMember } from "../controllers/addTeamMember.js";
import { getAllTeamMembers } from "../controllers/getAllTeamMembers.js";
import { editTeam } from "../controllers/editTeam.js";
import { getTeamById } from "../controllers/user.getTeamById.js";
import { deleteTeam } from "../controllers/user.deleteTeamById.js";

//Project routes
import { createProject } from "../controllers/project.create.js";
import { assignMember } from "../controllers/user.assignTask.js";
import { getProjectById } from "../controllers/project.getById.js";
import { completeProject } from "../controllers/project.complete.js";
import { deleteProject } from "../controllers/project.delete.js";
import { generateLinks } from "../controllers/updatesAndFeedback/generateLinks.js";
import { getFreelancerProject } from "../controllers/updatesAndFeedback/getFreelancerToken.js";
import { freelancerPostUpdate } from "../controllers/updatesAndFeedback/freelancerPostUpdate.js";
import { getClientToken } from "../controllers/updatesAndFeedback/getClientToken.js";
import { clientPostFeedback } from "../controllers/updatesAndFeedback/clientPostFeedback.js";
import { getProjectTimeline } from "../controllers/updatesAndFeedback/timeline.js";
import { getAlerts } from "../controllers/CronJobs/getAlerts.js";
import { readAlert } from "../controllers/CronJobs/readAlerts.js";
import { getFreelancerTimeline } from "../controllers/updatesAndFeedback/getFreelancerTimeline.js";
import { getClientTimeline } from "../controllers/updatesAndFeedback/getClientTimeline.js";
import { getProjects } from "../controllers/getAllProjects.js";
import { createInvoice } from "../controllers/Invoices/createInvoice.js";
import { downloadInvoice } from "../controllers/Invoices/downloadInvoice.js";
import { markInvoicePaid } from "../controllers/Invoices/markInvoicePaid.js";
import { overview } from "../controllers/overview.js";
import { getClients } from "../controllers/getClients.js";
import { viewAClient } from "../controllers/viewAClient.js";
import { editProject } from "../controllers/EditAProject.js";
import { finances } from "../controllers/Finances/finance.js";
import { getAllInvoices } from "../controllers/Invoices/viewInvoices.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Team routes
router.post("/add-new-member", userAuth, addTeamMember);
router.get("/team", userAuth, getAllTeamMembers);
router.get("/team/:id", userAuth, getTeamById);
router.patch("/edit-team/:id", userAuth, editTeam);
router.delete("/delete-team/:id", userAuth, deleteTeam);

//project routes
router.post("/createProject", userAuth, createProject);
router.get("/projects", userAuth, getProjects);
router.patch("/projects/:id/assign-team", userAuth, assignMember);
router.get("/projects/:id", userAuth, getProjectById);
router.patch("/projects/:id/complete", userAuth, completeProject);
router.delete("/projects/:id", userAuth, deleteProject);
router.patch("/edit/project/:id", userAuth, editProject);

router.get("/clients", userAuth, getClients);
router.get("/client/:id", userAuth, viewAClient);

//project Updates/feedbacks/timelines
router.post("/projects/:id/generate-links", userAuth, generateLinks); //token generate hote hai
router.get("/freelancer/project/:token", getFreelancerProject); //freelancer ke token se project find
router.get("/client/project/:token", getClientToken); //client ke token se projectFind
router.post("/freelancer/project/:token/update", freelancerPostUpdate); //freelancer post update
router.post("/client/project/:token/feedback", clientPostFeedback); //client post updates

//project timeline
router.get("/project/:id/timeline", userAuth, getProjectTimeline);
router.get("/freelancer/project/:token/timeline", getFreelancerTimeline);
router.get("/client/project/:token/timeline", getClientTimeline);

//cronJobs
router.get("/alerts", userAuth, getAlerts);
router.patch("/alerts/:id/read", userAuth, readAlert);

//invoice
router.post("/create-invoice", userAuth, createInvoice);
router.get("/invoices", userAuth, getAllInvoices);
router.get("/invoices/:id/download", userAuth, downloadInvoice);
router.patch("/invoices/:id/paid", userAuth, markInvoicePaid);

//overview
router.get("/overview", userAuth, overview);

//finance
router.get("/finances", userAuth, finances);

export default router;
