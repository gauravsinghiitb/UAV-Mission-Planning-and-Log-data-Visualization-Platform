import React from "react";

export default function FlightSettings({ altitude, setAltitude, speed, setSpeed }) {
  const sendSettings = () => {
    // Simulate sending settings to drone (replace with actual API call)
    console.log(`Sending to drone: Altitude=${altitude}m, Speed=${speed}m/s`);
  };

  return (
    <div className="flight-settings">
      <h3>Flight Settings</h3>
      <label>
        Altitude (m):
        <input
          type="number"
          value={altitude}
          onChange={(e) => setAltitude(parseFloat(e.target.value) || altitude)}
        />
      </label>
      <label>
        Speed (m/s):
        <input
          type="number"
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value) || speed)}
        />
      </label>
      <button onClick={sendSettings}>Send to Drone</button>
    </div>
  );
}