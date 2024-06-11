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

    const parsedMessage = JSON.parse(message);

    // If a user starts a chat, notify the consultant
    if (parsedMessage.type === "start_chat") {
      console.log(
        `Start chat request received from user_id=${userId} for consultant_id=${parsedMessage.consultant_id}`
      );

      wss.clients.forEach((client) => {
        if (
          client.readyState === WebSocket.OPEN &&
          client.userId === parsedMessage.consultant_id &&
          client.role === "consultant"
        ) {
          client.send(
            JSON.stringify({
              type: "new_chat",
              chat_session_id: parsedMessage.chat_session_id,
              user_id: userId,
              user_name: parsedMessage.user_name,
            })
          );
        }
      });
    } else {
      // Broadcast the message to the specific chat participants
      console.log(
        `Broadcasting message from user_id=${userId} to all clients in session ${parsedMessage.session_id}`
      );

      wss.clients.forEach((client) => {
        if (
          client.readyState === WebSocket.OPEN &&
          (client.userId === parsedMessage.to || client.userId === userId)
        ) {
          client.send(message);
        }
      });
    }
  });

  ws.on("close", () => {
    console.log(`Client disconnected: user_id=${userId}, role=${role}`);
  });

  ws.on("error", (error) => {
    console.error(`Error from user_id=${userId}: ${error.message}`);
  });
});
