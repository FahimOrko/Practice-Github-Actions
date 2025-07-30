import express from "express";
import {
  httpAbortLaunch,
  httpGetAllLaunches,
  httpPostNewLaunch,
} from "./launches.controller.js";

const launchsRouter = express.Router();

// - /api/launches/getAllLaunches
launchsRouter.get("/getAllLaunches", httpGetAllLaunches);

// - /api/launches/addNewLaunch
launchsRouter.post("/addNewLaunch", httpPostNewLaunch);

// - /api/launches/deleteLaunch/:id
launchsRouter.delete("/deleteLaunch/:id", httpAbortLaunch);

export default launchsRouter;
