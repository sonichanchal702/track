import jwt from "jsonwebtoken";
import User from "../models/user.schema.js";

export const userAuth = async (req, res, next) => {
  try {
    console.log("Cookies:", req.cookies);
    console.log("Cookie Token:", req.cookies.token);

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).send("Token is not present (in Middleware).");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded:", decoded);

    const agency = await User.findById(decoded.id);

    if (!agency) {
      return res.status(404).send("Agency not found");
    }

    req.user = agency;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send("ERROR OCCURED: " + error.message);
  }
};

// export const userAuth = async (req, res, next) => {
  // try {
    // const token = req.cookies.token;
// 
// 
    // if (!token) {
      // return res.status(401).send("Token is not present (in Middleware).");
    // }
// 
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
// 
    // const agency = await User.findById(decoded.id);
    // if (!agency) {
      // return res.status(404).send("Agency not found");
    // }
// 
    // req.user = agency;
    // next();
  // } catch (error) {
    // return res.status(401).send("ERROR OCCURED: " + error.message);
  // }
// };
// 