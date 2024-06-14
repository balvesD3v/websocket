const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      console.log("Received:", parsedMessage);
      const jsonString = JSON.stringify(parsedMessage);
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(jsonString);
        }
      });
    } catch (e) {
      console.error("Error parsing message:", e);
    }
  });

  ws.send(JSON.stringify({ user: "System", text: "Welcome to the chat!" }));
});
