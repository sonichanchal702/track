import Team from "../models/team.schema.js";
import Project from "../models/project.schema.js";

export const assignMember = async (req, res) => {
  try {
    const { id } = req.params; //param me projectID aayegi
    const agencyId = req.user._id; //token
    const { teamId } = req.body;

    if (!teamId) {
      return res.status(400).send("Team id is missing");
    }

    const project = await Project.findOne({
      _id: id,
      createdBy: agencyId,
    });
    if (!project) {
      return res.status(400).send("No project found");
    }
    const team = await Team.findOne({
      _id: teamId,
      agencyId,
    });

    if (!team) {
      return res.status(400).send("No team found.");
    }

   
    project.assignedTo = team._id;
    project.status = "active";
    await project.save();


    (team.status = "busy"), await team.save();

    return res.status(200).json({
      message: `Project ${project.projectName} has been successfully assigned to ${team.name}`,
    });
  } catch (error) {
    return res.status(401).send("ERROR OCCURED: " + error.message);
  }
};
