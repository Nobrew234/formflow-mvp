# ChatFlow - Plano de Implementação MVP (Protótipo Frontend)

**Nota:** Este documento descreve o plano para um protótipo de frontend. Todas as funcionalidades de backend, como banco de dados e APIs, são simuladas (mocked) para focar na experiência do usuário.

---

## 📋 Fase 0: Setup e Infraestrutura

### Setup Inicial
- [x] Configurar projeto **Vite + React**
- [x] Estrutura de pastas (pages, components, hooks, lib)
- [x] Configurar TailwindCSS para estilização
- [x] Instalar bibliotecas de ícones (Lucide React)

### Autenticação (Mocked)
- [x] Simular fluxo de autenticação no frontend
- [x] Criar páginas de login/registro com formulários
- [x] Gerenciar estado de "usuário logado" localmente

---

## 📋 Fase 1: Autenticação e Dashboard Básico

### Páginas de Autenticação
- [x] **RF001:** Página de cadastro
  - [x] Formulário email/senha
  - [x] Validações de formulário (ex: senha com 8+ caracteres)
  - [x] Feedback de erros
- [x] **RF002:** Página de login
  - [x] Formulário de login

### Dashboard Inicial
- [x] **RF017:** Layout do dashboard
  - [x] Header com logo e menu de usuário
  - [x] Sidebar de navegação
  - [x] Área principal para conteúdo
- [x] Página "Meus Bots" (com lista de exemplos)
- [x] Botão "Criar Novo Bot"
- [x] Funcionalidade de Logout (limpar estado local)

---

## 📋 Fase 2: CRUD de Bots e Editor Base

### Gerenciamento de Bots
- [x] **RF018:** Criar novo bot
  - [x] Modal ou página de criação
  - [x] Campo de nome
- [x] **RF017:** Lista de bots
  - [x] Cards com informações (nome, data, status)
  - [x] Indicador de nº de respostas
  - [x] Busca por nome (mocked)
- [x] **RF018:** Ações de bot (mocked)
  - [x] Editar (leva para a página do editor)
  - [x] Duplicar bot
  - [x] Excluir (com confirmação)
  - [x] Renomear

### Editor - Estrutura Base
- [x] Layout do editor
  - [x] Header (nome do bot, salvar, preview, publicar)
  - [x] Sidebar esquerda (blocos disponíveis)
  - [x] Canvas central
  - [x] Painel direito (configurações do bloco selecionado)
- [x] Canvas infinito
  - [x] Implementado com **React Flow**
  - [x] Zoom in/out
  - [x] Pan (arrastar canvas)
  - [x] Grid de fundo

---

## 📋 Fase 3: Sistema de Blocos - Parte 1

### Drag & Drop de Blocos
- [x] **RF005:** Sidebar com blocos
  - [x] Lista de blocos disponíveis (Texto, Pergunta, etc.)
  - [x] Ícones e descrições
  - [x] Arrastar blocos para o canvas
- [x] **RF005:** Drop no canvas
  - [x] Criar o bloco na posição correta

### Blocos Básicos - Estrutura
- [x] Componente base para um bloco
  - [x] Header com ícone e título
  - [x] Área de conteúdo customizável
  - [x] Pontos de conexão (handles) para entrada e saída
- [x] **RF009:** Bloco de Texto/Mensagem
  - [x] Campo para inserir o texto da mensagem
- [x] **RF010:** Bloco de Pergunta (Texto)
  - [x] Campo para o texto da pergunta
  - [x] Opção para marcar como obrigatório
  - [x] Campo para definir o nome da variável onde a resposta será salva

### Painel de Configuração
- [x] Painel lateral direito que abre ao selecionar um bloco
- [x] Exibe campos específicos para o tipo de bloco selecionado
- [x] Botão "Deletar bloco"

---

## 📋 Fase 4: Sistema de Blocos - Parte 2

### Mais Tipos de Blocos
- [x] **RF010:** Bloco de Email
  - [x] Input com validação de email
- [x] **RF010:** Bloco de Número
  - [x] Input numérico com opções de mínimo/máximo
- [x] **RF011:** Bloco de Múltipla Escolha
  - [x] Adicionar/remover opções
  - [x] Cada opção gera um ponto de saída (handle) no bloco
- [x] Bloco de Início (adicionado por padrão)
- [x] Bloco de Fim

---

## 📋 Fase 5: Conexões e Fluxo

### Sistema de Conexões
- [x] **RF006:** Criar conexões
  - [x] Clicar e arrastar entre os pontos de conexão
  - [x] Linha de preview durante o arraste
- [x] **RF006:** Validação de conexões
  - [x] Impedir que uma saída se conecte a múltiplas entradas
- [x] **RF006:** Deletar conexões
  - [x] Selecionar a linha e pressionar "delete" ou clicar em um ícone
- [x] Indicação visual de fluxo (setas na conexão)

### Lógica Condicional
- [ ] **RF012:** Bloco Condicional (a ser definido)
  - [ ] Selecionar uma variável
  - [ ] Escolher um operador (igual, diferente, etc.)
  - [ ] Definir um valor para comparação
  - [ ] Duas saídas (se verdadeiro / se falso)

---

## 📋 Fase 6: Experiência de Formulário e Preview

### Visualização do Formulário (`FormView`)
- [x] Página de visualização do bot para o usuário final
- [x] Renderiza a experiência de preenchimento do formulário

### Experiência de Chat (`FormChatExperience`)
- [x] Componente de formulário conversacional
- [x] Faz perguntas sequenciais ao usuário
- [x] Valida respostas em tempo real
- [x] Suporta diferentes tipos de input (texto, email, múltipla escolha)
- [x] Tela de conclusão após o preenchimento

### Chat de Ajuda (`FormChat`)
- [x] Componente de chat de ajuda opcional
- [x] Respostas pré-definidas para perguntas comuns

---

## 📋 Fase 7: Visualização de Respostas

### Página de Respostas
- [x] Tabela de respostas de um formulário
- [x] Visualização individual de uma resposta
- [x] Opção para exportar respostas (simulado)

---

## 🌟 Funcionalidades Adicionais (Pós-MVP)

- [ ] Bloco de Agendamento (integração com Google Calendar)
- [ ] Bloco de Pagamento (integração com Stripe)
- [ ] Análise de dados (gráficos de conversão)
- [ ] Templates de bots pré-prontos
- [ ] Modo Colaborativo (múltiplos usuários editando o mesmo bot)
- [ ] Integração com WhatsApp / Messenger
