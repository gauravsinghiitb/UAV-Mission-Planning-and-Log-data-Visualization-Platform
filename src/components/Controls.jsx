import React from "react";
import { Link } from "react-router-dom";

export default function Controls({
  playing,
  setPlaying,
  setIdx,
  setPath,
  setSpeed,
  frames
}) {
  const handleReset = () => {
    setIdx(0);
    setPath([]);
  };

  return (
    <div className="controls">
      <button onClick={() => setPlaying(!playing)}>
        {playing ? "⏸️ Pause" : "▶️ Play"}
      </button>

      <button onClick={handleReset}>🔄 Reset</button>

      <select
        onChange={(e) => setSpeed(Number(e.target.value))}
        defaultValue="1000"
      >
        <option value="2000">0.5x Slow</option>
        <option value="1000">1x Normal</option>
        <option value="500">2x Fast</option>
        <option value="250">2.5x Fast</option>
        <option value="125">3x Fast</option>
        <option value="7.8125">5x Fast</option>
        <option value="1.953125">10x Fast</option>
        <option value="0.000001862645149">30x Fast</option>
      </select>

      <div className="time-info">
        Time:{" "}
        {frames.length > 0
          ? frames[Math.min(frames.length - 1, Math.max(0, frames.length - 1))]
              .time_s.toFixed(1)
          : 0}
        s
      </div>

      {/* Added Mission Planner button */}
      <Link to="/mission-planner">
        <button className="mission-planner-btn">🗺️ Mission Planner</button>
      </Link>
    </div>
  );
}
