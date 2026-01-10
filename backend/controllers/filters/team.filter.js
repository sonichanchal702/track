import Team from "../../models/team.schema.js";

export const filterTeamByStatus = async (req, res) => {
  try {
    const agencyId = req.user._id;
    const { status } = req.query;

    if (!status) {
      return res.status(400).json({ message: "Status query is required" });
    }

    const team = await Team.find({
      agencyId,
      status,
    });

    return res.status(200).json({
      message: `Team members with status '${status}' fetched successfully`,
      count: team.length,
      team,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to filter team",
      error: error.message,
    });
  }
};
