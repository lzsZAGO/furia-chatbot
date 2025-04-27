/**
 * App.js
 * Desenvolvido por Leoni
 * Chat em tempo real para fãs da FURIA Tech
 * Última atualização: 2025-04-27
 */

import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

// URL do backend (ajuste se mudar de porta ou domínio)
const SOCKET_URL = 'http://localhost:3001';
// Prefixo para disparar resposta do bot
const BOT_ALIAS = '@FURIABOT';

// Inicializa conexão WebSocket com reconexão automática
const socket = io(SOCKET_URL, {
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

export default function App() {
  // Estado de conexão, mensagens, input e indicadores de erro/digitação
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sendError, setSendError] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // ————— Persistência de histórico —————
  // Carrega ao montar
  useEffect(() => {
    const saved = localStorage.getItem('chatHistory');
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // Salva sempre que `messages` mudar
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  // ————— Configura listeners do Socket.io —————
  useEffect(() => {
    socket.on('connect',    () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('reconnect_attempt', () => setConnected(false));
    socket.on('typing',     () => setIsTyping(true));

    // Bot envia mensagem final
    socket.on('chat message', (msg) => {
      setIsTyping(false);
      const timestamp = new Date();
      setMessages(prev => [
        ...prev,
        { id: prev.length, content: msg, type: 'bot', timestamp, reactions: { '🔥':0,'⚡':0,'❤️':0 } }
      ]);
    });

    // Simulação de live status
    socket.on('live status', (msg) => {
      setIsTyping(false);
      const timestamp = new Date();
      setMessages(prev => [
        ...prev,
        { id: prev.length, content: msg, type: 'live', timestamp, reactions: { '🔥':0,'⚡':0,'❤️':0 } }
      ]);
    });

    return () => socket.removeAllListeners();
  }, []);

  // Auto-scroll até a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // ————— Envio de mensagens —————
  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setSendError(false);

    // Adiciona no feed local
    const userTimestamp = new Date();
    setMessages(prev => [
      ...prev,
      { id: prev.length, content: text, type: 'user', timestamp: userTimestamp, reactions: { '🔥':0,'⚡':0,'❤️':0 } }
    ]);

    // Só chama o bot se a mensagem começar com @FURIABOT
    if (text.startsWith(`${BOT_ALIAS} `)) {
      const query = text.slice(BOT_ALIAS.length).trim();
      socket.emit('chat message', query, (response) => {
        if (!response || response.status !== 'ok') setSendError(true);
      });
    }

    setInput('');
  };

  // ————— Simulação de live status —————
  const startLive = () => socket.emit('start live');

  // ————— Reações de emoji —————
  const addReaction = (msgId, emoji) => {
    setMessages(prev => prev.map(msg =>
      msg.id === msgId
        ? { ...msg, reactions: { ...msg.reactions, [emoji]: msg.reactions[emoji] + 1 } }
        : msg
    ));
  };

  // Formata o timestamp para “HH:MM”
  const formatTime = date =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col h-screen bg-furia-black-piano">
      {/* HEADER */}
      <header className="flex items-center justify-between bg-furia-gray p-4 shadow-lg">
        <motion.h1
          className="text-3xl font-bold text-furia-white-ice"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0,  opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          FURIA Chat
        </motion.h1>
        <div className="flex items-center space-x-4">
          <motion.span
            className={connected ? 'text-green-500' : 'text-red-500'}
            animate={connected ? { scale: [1,1.1,1] } : { opacity: [0.5,1,0.5] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            {connected ? 'Conectado ✅' : 'Reconectando… 🔄'}
          </motion.span>
          <motion.button
            onClick={startLive}
            className="px-3 py-1 bg-furia-white-ice text-black font-semibold rounded hover:bg-white transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Simular Live
          </motion.button>
        </div>
      </header>

      {/* CHAT AREA */}
      <main className="flex-1 overflow-auto p-4 flex flex-col">
        <AnimatePresence initial={false}>
          {messages.map(({ id, content, type, timestamp, reactions }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`
                mb-2 p-4 rounded-2xl max-w-md shadow-xl whitespace-pre-wrap leading-snug
                ${type==='user'
                  ? 'bg-furia-white-ice text-black self-end'
                  : type==='live'
                    ? 'bg-yellow-900 text-yellow-300 self-center italic'
                    : 'bg-furia-gray text-furia-white self-start'}
              `}
            >
              <div className="flex justify-between items-start">
                <div>{content}</div>
                <div className="flex space-x-1 ml-2">
                  {['🔥','⚡','❤️'].map(emoji => (
                    <motion.span
                      key={emoji}
                      className="cursor-pointer text-sm"
                      whileTap={{ scale: 1.2 }}
                      onClick={() => addReaction(id, emoji)}
                    >
                      {emoji} {reactions[emoji]}
                    </motion.span>
                  ))}
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-2 text-right">
                {formatTime(timestamp)}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            className="mb-2 p-3 italic text-gray-400 self-start animate-pulse"
            animate={{ opacity: [0,1,0] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            digitando...
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* INPUT AREA */}
      <footer className="p-4 bg-furia-gray shadow-inner">
        <div className="flex">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            className={`
              flex-1 rounded-full p-3 mr-2 bg-furia-black-piano border-2
              ${sendError
                ? 'border-red-500 animate-pulse'
                : 'border-furia-white-ice'}
              placeholder-gray-500 text-furia-white
              focus:outline-none focus:ring-2 focus:ring-furia-white-ice
            `}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key==='Enter' && sendMessage()}
            placeholder="Digite sua mensagem..."
          />
          <motion.button
            className="px-6 py-3 bg-furia-white-ice text-black font-bold rounded-full hover:bg-white transition"
            onClick={sendMessage}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Enviar
          </motion.button>
        </div>
        {sendError && (
          <div className="text-red-500 text-sm mt-2 animate-pulse">
            Falha ao enviar. Tente novamente.
          </div>
        )}
      </footer>
    </div>
  );
}
