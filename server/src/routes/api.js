import express from "express";
import planetsRouter from "./planets/planets.router.js";
import launchsRouter from "./launches/launches.router.js";

const api = express.Router();

api.use("/planets", planetsRouter);
api.use("/launches", launchsRouter);

export default api;
