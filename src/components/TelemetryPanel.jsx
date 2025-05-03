import React from 'react';

export default function TelemetryPanel({ battery, altitude, speed, heading }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2">Telemetry</h2>
      <p>Battery: <span className="font-bold">{battery.toFixed(0)}%</span></p>
      <p>Altitude: <span className="font-bold">{altitude.toFixed(1)} m</span></p>
      <p>Speed: <span className="font-bold">{speed.toFixed(1)} m/s</span></p>
      <p>Heading: <span className="font-bold">{heading.toFixed(0)}°</span></p>
    </div>
  );
}
