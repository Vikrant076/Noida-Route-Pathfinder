const BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

/**
 * getNodes -> returns array of node names
 * getPath(from, to) -> returns { path: [...], distance: number }
 */
export async function getNodes() {
  const res = await fetch(`${BASE}/nodes`);
  if (!res.ok) throw new Error("Failed to load nodes");
  return res.json();
}

export async function getPath(from, to) {
  const res = await fetch(`${BASE}/path?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "unknown" }));
    throw new Error(err.error || "Failed to compute route");
  }
  return res.json();
}
