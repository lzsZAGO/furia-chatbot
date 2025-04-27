/**
 * Desenvolvido por lzsZAGO
 * Servidor Express + Socket.io + Integração com OpenAI ChatGPT
 * Última atualização: 2025-04-27
 */

require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const OpenAI = require('openai');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, { cors: { origin: '*' } });

// Inicializa cliente OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Rota de saúde
app.get('/', (req, res) => {
  res.send('Rota estabelecida.');
});

// ### LÓGICA DO CHAT
io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  // Recebe mensagem do frontend
  socket.on('chat message', async (msg, callback) => {
    console.log(`Mensagem recebida: ${msg}`);
    if (callback) callback({ status: 'ok' });
    socket.emit('typing'); // avisa o frontend que o bot está digitando

    try {
      // Prompt system para garantir foco em Esports/FURIA
      const resp = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `
Você é o FURIABOT, o chatbot oficial da FURIA Tech.
Seu único domínio é Esports (especialmente CS:GO) e tudo que envolva a FURIA.
Responda apenas perguntas relacionadas a partidas, jogadores, história e curiosidades da FURIA Tech e Esports.
Se for fora desse escopo, responda:
"⚠️ Desculpe, FURIOSO(A), só posso ajudar com assuntos relacionados a Esports e a FURIA."
`
          },
          { role: 'user', content: msg }
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      const resposta = resp.choices[0].message.content.trim();
      io.emit('chat message', resposta);

    } catch (err) {
      console.error('Erro ao gerar resposta:', err);
      // Fallback para echo em caso de falta de crédito
      if (err.code === 'insufficient_quota' || err.status === 429) {
        io.emit('chat message', '⚠️ Sem créditos na API no momento. Ecoando sua mensagem:');
        io.emit('chat message', `Echo: ${msg}`);
      } else {
        io.emit('chat message', '⚠️ Desculpe, houve um erro ao gerar a resposta.');
      }
    }
  });

  // ### SIMULAÇÃO DE LIVE STATUS de CS:GO
  socket.on('start live', () => {
    const opponents    = ['Astralis','G2','NAVI','FaZe','Liquid'];
    const opponent     = opponents[Math.floor(Math.random() * opponents.length)];
    const furiaPlayers = ['bit','LUCAS1','boltz','yuurih','falleN'];

    let furiaWins = 0, oppWins = 0, round = 1, delay = 0;
    const schedule = (msg, ms) => setTimeout(() => io.emit('live status', msg), ms);

    schedule(`🕒 Próximo jogo: FURIA vs ${opponent} em 5 minutos`, delay);
    delay += 5000;
    schedule(`🔫 Jogo iniciado! FURIA vs ${opponent}`, delay);
    delay += 5000;

    // Simula até 16 rounds vencidos
    while (furiaWins < 16) {
      // Define vencedor (60% de chance da FURIA, mas garante vitória final)
      const isMatchPoint = furiaWins === 15 || oppWins === 15;
      const winner = isMatchPoint ? 'FURIA' : (Math.random() < 0.6 ? 'FURIA' : opponent);
      winner === 'FURIA' ? furiaWins++ : oppWins++;

      // Distribui kills somando 5 para FURIA
      let left = 5, kills = {};
      furiaPlayers.forEach((p, i) => {
        const k = (i === furiaPlayers.length -1) ? left : Math.floor(Math.random()*(left+1));
        kills[p] = k; left -= k;
      });
      const killStr = furiaPlayers.map(p=>`${p}:${kills[p]}`).join(', ');
      const bomb    = Math.random()<0.5 ? 'Explosão da C4' : 'Eliminação pura';
      const score   = `${furiaWins}-${oppWins}`;

      schedule(
        `🎮 Round ${round}: ${winner} venceu | ${killStr} | ${bomb} | Placar: ${score}`,
        delay
      );
      delay += 7000; round++;
    }

    schedule(`🏆 Fim de jogo: FURIA ${furiaWins} - ${oppWins} ${opponent}`, delay);
  });

  socket.on('disconnect', () => console.log(`Cliente desconectado: ${socket.id}`));
});

// Inicia servidor
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
