import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.info("MongoDB connected");
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.info("MongoDB disconnected");
  } catch (err) {
    console.error("DB disconnection failed:", err);
    process.exit(1);
  }
};
