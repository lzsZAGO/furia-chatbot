// backend/index.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const OpenAI = require('openai'); // importa a classe principal

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Instancia o cliente OpenAI com sua chave
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Rota de teste
app.get('/', (req, res) => {
  res.send('FURIA Chatbot Backend está no ar ❤️');
});

io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  socket.on('chat message', async (msg, callback) => {
    console.log(`Mensagem recebida: ${msg}`);
    if (callback) callback({ status: 'ok' });

    // Indica que o bot está digitando
    socket.emit('typing');

    try {
      // Chama o Chat Completions no novo formato v4
      const resp = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Você é o chatbot oficial da FURIA Tech, alegre e direto.' },
          { role: 'user',   content: msg }
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      // Extrai a resposta e envia ao chat
      const resposta = resp.choices[0].message.content.trim();
      io.emit('chat message', resposta);

    } catch (err) {
      console.error('Erro ao gerar resposta:', err);
      io.emit('chat message', '⚠️ Desculpe, deu um problema ao gerar a resposta.');
    }
  });

  // Simulação de live status
  socket.on('start live', () => {
    const statuses = [
      { delay:    0, msg: '🕒 Próximo jogo: FURIA x Oponente em 5 minutos' },
      { delay:  5000, msg: '🏆 Jogo iniciado! Placar: FURIA 0 - 0 Oponente' },
      { delay: 15000, msg: '⚽️ Gol da FURIA! Placar: FURIA 1 - 0 Oponente' },
      { delay: 25000, msg: '⏸️ Intervalo: FURIA 1 - 0 Oponente' },
      { delay: 35000, msg: '🏁 Fim de jogo: FURIA 1 - 0 Oponente' },
    ];
    statuses.forEach(({ delay, msg }) => {
      setTimeout(() => io.emit('live status', msg), delay);
    });
  });

  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
