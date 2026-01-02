import express from "express";
import dotenv from "dotenv";
import User from "./models/user.schema.js";
import connectDB from "./connectDB/connectDB.js";
const app = express();
app.use(express.json());

dotenv.config({ quiet: true });
const port = process.env.PORT || 5000;

connectDB().then(
  app.listen(port, () => {
    console.log(`Server running at PORT ${port} 🚀`);
  })
);
