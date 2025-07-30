import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// data from env
const MONGO_DB_URI = process.env.MONGO_DB_URI;

mongoose.connection.once("open", () => {
  console.log("✅ MongoDB connected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

const connectDB = async () => {
  try {
    // Connect to database
    await mongoose.connect(MONGO_DB_URI);
    console.log("Database Successfully Connected");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
  }
};

export const disconnectDB = async () => {
  try {
    // Connect to database
    await mongoose.disconnect();
    console.log("Database Successfully Disconected");
  } catch (err) {
    console.error("❌ Failed to disconnect from MongoDB:", err);
  }
};

export default connectDB;
