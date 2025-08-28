import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import routes from "./routes.js";
import { info } from "./logger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// API router
app.use("/api", routes);

// Basic landing
app.get("/", (req, res) => {
  res.send("<h2>Noida Route Pathfinder — backend</h2><p>Use /api/nodes and /api/path?from=&to=</p>");
});

// Serve static client build (optional, if you build the frontend and copy to backend/public)
// If you later put the frontend build into backend/public, uncomment below:
// import path from "path";
// app.use(express.static(path.resolve("./public")));
// app.get("*", (_req, res) => res.sendFile(path.resolve("./public/index.html")));

app.listen(PORT, () => {
  info(`Server listening on http://localhost:${PORT}`);
});
