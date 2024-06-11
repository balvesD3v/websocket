const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 }, () => {
  console.log("WebSocket server started on ws://localhost:8080");
});

wss.on("connection", (ws, req) => {
  const urlParams = new URLSearchParams(req.url.split("?")[1]);
  const userId = urlParams.get("user_id");
  const role = urlParams.get("role");

  console.log(`New client connected: user_id=${userId}, role=${role}`);

  ws.on("message", (message) => {
    console.log(`Received from user_id=${userId}: ${message}`);
    // Broadcast the message to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log(`Client disconnected: user_id=${userId}, role=${role}`);
  });

  ws.on("error", (error) => {
    console.error(`Error from user_id=${userId}: ${error.message}`);
  });
});
