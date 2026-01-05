import jwt from "jsonwebtoken";
import User from "../models/user.schema.js";

export const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).send("Token is not present (in Middleware).");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const agency = await User.findById(decoded.id);
    if (!agency) {
      return res.status(404).send("Student not found");
    }

    req.user = agency;
    next();
  } catch (error) {
    res.status(401).send("ERROR OCCURED: " + error.message);
  }
};
