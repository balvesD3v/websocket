const express = require("express");
const http = require("http");
const WebSocket = require("ws");

// Inicializa a aplicação Express
const app = express();

// Cria um servidor HTTP e passa a aplicação Express para ele
const server = http.createServer(app);

// Inicializa o WebSocket Server
const wss = new WebSocket.Server({ server });

// Quando uma nova conexão é estabelecida
wss.on("connection", (ws, req) => {
  console.log("Novo cliente conectado");

  // Quando uma mensagem é recebida do cliente
  ws.on("message", (message) => {
    console.log(`Mensagem recebida: ${message}`);

    // Envia a mensagem para todos os clientes conectados
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Quando a conexão é fechada
  ws.on("close", () => {
    console.log("Cliente desconectado");
  });

  // Em caso de erro na conexão WebSocket
  ws.on("error", (error) => {
    console.error(`Erro na conexão WebSocket: ${error}`);
  });
});

// Define uma rota simples para verificar se o servidor está funcionando
app.get("/", (req, res) => {
  res.send("Servidor WebSocket está funcionando!");
});

// Define a porta na qual o servidor vai escutar
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor está escutando na porta ${PORT}`);
});
