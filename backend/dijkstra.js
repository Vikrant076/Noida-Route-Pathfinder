export function dijkstra(graph, start, end) {
  if (!graph[start]) throw new Error(`Unknown start node: ${start}`);
  if (!graph[end]) throw new Error(`Unknown end node: ${end}`);
  if (start === end) return { path: [start], distance: 0 };

  const nodes = Object.keys(graph);
  const dist = Object.fromEntries(nodes.map(n => [n, Infinity]));
  const prev = Object.fromEntries(nodes.map(n => [n, null]));
  const visited = new Set();

  dist[start] = 0;

  while (visited.size < nodes.length) {
    
    let u = null;
    let best = Infinity;
    for (const n of nodes) {
      if (!visited.has(n) && dist[n] < best) { best = dist[n]; u = n; }
    }
    if (u === null) break;
    if (u === end) break;

    visited.add(u);
    const neighbors = graph[u] || {};
    for (const [v, w] of Object.entries(neighbors)) {
      const alt = dist[u] + w;
      if (alt < dist[v]) {
        dist[v] = alt;
        prev[v] = u;
      }
    }
  }

  if (dist[end] === Infinity) return { path: [], distance: Infinity };

  
  const path = [];
  let cur = end;
  while (cur) {
    path.unshift(cur);
    cur = prev[cur];
  }
  return { path, distance: dist[end] };
}
