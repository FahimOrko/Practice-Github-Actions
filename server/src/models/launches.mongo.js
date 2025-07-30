// const launch = {
//   flightNumber: 100,
//   mission: "Keplet Expo X",
//   rocket: "Explorer I",
//   launchDate: new Date("December 27, 2030"),
//   target: "Kepler-442 b",
//   customers: ["ZTM", "NASA"],
//   upcoming: true,
//   success: true,
// };

import mongoose from "mongoose";

const launchSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  target: {
    type: String,
  },
  upcoming: {
    type: Boolean,
    required: true,
  },
  success: {
    type: Boolean,
    required: true,
    default: true,
  },
  customers: {
    type: [String],
    required: true,
    default: true,
  },
});

// the launch name should be always singular cz when mongo creates a collection it will autmitically make the name prular
const launches = mongoose.model("Launch", launchSchema);

export default launches;
