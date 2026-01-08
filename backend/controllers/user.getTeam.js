import { checkAvailability } from "../config/teamAvailability.js";
import Team from "../models/team.schema.js";

export const viewTeam = async (req, res) => {
  try {
    const agencyId = req.user._id;

    const team = await Team.find({ agencyId });

    const updatedTeam = Promise.all(
      team.map(async (member) => {
        const { status } = await checkAvailability(member._id);
      })
    );

    return res.status(200).json({
      message: "Team details fetched successfully",
      teamCount: team.length,
      updatedTeam,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch team",
      error: error.message,
    });
  }
};
