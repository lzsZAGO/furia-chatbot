# FURIA Chatbot

Um aplicativo de chatbot que mantém os fãs da FURIA atualizados sobre notícias e partidas de Counter-Strike, além de responder perguntas gerais sobre o time.

---

## Status do CI
O workflow de CI foi **temporariamente desabilitado**, renomeado para:

```
.github/workflows/ci.disabled.yml
```

Isso evita erros no GitHub Actions enquanto você testa localmente.

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** v18 ou superior
- **npm** 8 ou superior (ou **yarn**)
- **Git** para clonar o repositório

---

## Estrutura do Projeto

```
furia-chatbot/
├── backend/          # API e lógica de backend
│   ├── package.json
│   ├── package-lock.json
│   └── src/          # código-fonte
├── frontend/         # Aplicação cliente (React + Vite)
│   ├── package.json
│   ├── package-lock.json
│   └── src/          # código-fonte
├── .github/
│   └── workflows/
│       └── ci.disabled.yml  # CI temporariamente desativado
├── README.md         # este arquivo
└── LICENSE.txt
```

---

## Como rodar e testar localmente

Siga estes passos para clonar e executar o projeto no seu próprio dispositivo.

### 1. Clone do repositório
```bash
git clone https://github.com/seu-usuario/furia-chatbot.git
cd furia-chatbot
```

### 2. Frontend
```bash
cd frontend
npm install           # instala dependências e gera package-lock.json
npm test              # executa script de testes (placeholder retorna "Sem testes ainda")
npm run dev           # inicia o Vite em http://localhost:5173
```

### 3. Backend
```bash
cd ../backend
npm install           # instala dependências e gera package-lock.json
npm test              # execute apenas se tiver testes configurados
npm start             # inicia o servidor (por ex. http://localhost:3000)
```

---

## Scripts Disponíveis

No diretório **frontend**:

- `npm run dev`: inicia o servidor de desenvolvimento do Vite
- `npm test`: executa o script de teste configurado (placeholder)

No diretório **backend**:

- `npm start`: inicia a API/servidor
- `npm test`: executa testes, se existirem

---

## Contribuições

Contribuições são bem-vindas! Para colaborar:

1. Crie um fork deste repositório
2. Abra uma branch com sua feature: `git checkout -b minha-feature`
3. Commit suas alterações: `git commit -m "Minha feature"`
4. Faça push: `git push origin minha-feature`
5. Abra um Pull Request

---

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE.txt).

