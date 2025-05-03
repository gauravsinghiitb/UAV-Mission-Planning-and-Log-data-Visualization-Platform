import React, { useState, useEffect } from "react";
import ws from "../components/ws";

export default function LiveTelemetry() {
  const [tele, setTele] = useState({});

  useEffect(() => {
    const handleMessage = (evt) => {
      setTele(JSON.parse(evt.data));
    };
    ws.onmessage = handleMessage;
    return () => {
      ws.onmessage = null; // Reset to avoid conflicts
    };
  }, []);

  return (
    <div className="live-telemetry card">
      <h3>Live Telemetry</h3>
      <p>
        GPS: {tele.lat?.toFixed(5)},{tele.lon?.toFixed(5)}
      </p>
      <p>Alt: {tele.alt?.toFixed(1)} m</p>
      <p>Battery: {tele.volt?.toFixed(2)} V</p>
      <p>Mode: {tele.mode || "N/A"}</p>
    </div>
  );
}