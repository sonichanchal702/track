import Project from "../../models/project.schema.js";
import { getProjectTimeline } from "./timeline.js";

export const getClientTimeline = async (req, res) => {
  const project = await Project.findOne({
    clientAccessToken: req.params.token,
  });

  if (!project) {
    return res.status(404).json({ message: "Invalid link" });
  }

  req.params.id = project._id;
  return getProjectTimeline(req, res);
};
