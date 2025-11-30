# Super Chat - UI

Este projeto representa a interface de usuário (UI) do nosso sistema de chat em tempo real, construído com React, TypeScript e Tailwind CSS.

O objetivo principal deste front-end é fornecer uma experiência de usuário rica, simulando as funcionalidades de um aplicativo de chat moderno (como o Discord), e demonstrando a integração com a API do Back-end via WebSockets.

---

## 💻 Funcionalidades Principais

Além da troca básica de mensagens, a aplicação cliente implementa lógicas complexas de UI e estado para simular um ambiente de chat completo:

### 1. Comunicação em Tempo Real

* **Socket.io Integration:** Integração real para conexão e manipulação de eventos de mensagem recebidos pelo servidor.
* **Mensageria:** Envio de mensagens.

### 2. Gestão de Salas

* **Criação de Salas:**  
  - Botão visível para criar nova sala.  
  - Formulário simples (nome, descrição).  

* **Exclusão de Salas:**  
  - Opção de "Excluir sala" disponível apenas para o dono.  
  - Confirmação via modal para evitar exclusões acidentais.  

* **Entrada/Saída de Salas:**
  - Um único clique na sala e já adiciona o usuário à sala. 
  - Atualização em tempo real.    

* **Listagem de Salas:**  
  - Aba do menu separado para **Minhas Salas** e **Salas Disponíveis**.    
  - Busca para facilitar navegação em muitas salas.  

### 3. Mensagens

* No **front-end**, disponível apenas o **disparo simples de mensagens**.  
* No **back-end**, a arquitetura completa para mensagens enriquecidas já está implementada e pronta para integração.

### 4. Arquitetura e Estado

* **Autenticação:** Telas de Login/Registro e gerenciamento do estado global do usuário.
---

## 🛠️ Stack Tecnológica

| Componente             | Tecnologia                        | Observações                                                                 |
|------------------------|-----------------------------------|------------------------------------------------------------------------------|
| **Framework**          | React (Hooks & Functional Components) | Biblioteca principal para a construção da UI.                               |
| **Tooling**            | Vite                              | Empacotador e servidor de desenvolvimento rápido.                           |
| **Linguagem**          | TypeScript                        | Garante tipagem segura e maior manutenibilidade.                            |
| **Estilização**        | Tailwind CSS                      | Framework utilitário para design responsivo e rápido.                       |
| **Gerenciamento de Estado** | React Context API & useState       | Utilizado para gerenciar a autenticação e o estado do chat (salas, mensagens, notificações). |


---

## 📁 Estrutura de Diretórios

O projeto adota uma estrutura modular baseada na organização de funcionalidades e tipos de arquivos, seguindo as melhores práticas do ecossistema React/Vite.

| Diretório              | Propósito                        | Observações                                                                 |
|------------------------|----------------------------------|------------------------------------------------------------------------------|
| **src/**               | Código-fonte Principal           | Contém toda a lógica e componentes da aplicação.                            |
| **src/api**            | Comunicação com Back-end         | Implementação das chamadas REST (`api.ts`) e WebSockets (`socket.ts`) para o Back-end. |
| **src/assets**         | Arquivos Estáticos               | Ícones, imagens e outros recursos que não são código.                       |
| **src/components**     | Componentes Reutilizáveis        | Elementos de UI isolados.            |
| **src/context**        | Gerenciamento de Estado          | Arquivos para Context API (`authContext.tsx`, `chatContext.tsx`) que gerenciam o estado global. |
| **src/pages**          | Rotas da Aplicação               | Contém os componentes que representam as telas principais (ex: `chatPage.tsx`, `authPage.tsx`). |
| **src/services**       | Lógica de Serviço                | Funções auxiliares e serviços que isolam a lógica de negócio (ex: `authService.ts`). |
| **src/types**          | Definições de Tipos              | Arquivos TypeScript para definir interfaces e tipos de dados utilizados em todo o projeto. |

---

## ⚙️ Configuração e Execução Local

### 1. Pré-requisitos

Para executar o Back-end, você precisa ter instalado:
* [**Node.js**](https://nodejs.org/en/) (v22+ LTS)
* **npm**

### 2. Variáveis de Ambiente (`.env.example`)

Crie um arquivo `.env` na raiz do projeto, utilizando o `env.example` como base.

| Chave | Descrição | Valor Padrão/Exemplo |
| :--- | :--- | :--- |
| **`VITE_API_URL`** | URL do Back-end (Obrigatorio). | `http://localhost:3333` |

### 3. Instalação e Configuração da Aplicação Node

#### 1. Instalação de Dependências

```bash
npm install
```

### 2. Execução do Servidor

```bash
npm run dev
```
O servidor estará rodando em: http://localhost:5173

---

## 🌐 Uso e Testes
Após concluir todas as configurações, a aplicação pode ser testada diretamente pela **interface**.  

---

## 🐱‍🏍 O que eu faria se tivesse mais tempo

- **Responsividade de Layout**, adaptando a interface para diferentes dispositivos (tablet e mobile).
- **Componentização**, extraindo elementos das páginas para criar componentes reutilizáveis que melhoram performance e manutenção do código.
- **Mensagens enriquecidas**, incluindo:
  - Upload de imagens
  - Previews de links
  - Suporte a Markdown
  - Edição e exclusão de mensagens  
  *(estrutura inicial já feita no back-end, falta implementar no front)*  
- **Mensagens de ações**, para melhorar a interação com o usuário.
- **Notificações em tempo real**, utilizando a estrutura já pré-criada.
- **Lista de membros por sala**, exibindo quem está presente em cada sala.
- **Transferência de dono da sala**, permitindo que o criador delegue a propriedade.  
  *(estrutura inicial já feita no back-end, falta implementar no front)* 
