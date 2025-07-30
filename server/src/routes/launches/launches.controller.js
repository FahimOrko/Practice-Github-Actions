import {
  abortLaunchById,
  addNewLaunch,
  getAllLaunches,
  lauchExsistWithId,
} from "../../models/launches.model.js";
import { getPagination } from "../../services/query.js";

export async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);
  const data = await getAllLaunches(skip, limit);
  return res.status(200).json(data);
}

export async function httpPostNewLaunch(req, res) {
  const mission = req.body.mission;
  const rocket = req.body.rocket;
  const launchDate = new Date(req.body.launchDate);
  const target = req.body.target;

  if (!mission || !rocket || !launchDate || !target) {
    return res
      .status(400)
      .json({ succes: false, error: "Missing required properties" });
  }

  if (launchDate.toString() === "Invalid Date") {
    return res.status(400).json({
      succes: false,
      error: "Invalid Launch Date",
    });
  }

  const launch = {
    mission: mission,
    rocket: rocket,
    launchDate: launchDate,
    target: target,
  };

  const newLaunch = await addNewLaunch(launch);
  // console.log(newLaunch);
  return res.status(201).json(newLaunch);
}

export async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);
  const launchExsists = await lauchExsistWithId(launchId);

  // if doesnt exsist
  if (!launchExsists) {
    return res.status(404).json({
      success: false,
      error: "Launch not found",
    });
  }

  // if launch exsist
  const aborted = await abortLaunchById(launchId);
  // console.log(aborted);
  return res.status(200).json(aborted.acknowledged);
}
