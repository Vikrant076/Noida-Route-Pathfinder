import express from "express";
import { adjacency, nodes } from "./graph.js";
import { dijkstra } from "./dijkstra.js";
import { info } from "./logger.js";

const router = express.Router();

// Health check
router.get("/health", (_req, res) => res.json({ ok: true }));

// List nodes
router.get("/nodes", (_req, res) => {
  res.json(nodes);
});

// Shortest path endpoint
// GET /api/path?from=Sector%2062&to=Botanical%20Garden
router.get("/path", (req, res) => {
  const from = String(req.query.from || "").trim();
  const to = String(req.query.to || "").trim();
  if (!from || !to) return res.status(400).json({ error: "Missing from or to query parameter" });

  try {
    const result = dijkstra(adjacency, from, to);
    if (!result.path.length) return res.status(404).json({ error: "No route found" });
    return res.json(result);
  } catch (err) {
    info("Route error:", err.message);
    return res.status(400).json({ error: err.message });
  }
});

export default router;
