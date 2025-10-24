import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import routes from "./routes.js";
import { info } from "./logger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;


app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.use("/api", routes);


app.get("/", (req, res) => {
  res.send("<h2>Noida Route Pathfinder — backend</h2><p>Use /api/nodes and /api/path?from=&to=</p>");
});



app.listen(PORT, () => {
  info(`Server listening on http://localhost:${PORT}`);
});
