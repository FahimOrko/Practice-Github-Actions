import express from "express";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import { fileURLToPath } from "url";
import api from "./routes/api.js";

const app = express();
const whitelist = ["http://localhost:3000"];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicFilePath = path.join(__dirname, "..", "public");
const indexFilePath = path.join(__dirname, "..", "public", "index.html");

// middlewares
app.use(
  cors({
    origin: whitelist[0],
  })
);
// app.use(morgan("combined"));
app.use(express.json());
app.use(express.static(publicFilePath));

// routes
// we can also set the version here, and inside api were importing the routes
// so instaed api we can go like - /api/v1

app.use("/api", api);

app.get("/", (req, res) => {
  res.sendFile(indexFilePath);
});

export default app;
