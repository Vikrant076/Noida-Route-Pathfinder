// Minimal Noida map (undirected). Friendly, editable.
// Distances are example kilometers for demo purposes.
//
// To extend: add lat/lng fields and edges for drawing on maps.

export const nodes = [
  "Sector 62",
  "Sector 18",
  "Noida City Centre",
  "Botanical Garden",
  "Sector 137",
  "Sector 76",
  "Okhla Bird Sanctuary",
  "DLF Mall of India"
];

const edges = [
  ["Sector 62", "Sector 18", 10],
  ["Sector 18", "Noida City Centre", 5],
  ["Noida City Centre", "Botanical Garden", 3],
  ["Sector 62", "Sector 137", 7],
  ["Sector 137", "Noida City Centre", 8],
  ["Sector 76", "Noida City Centre", 4],
  ["Sector 18", "DLF Mall of India", 1],
  ["DLF Mall of India", "Botanical Garden", 2],
  ["Botanical Garden", "Okhla Bird Sanctuary", 2]
];

// Build adjacency map: { node: { neighbor: weight, ... }, ... }
export const adjacency = nodes.reduce((acc, n) => ({ ...acc, [n]: {} }), {});
for (const [a, b, w] of edges) {
  adjacency[a][b] = w;
  adjacency[b][a] = w;
}
