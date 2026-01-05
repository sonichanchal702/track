import Team from "../models/team.schema.js";

export const addTeamMember = async (req, res) => {
  try {
    //got the user
    let loggedInUser = req.user._id;

    // got the data from body
    const { name, contact, email, skills, payoutPerProject } = req.body;
    //basic validation
    if (!name || !contact || !skills || !payoutPerProject) {
      res
        .status(500)
        .send(
          "Please add required fields : Name , Contact , Skills , Payout Per Project"
        );
    }
    const isMemberExists = await Team.findOne({
      agencyId: loggedInUser,
      contact,
    });
    if (isMemberExists) {
      return res.status(400).json({
        message: "Team member already exists with this contact",
      });
    }
    //add a new team member
    const newMember = new Team({
      agencyId: loggedInUser,
      name,
      contact,
      skills,
      payoutPerProject,
      projectsDone: [],
      status: "free",
    });
    newMember.save();
    res.status(200).json({
      message: "Team Created Successfully.",
      newMember,
    });
  } catch (error) {
    res.status(401).send("ERROR OCCURED: " + error.message);
  }
};
