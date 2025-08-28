import React from "react";

export default function Header() {
  return (
    <header className="header">
      <div className="brand">
        <div className="logo">🧭</div>
        <div>
          <h1>Noida Route Pathfinder</h1>
          <div className="tag">Shortest routes between common Noida spots</div>
        </div>
      </div>
      <nav>
        <a href="https://github.com/your-username/noida-route-pathfinder" target="_blank" rel="noreferrer">Repo</a>
      </nav>
    </header>
  );
}
