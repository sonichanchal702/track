import Team from "../models/team.schema.js";

export const deleteTeam = async (req, res) => {
  try {
    const agencyId = req.user._id;
    const { id } = req.params;

    const team = await Team.findOneAndDelete({
      _id: id,
      agencyId,
    });

    if (!team) {
      return res.status(404).json({
        message: "Team member not found",
      });
    }

    return res.status(200).json({
      message: "Team member deleted successfully",
      team,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete team member",
      error: error.message,
    });
  }
};
