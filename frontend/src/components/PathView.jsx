import React from "react";

export default function PathView({ result }) {
  if (!result) return null;
  const { path = [], distance } = result;
  if (!path.length) return <div className="empty">No path found.</div>;

  return (
    <div className="resultCard">
      <h3>Route</h3>
      <div className="route">
        {path.map((p,i) => (
          <span className="routeNode" key={p}>
            {p}
            {i < path.length - 1 && <span className="routeArrow">→</span>}
          </span>
        ))}
      </div>
      <div className="meta">Estimated distance: <strong>{Number.isFinite(distance) ? `${distance} km` : "N/A"}</strong></div>
    </div>
  );
}
