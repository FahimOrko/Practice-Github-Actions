import express from "express";
import { getAllPlanets } from "./planets.controller.js";

const planetsRouter = express.Router();

// - /api/planets/getAllPlanets
planetsRouter.get("/getAllPlanets", getAllPlanets);

export default planetsRouter;
