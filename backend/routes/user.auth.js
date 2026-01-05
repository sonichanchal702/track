import express from "express";
import { signup, login, logout } from "../controllers/user.auth.controller.js";
import { userAuth } from "../middlewares/user.middleware.js";
import { addTeamMember } from "../controllers/addTeamMember.js";
import { viewTeam } from "../controllers/user.getTeam.js";
import { editTeam } from "../controllers/editTeam.js";
import { getTeamById} from "../controllers/user.getTeamById.js";
import {deleteTeamById} from "../controllers/user.deleteTeamById.js";


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/add-new-member", userAuth, addTeamMember);
router.get("/view-team", userAuth, viewTeam);
router.patch("/edit-team/:id", userAuth, editTeam);
router.get("/team/:id", userAuth, getTeamById);
router.delete("/team/:id", userAuth, deleteTeamById);

export default router;
