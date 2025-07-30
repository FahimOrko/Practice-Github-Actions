import dotenv from "dotenv";
import axios from "axios";
import launches from "./launches.mongo.js";
import planets from "./planets.mongo.js";

dotenv.config({});

// Space X url

const SPACE_X_API_URL = process.env.SPACE_X_API_URL;
const SPACE_X_API_QUERY = SPACE_X_API_URL + "/launches/query";

let lastestFlightNumber = 100;

// const launch = {
//   flightNumber: 100, //flight_number
//   mission: "Keplet Expo X", // name
//   rocket: "Explorer I", // rocket.name
//   launchDate: new Date("December 27, 2030"), // date_local
//   target: "Kepler-442 b", // not applicable
//   customers: ["ZTM", "NASA"], // payload.customers each payload
//   upcoming: true, // upcomming
//   success: true, // success
// };

// await saveLauch(launch);

export async function getAllLaunches(skip, limit) {
  return await launches
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

export async function saveLauch(launch) {
  await launches.findOneAndUpdate(
    {
      flightNumber: launch["flightNumber"],
    },
    launch,
    {
      upsert: true,
      new: true,
    }
  );
}

export async function addNewLaunch(launch) {
  const palents = await planets.findOne({
    keplerName: launch.target,
  });

  if (!palents) {
    throw new Error("No matching planet was found");
  }

  const currentFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = {
    ...launch,
    customers: ["ZTM", "NASA"],
    upcoming: true,
    success: true,
    flightNumber: currentFlightNumber,
  };

  await saveLauch(newLaunch);

  // console.log(newLaunch);

  return newLaunch;
}

export async function lauchExsistWithId(id) {
  const launchId = await launches.findOne({
    flightNumber: id,
  });
  return launchId;
}

export async function getLatestFlightNumber() {
  const latestLaunch = await launches.findOne().sort("-flightNumber");

  if (!latestLaunch) {
    return lastestFlightNumber;
  } else {
    return latestLaunch.flightNumber;
  }
}

export async function abortLaunchById(id) {
  const abortLaunch = await launches.updateOne(
    {
      flightNumber: id,
    },
    {
      success: false,
      upcoming: false,
    }
  );
  // console.log(abortLaunch);
  return abortLaunch.modifiedCount;
}

// space X api

export async function findLaunch(filter) {
  return await launches.findOne(filter);
}

export async function loadLaunchData() {
  const needToQuerry = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (needToQuerry) {
    console.log("Space X launch data is already loaded");
  } else {
    await populateLaunches();
  }
}

export async function populateLaunches() {
  // console.log(SPACE_X_API_QUERY);
  const response = await axios.post(SPACE_X_API_QUERY, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
          strictPopulate: false,
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
          strictPopulate: false,
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log("Problem with downlaoding data from Space X API");
    throw new Error("Downloading data failed");
  }

  const launchDocs = response.data.docs;

  launchDocs.map(async (item) => {
    const payloads = item.payloads;
    const customers = payloads.flatMap((payload) => payload.customers);

    const launch = {
      flightNumber: item.flight_number,
      mission: item.name,
      rocket: item.rocket.name,
      launchDate: item.date_local,
      target: "Kepler-442 b", // not applicable
      customers,
      upcoming: item.upcomming,
      success: item.success,
    };

    await saveLauch(launch);

    // console.log(launch);
  });

  // console.log(launchDocs);
}

export default launches;
