import { useState } from "react";
import "./FocusMain.css";

export default function FocusMain({ onStart }) {
  const [h, setH] = useState(0);
  const [m, setM] = useState(0);
  const [s, setS] = useState(0);

  const mod = (unit, dir) => {
    if (unit === 'h') setH(v => Math.min(99, Math.max(0, dir === 'up' ? v + 1 : v - 1)));
    if (unit === 'm') setM(v => Math.min(59, Math.max(0, dir === 'up' ? v + 1 : v - 1)));
    if (unit === 's') setS(v => Math.min(59, Math.max(0, dir === 'up' ? v + 1 : v - 1)));
  };

  return (
    <div className="pc-setup-page">
      <div className="picker-main-ui">
        {[ 
          {v: h, label: 'Hours', id: 'h'}, 
          {v: m, label: 'Minutes', id: 'm'}, 
          {v: s, label: 'Seconds', id: 's'} 
        ].map((item) => (
          <div className="picker-column" key={item.id}>
            {/* Label now sits specifically above its column */}
            <span className="column-label">{item.label}</span>
            
            <button className="arrow-icon" onClick={() => mod(item.id, 'up')}>▲</button>
            <div className="selection-num">{item.v.toString().padStart(2, '0')}</div>
            <button className="arrow-icon" onClick={() => mod(item.id, 'down')}>▼</button>
          </div>
        ))}
      </div>

      <button className="start-btn-rect" onClick={() => onStart(h, m, s)}>
        Start
      </button>
    </div>
  );
}