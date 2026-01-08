import Project from "../models/project.schema.js";
import Team from "../models/team.schema.js";

export const checkAvailability = async (teamMemberId) => {
  const projectCount = await Project.countDocument({
    assignedTo: teamMemberId,
    status: "active",
  });

  let newState = "free";
  if (projectCount !== 0 && projectCount <= 2) newState = "busy";
  else if (projectCount >= 3) newState = "overloaded";

  await Team.findByIdAndUpdate(teamMemberId, {
    status: newState,
  });

  return {
    status: newState,
  };
};
