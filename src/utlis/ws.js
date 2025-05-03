// src/utils/ws.js

// Adjust the URL / port to match your telemetry server
const WS_URL = "ws://localhost:14550";

export const ws = new WebSocket(WS_URL);

ws.onopen = () => {
  console.log("WebSocket connected:", WS_URL);
};

ws.onclose = () => {
  console.log("WebSocket disconnected");
};

ws.onerror = err => {
  console.error("WebSocket error:", err);
};

ws.onmessage = msg => {
  // default listener can be set in components as needed
  console.debug("WS message:", msg.data);
};

export default ws;
