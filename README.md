# FURIA Chatbot

[![CI](https://github.com/<seu-usuario>/furia-chatbot/actions/workflows/ci.yml/badge.svg)](https://github.com/<seu-usuario>/furia-chatbot/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Descrição

O **FURIA Chatbot** é uma aplicação de chat em tempo real desenvolvida para fãs da FURIA Tech. Combina funcionalidades de WebSockets, inteligência artificial via OpenAI ChatGPT e uma experiência de usuário premium, com animações, tema estilizado e apresentação de status ao vivo.

## 🔧 Tecnologias

- **Backend**: Node.js, Express, Socket.io, OpenAI API, dotenv
- **Frontend**: React, Tailwind CSS, Framer Motion, Socket.io-client
- **Ferramentas**: GitHub Actions (CI), npm

## 🚀 Funcionalidades Principais

- **Chat em tempo real** com reconexão automática e tratamento de erros (Socket.io)
- **Resposta inteligente**: integração com ChatGPT, acionada por menção (`@FURIABOT`)
- **Indicador de digitação** antes de cada resposta do bot
- **Simulação de live status** de jogos com eventos programados
- **Animações envolventes** de mensagens, botões e badges (Framer Motion)
- **Reações de emoji** em cada mensagem com contagem dinâmica
- **Design alinhado à marca FURIA**: tema `black-piano`, `white-ice`, `gray`, tipografia e sombras marcantes
- **Auto-scroll** para a última mensagem e exibição de timestamp em cada balão

## 📥 Instalação e Execução

### 1. Preparar o repositório
```bash
# Clone o repositório
git clone git@github.com:<seu-usuario>/furia-chatbot.git
cd furia-chatbot
```

### 2. Backend
```bash
cd backend
cp .env.example .env                # configure sua chave OPENAI_API_KEY
npm install                          # instala dependências
npm start                            # roda em http://localhost:3001
```

### 3. Frontend
```bash
cd ../frontend
npm install                          # instala dependências
npm start                            # roda em http://localhost:3000
```

## 📁 Estrutura de Pastas
```
furia-chatbot/
├─ backend/         # servidor Express + Socket.io + ChatGPT
│  ├─ index.js
│  ├─ package.json
│  └─ .env.example
├─ frontend/        # app React com Tailwind e Framer Motion
│  ├─ src/
│  ├─ tailwind.config.js
│  └─ package.json
├─ .github/workflows/ci.yml  # integração contínua
├─ README.md
└─ LICENSE.md
```

## ⚙️ Integração Contínua (CI)
Cada push e pull request na branch `main` dispara um workflow que:
1. Checa o código
2. Instala dependências (frontend e backend)
3. Executa testes (se presentes)

## 🤝 Contribuição
1. Fork este repositório
2. Crie uma branch: `git checkout -b feat/nova-funcionalidade`
3. Faça commits claros e semânticos
4. Envie um Pull Request para `main`

## 📄 Licença
Este projeto é licenciado sob a [MIT License](LICENSE).

