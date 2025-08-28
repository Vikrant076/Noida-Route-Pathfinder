import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import NodeSelect from "./components/NodeSelect";
import PathView from "./components/PathView";
import { getNodes, getPath } from "./api";

export default function App() {
  const [nodes, setNodes] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getNodes();
        setNodes(data);
      } catch (e) {
        setError("Could not load nodes. Make sure backend is running.");
      }
    })();
  }, []);

  async function handleFind() {
    setError("");
    setResult(null);
    if (!from || !to) { setError("Pick both start and destination."); return; }
    setLoading(true);
    try {
      const res = await getPath(from, to);
      setResult(res);
    } catch (e) {
      setError(e.message || "Failed to compute route");
    } finally {
      setLoading(false);
    }
  }

  function handleSwap() {
    setFrom(prev => { const a = to; setTo(prev); return a; });
  }

  return (
    <div>
      <Header />
      <main className="main">
        <section className="card">
          <h2>Plan your route</h2>
          <p className="muted">Fast demo — pick two locations to get the shortest path using Dijkstra.</p>

          <div className="controls">
            <NodeSelect label="From" value={from} nodes={nodes} onChange={setFrom} />
            <div className="swapBox">
              <button className="ghost" onClick={handleSwap} title="Swap">↕</button>
            </div>
            <NodeSelect label="To" value={to} nodes={nodes} onChange={setTo} />
            <div className="actions">
              <button className="primary" onClick={handleFind} disabled={loading}>
                {loading ? "Finding…" : "Find Route"}
              </button>
            </div>
          </div>

          {error && <div className="error">{error}</div>}
          <PathView result={result} />
        </section>

        <section className="card small">
          <h4>Quick tips</h4>
          <ul>
            <li>Edit graph edges in <code>backend/graph.js</code> to add locations.</li>
            <li>To persist bigger graphs, implement MongoDB and read nodes/edges on startup.</li>
          </ul>
        </section>
      </main>

      <footer className="footer">Built for demo — show this in interviews. Add map integration as next step.</footer>
    </div>
  );
}
