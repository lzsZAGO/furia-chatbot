// index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Rota de teste
app.get('/', (req, res) => {
  res.send('FURIA Chatbot Backend está no ar ❤️');
});

// Eventos do Socket.io
io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  // Recebe mensagem do cliente e devolve um eco
  socket.on('chat message', (msg) => {
    console.log(`Mensagem recebida: ${msg}`);
    io.emit('chat message', `Eco: ${msg}`);
  });

  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

// Inicia o servidor
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
