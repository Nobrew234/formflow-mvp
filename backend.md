# Plano de Implementação do Backend - ChatFlow

Este documento descreve o plano para substituir a implementação mockada por um backend real usando Node.js, Express, PostgreSQL e Drizzle ORM.

---

## 🚀 Visão Geral

O objetivo é construir uma API RESTful robusta que dará suporte a todas as funcionalidades atualmente mockadas no frontend, incluindo autenticação de usuários, gerenciamento de bots (CRUD), salvamento de fluxos de chat e coleta de respostas.

**Stack Tecnológica:**
- **Runtime:** Node.js com `tsx`
- **Framework:** Express
- **Banco de Dados:** PostgreSQL
- **ORM:** Drizzle ORM
- **Validação:** Zod e `drizzle-zod`

---

## 📋 Fase 1: Configuração e Schema do Banco de Dados

### 1.1. Setup do Ambiente
- [ ] **Instalar e configurar o PostgreSQL:** Garantir que uma instância do PostgreSQL esteja rodando localmente (ou em um serviço como o Docker).
- [ ] **Criar o banco de dados:** Criar um banco de dados chamado `chatflow_dev`.
- [ ] **Variáveis de Ambiente:** Criar um arquivo `.env` na raiz do projeto para armazenar a URL de conexão do banco de dados (`DATABASE_URL`). O arquivo `server/storage.ts` provavelmente precisará ser ajustado para ler esta variável.

### 1.2. Definição do Schema com Drizzle ORM
- [ ] **Local do Schema:** O schema será definido em `shared/schema.ts` para ser compartilhado entre o backend e, potencialmente, o frontend.
- [ ] **Tabela `users`:**
  - `id` (serial, primary key)
  - `email` (varchar, unique, not null)
  - `password_hash` (varchar, not null)
  - `created_at` (timestamp, default now)
- [ ] **Tabela `bots`:**
  - `id` (serial, primary key)
  - `user_id` (integer, foreign key para `users.id`)
  - `name` (varchar, not null)
  - `flow` (jsonb, para armazenar a estrutura do React Flow)
  - `status` (varchar, ex: 'draft', 'published')
  - `created_at` (timestamp, default now)
  - `updated_at` (timestamp, default now)
- [ ] **Tabela `responses`:**
  - `id` (serial, primary key)
  - `bot_id` (integer, foreign key para `bots.id`)
  - `data` (jsonb, para armazenar as respostas do formulário)
  - `submitted_at` (timestamp, default now)

### 1.3. Migrations
- [ ] **Configurar Drizzle Kit:** Instalar `drizzle-kit` como uma dependência de desenvolvimento.
- [ ] **Criar script de migration:** Adicionar um script no `package.json` para gerar migrações (ex: `"db:generate": "drizzle-kit generate"`).
- [ ] **Gerar e aplicar a primeira migração:** Executar o script para criar os arquivos de migração e outro script para aplicá-los ao banco de dados.

---

## 📋 Fase 2: Implementação da API (Backend)

O trabalho será concentrado nos arquivos `server/index.ts` e `server/routes.ts`.

### 2.1. Autenticação
- [ ] **Endpoint `POST /api/auth/signup`:**
  - Validar `email` e `password` com Zod.
  - Gerar hash da senha (usar `bcrypt`).
  - Criar um novo usuário no banco de dados.
  - Retornar um token JWT para o cliente.
- [ ] **Endpoint `POST /api/auth/login`:**
  - Validar `email` e `password`.
  - Encontrar o usuário pelo email.
  - Comparar o hash da senha.
  - Retornar um token JWT.
- [ ] **Middleware de Autenticação:**
  - Criar um middleware para Express que verifica o token JWT em rotas protegidas.

### 2.2. Gerenciamento de Bots (CRUD)
- [ ] **Endpoint `GET /api/bots` (Protegido):**
  - Obter o `user_id` do token JWT.
  - Listar todos os bots associados ao usuário.
- [ ] **Endpoint `POST /api/bots` (Protegido):**
  - Criar um novo bot associado ao usuário.
  - Receber `name` no corpo da requisição.
  - Retornar o bot recém-criado.
- [ ] **Endpoint `GET /api/bots/:id` (Protegido):**
  - Obter um bot específico pelo ID, garantindo que ele pertença ao usuário logado.
- [ ] **Endpoint `PUT /api/bots/:id` (Protegido):**
  - Atualizar o `name` ou o `flow` (estrutura do React Flow) de um bot.
- [ ] **Endpoint `DELETE /api/bots/:id` (Protegido):**
  - Deletar um bot.

### 2.3. Respostas do Formulário
- [ ] **Endpoint `POST /api/forms/:botId/responses` (Público):**
  - Receber os dados do formulário preenchido.
  - Salvar os dados na tabela `responses`, associando ao `bot_id`.
- [ ] **Endpoint `GET /api/bots/:botId/responses` (Protegido):**
  - Listar todas as respostas para um bot específico, garantindo que o bot pertença ao usuário logado.

---

## 📋 Fase 3: Integração com o Frontend

Nesta fase, vamos modificar o código do cliente em `client/src` para usar a nova API.

### 3.1. Substituir Hooks Mockados
- [ ] **`hooks/useMockAuth.ts` -> `hooks/useAuth.ts`:**
  - Reescrever o hook para fazer chamadas reais aos endpoints `/api/auth/signup` e `/api/auth/login` usando `fetch` ou uma biblioteca como `axios`.
  - Gerenciar o token JWT (armazenar em `localStorage` ou `sessionStorage`).
  - Usar React Query para gerenciar o estado do usuário.
- [ ] **`hooks/useMockForms.ts` -> `hooks/useForms.ts`:**
  - Reescrever os hooks para interagir com os endpoints `/api/bots` e `/api/bots/:id/responses`.
  - Usar React Query para buscar, criar, atualizar e deletar bots, invalidando os caches conforme necessário.

### 3.2. Atualizar Componentes
- [ ] **Páginas `Login.tsx` e `Signup.tsx`:**
  - Integrar com o novo `useAuth` hook.
- [ ] **Página `Dashboard.tsx`:**
  - Usar o novo `useForms` para listar os bots do usuário.
- [ ] **Página `Editor.tsx`:**
  - Implementar a função de "Salvar" para enviar a estrutura do `flow` para o endpoint `PUT /api/bots/:id`.
  - Carregar os dados do bot ao iniciar a página.
- [ ] **Página `FormView.tsx`:**
  - Ao submeter o formulário, enviar os dados para `POST /api/forms/:botId/responses`.
- [ ] **Página `Responses.tsx`:**
  - Buscar e exibir as respostas do endpoint `GET /api/bots/:botId/responses`.

---

## ✅ Critérios de Conclusão

- Todas as funcionalidades que antes usavam dados mockados devem estar totalmente funcionais com o backend.
- O fluxo de autenticação deve ser seguro, utilizando senhas com hash e tokens JWT.
- Os dados devem persistir no banco de dados PostgreSQL.
- O frontend deve fornecer feedback adequado ao usuário durante as chamadas de API (loading, success, error).
