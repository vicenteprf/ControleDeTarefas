# 📋 Controle de Tarefas

Aplicação full stack de gerenciamento de tarefas com autenticação, CRUD completo e recuperação de senha por e-mail.

---

## 🚀 Funcionalidades

- Cadastro e login de usuários com autenticação JWT
- Criação, edição, exclusão e listagem de tarefas
- Alternância de status entre pendente e concluída
- Filtro de tarefas por status (todas, pendentes, concluídas)
- Recuperação e redefinição de senha por e-mail
- Feedback visual com toasts e loading states
- Rotas protegidas por autenticação

---

## 🛠️ Tecnologias utilizadas

### Backend

- **Node.js** — Ambiente de execução JavaScript no servidor
- **Express 5** — Framework para criação da API REST
- **TypeScript** — Tipagem estática para maior segurança no código
- **Prisma ORM** — Gerenciamento do banco de dados com migrations e type-safety
- **PostgreSQL** — Banco de dados relacional (hospedado no Supabase)
- **bcryptjs** — Hash seguro de senhas
- **JSON Web Token (JWT)** — Autenticação stateless via token
- **Nodemailer** — Envio de e-mails para recuperação de senha
- **Yup** — Validação de dados nas requisições
- **dotenv** — Gerenciamento de variáveis de ambiente

### Frontend

- **React** — Biblioteca para construção de interfaces
- **Vite** — Bundler moderno e rápido
- **TypeScript** — Tipagem estática nos componentes e serviços
- **Tailwind CSS** — Estilização utilitária
- **Axios** — Cliente HTTP para consumo da API
- **React Router DOM** — Navegação entre páginas
- **react-hot-toast** — Notificações de feedback ao usuário
- **react-spinners** — Indicadores de carregamento
- **react-icons** — Ícones para a interface

---

## ⚙️ Como rodar o projeto

### Pré-requisitos

- Node.js instalado
- PostgreSQL disponível (local ou via Supabase)
- Conta Gmail configurada para envio de e-mails (Nodemailer)

### Backend

1. Acesse a pasta do backend e instale as dependências:

```bash
npm install
```

2. Crie um arquivo `.env` na raiz do backend com as variáveis:

```env
DATABASE_URL=sua_url_do_banco
DIRECT_URL=sua_direct_url_do_banco
JWT_SECRET=sua_chave_secreta
PORT=3333
EMAIL_USER=seuemail@gmail.com
EMAIL_PASS=sua_senha_de_app
```

3. Rode as migrations do banco de dados:

```bash
npx prisma migrate dev
```

4. Gere o Prisma Client:

```bash
npx prisma generate
```

5. Inicie o servidor:

```bash
npm run dev
```

### Frontend

1. Acesse a pasta do frontend e instale as dependências:

```bash
npm install
```

2. Crie um arquivo `.env` na raiz do frontend:

```env
VITE_API_URL=http://localhost:3333
```

3. Inicie a aplicação:

```bash
npm run dev
```

4. Acesse no navegador: `http://localhost:5173`

---

## 📁 Estrutura do projeto

```
backend/
├── src/
│   ├── config/         # Configurações (JWT)
│   ├── controllers/    # Lógica de negócio (User, Session, Task)
│   ├── middlewares/    # Middleware de autenticação JWT
│   ├── routes/         # Definição das rotas da API
│   ├── types/          # Tipagens customizadas do Express
│   ├── app.ts          # Configuração do Express
│   └── server.ts       # Inicialização do servidor
├── prisma/
│   └── schema.prisma   # Models do banco de dados
└── .env

frontend/
├── src/
│   ├── components/     # Componentes reutilizáveis (ProtectedRoute)
│   ├── pages/          # Páginas da aplicação
│   ├── services/       # Configuração do Axios
│   ├── types/          # Tipagens globais
│   └── App.tsx         # Configuração das rotas
└── .env
```

---

## 🔐 Rotas da API

| Método | Rota             | Descrição                      | Autenticação |
| ------ | ---------------- | ------------------------------ | ------------ |
| POST   | /users           | Cadastro de usuário            | Não          |
| POST   | /sessions        | Login                          | Não          |
| POST   | /password/forgot | Solicitar recuperação de senha | Não          |
| POST   | /password/reset  | Redefinir senha                | Não          |
| GET    | /tasks           | Listar tarefas do usuário      | Sim          |
| POST   | /task            | Criar tarefa                   | Sim          |
| PUT    | /task/:id        | Editar tarefa                  | Sim          |
| DELETE | /task/:id        | Excluir tarefa                 | Sim          |

---

## 📚 O que aprendi com esse projeto

### Backend

- Como estruturar uma API REST com Express e TypeScript seguindo separação de responsabilidades entre controllers, middlewares e rotas
- Como usar o Prisma ORM para modelar o banco de dados, criar migrations e consultar dados de forma type-safe
- Como implementar autenticação com JWT, desde a geração do token no login até a validação em um middleware reutilizável
- Como estender tipos nativos do TypeScript, como adicionar `userId` à interface `Request` do Express via declaration merging
- Como fazer hash de senhas com bcryptjs e nunca armazenar senhas em texto puro
- Como implementar um fluxo completo de recuperação de senha com token temporário e expiração via Nodemailer
- Como validar dados de entrada com Yup e retornar erros claros para o cliente

### Frontend

- Como criar rotas protegidas no React Router DOM verificando o token no localStorage
- Como organizar chamadas HTTP com Axios em um serviço centralizado com base URL configurável via variável de ambiente
- Como gerenciar estados de loading por ação individual, evitando bloquear a interface inteira durante operações assíncronas
- Como substituir mensagens de erro estáticas por toasts dinâmicos com react-hot-toast para melhor experiência do usuário
- Como filtrar listas no frontend sem precisar fazer novas chamadas à API
- Como tratar erros 401 de forma consistente redirecionando o usuário para o login automaticamente

### Geral

- Como organizar um projeto full stack com commits convencionais seguindo um roadmap incremental
- A importância de nunca versionar arquivos `.env` com dados sensíveis
- Como conectar o banco PostgreSQL via Supabase para ter um ambiente de produção funcional

---

## 👨‍💻 Autor

Desenvolvido como projeto de estudo full stack.
