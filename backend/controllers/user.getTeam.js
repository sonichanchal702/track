import Team from "../models/team.schema.js";

export const viewTeam = async (req, res) => {
  try {
    const agencyId = req.user._id;

    const team = await Team.find({ agencyId });

    return res.status(200).json({
      message: "Team details fetched successfully",
      count: team.length,
      team,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch team",
      error: error.message,
    });
  }
};
