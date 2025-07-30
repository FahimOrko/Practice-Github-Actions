import dotenv from "dotenv";
import app from "./app.js";
import http from "http";
import mongoose from "mongoose";
import { loadPlanetsData } from "./models/planets.model.js";
import connectDB from "./services/mongo.js";
import { loadLaunchData } from "./models/launches.model.js";

// dotenv
dotenv.config();

// data from env
const PORT = process.env.PORT || 8000;

// create server instance with app from express
const server = http.createServer(app);

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    await loadPlanetsData();
    await loadLaunchData();

    // Start your server or app logic here
    server.listen(PORT, () => {
      console.log(`🚀 Server listening on port - http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌", err);
    process.exit(1); // Exit with failure
  }
};

startServer();
