import mongoose from "mongoose";
import { config } from "dotenv";

config();

export default async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database");
  } catch (error) {
    console.log("Failed to connecting with database with error: ", error);
  }
}
