import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://gouravthakurpp_db_user:bt87ATKbk3jGb1Xs@trackk.1ns5kve.mongodb.net/track");
    console.log("MongoDB Connected successfully✅");
  } catch (error) {
    console.log("MongoDB connection failed ❌");
    process.exit(1);
  }
};

export default connectDB;
