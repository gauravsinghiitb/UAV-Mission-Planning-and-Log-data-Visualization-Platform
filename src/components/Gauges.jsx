import React from "react";

export default function Gauges({ state }) {
  return (
    <div className="gauges">
      <div className="gauge">
        <h3>Speed</h3>
        <div className="circle">{state.speed ? state.speed.toFixed(1) : 0} m/s</div>
      </div>
      <div className="gauge">
        <h3>Altitude</h3>
        <div className="circle">{state.altitude ? state.altitude.toFixed(1) : 0} m</div>
      </div>
    </div>
  );
}
