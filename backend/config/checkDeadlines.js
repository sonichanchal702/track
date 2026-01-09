import Alert from "../models/alert.schema.js";
import Project from "../models/project.schema.js";

export const checkDeadlines = async () => {
  const today = new Date();
  const tomorrow = new Date();

  tomorrow.setDate(today.getDate() + 1);

  const projects = await Project.find({
    deadline: {
      $gte: today,
      $lt: tomorrow,
    },
    projectStatus: { $ne: "completed" },
  });

  for (let project of projects) {
    const exists = await Project.findOne({
      agencyId: project.createdBy,
      type: "Deadline",
    });
  }

  if (!exists) {
    const alert = await Alert.create({
      agencyId: projects.createdBy,
      type: "Deadline",
      projectId: projects._id,
      message: `Project ${projects.projectName}'s deadline is tomorrow.`,
    });
  }
};
