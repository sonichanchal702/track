import express from "express";
import { signup, login, logout } from "../controllers/user.auth.controller.js";
import { userAuth } from "../middlewares/user.middleware.js";

//Team routes
import { addTeamMember } from "../controllers/addTeamMember.js";
import { viewTeam } from "../controllers/user.getTeam.js";
import { editTeam } from "../controllers/editTeam.js";
import { getTeamById } from "../controllers/user.getTeamById.js";
import { deleteTeam } from "../controllers/user.deleteTeamById.js";

//Project routes
import { createProject } from "../controllers/project.create.js";
import {assignMember} from "../controllers/user.assignTask.js";
import { getProjectById } from "../controllers/project.getById.js";
import { completeProject } from "../controllers/project.complete.js";
import { deleteProject } from "../controllers/project.delete.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

//team routes
router.post("/add-new-member", userAuth, addTeamMember);
router.get("/view-team", userAuth, viewTeam);
router.patch("/edit-team/:id", userAuth, editTeam);
router.get("/team/:id", userAuth, getTeamById);
router.delete("/team/:id", userAuth, deleteTeam);

//project routes
router.post("/createProject", userAuth, createProject);
router.patch("/projects/:id/ assign-team", userAuth, assignMember);
router.get("/projects/:id", userAuth, getProjectById);
router.patch("/projects/:id/complete", userAuth, completeProject);
router.delete("/projects/:id", userAuth, deleteProject);


export default router;
