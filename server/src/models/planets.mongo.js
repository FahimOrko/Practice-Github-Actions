// [
//   'Kepler-1652 b',
//   'Kepler-1410 b',
//   'Kepler-296 A f',
//   'Kepler-442 b',
//   'Kepler-296 A e',
//   'Kepler-1649 b',
//   'Kepler-62 f',
//   'Kepler-452 b'
// ]

import mongoose from "mongoose";

const planetSchema = new mongoose.Schema({
  keplerName: {
    type: String,
    required: true,
  },
});

const planets = mongoose.model("Planet", planetSchema);

export default planets;
