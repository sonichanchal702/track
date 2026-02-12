import Alert from "../models/alert.schema.js";
import Project from "../models/project.schema.js";

export const checkDeadlines = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const projects = await Project.find({
      deadline: { $gte: today, $lt: tomorrow },
      projectStatus: { $ne: "completed" },
    });

    for (const project of projects) {
      const alreadyAlerted = await Alert.findOne({
        projectId: project._id,
        type: "Deadline",
      });

      if (alreadyAlerted) continue;
      await Alert.create({
        agencyId: project.createdBy,
        projectId: project._id,
        type: "Deadline",
        message: `Deadline approaching: "${project.projectName}" is due tomorrow.`,
      });

      console.log(`⏰ Deadline alert created for ${project.projectName}`);
    }
  } catch (err) {
    console.error("Deadline cron failed:", err.message);
  }
};
