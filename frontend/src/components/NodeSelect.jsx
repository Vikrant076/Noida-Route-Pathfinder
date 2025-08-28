import React from "react";

export default function NodeSelect({ label, value, nodes, onChange }) {
  return (
    <div className="field">
      <label>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}>
        <option value="">Select</option>
        {nodes.map(n => <option key={n} value={n}>{n}</option>)}
      </select>
    </div>
  );
}
