import { parse } from "csv-parse";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import planets from "./planets.mongo.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const data_path = path.join(__dirname, "..", "..", "data", "kepler_data.csv");

const isHabitablePlanet = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
};

export function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(data_path)
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          await savePlanetsData(data);
        }
      })
      .on("error", (e) => {
        console.log(e);
        reject(e);
      })
      .on("end", async () => {
        const numberOfPlanets = await planets.countDocuments({});
        console.log("Amount of habitable planets -", numberOfPlanets);
        resolve();
      });
  });
}

const savePlanetsData = async (data) => {
  try {
    await planets.updateOne(
      // this creates for the first time if doenst exist
      {
        keplerName: data["kepler_name"],
      },
      // this updates if the planets already exsists
      {
        keplerName: data["kepler_name"],
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.error(err);
  }
};

export default planets;
