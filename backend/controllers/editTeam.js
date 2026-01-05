import Team from "../models/team.schema.js";

export const editTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const agencyId = req.user._id;

    const member = await Team.findOne({
      _id: id,
      agencyId: agencyId,
    });
    if (!member) {
      return res.status(404).send("No Team Member found");
    }

    const allowedFields = [
      "name",
      "contact",
      "skills",
      "payoutPerProject",
      "status",
    ];
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        member[key] = req.body[key];
      }
    });

    await member.save();
    res.status(200).json({
      message: "Team member updated successfully",
      member,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to Edit Details",
      error: error.message,
    });
  }
};
