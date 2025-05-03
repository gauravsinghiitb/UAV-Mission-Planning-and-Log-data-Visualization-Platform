import React from "react";

export default function WaypointList({ waypoints, setWaypoints }) {
  return (
    <div className="waypoint-list card">
      <h3>Waypoints</h3>
      <ol>
        {waypoints.map((wp, i) => (
          <li key={i}>
            {wp.lat.toFixed(5)}, {wp.lng.toFixed(5)}
            <button
              onClick={() => {
                const arr = [...waypoints];
                arr.splice(i, 1);
                setWaypoints(arr);
              }}
            >
              ❌
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}