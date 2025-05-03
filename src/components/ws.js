const WS_URL = "ws://localhost:14550";

export const ws = new WebSocket(WS_URL);

ws.onopen = () => {
  console.log("WebSocket connected:", WS_URL);
};

ws.onclose = () => {
  console.log("WebSocket disconnected");
};

ws.onerror = (err) => {
  console.error("WebSocket error:", err);
};

ws.onmessage = (msg) => {
  console.debug("WS message:", msg.data);
};

export default ws;