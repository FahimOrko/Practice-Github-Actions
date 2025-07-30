import planets from "../../models/planets.mongo.js";

export async function getAllPlanets(req, res) {
  // finds all the palents
  const allPanets = await planets.find({});
  return res.status(200).json(allPanets);
}
