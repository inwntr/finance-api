# Finance API 💸

API REST do **Finance App**, desenvolvida para gerenciar finanças pessoais de forma simples, segura e organizada.

Responsável por autenticação, movimentações financeiras, upload de comprovantes e integração com banco de dados.

---

## ✨ Sobre o projeto

A **Finance API** é o backend do app Finance, responsável por:

- autenticação de usuários
- gerenciamento de entradas e saídas
- upload de imagens/comprovantes
- organização de transações financeiras
- persistência segura dos dados
- integração com serviços externos

A API foi construída com foco em performance, escalabilidade e uma estrutura limpa para manutenção.

---

## 🚀 Tecnologias utilizadas

Este projeto foi desenvolvido com as seguintes tecnologias:

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- Neon
- JWT
- Multer
- Cloudinary

---

## 🏗️ Arquitetura

A aplicação segue uma arquitetura simples e organizada, separando responsabilidades para facilitar manutenção e escalabilidade.

```bash
src/
├── config/         # Configurações gerais
├── controllers/    # Regras de entrada e resposta
├── middlewares/    # Autenticação e validações
├── routes/         # Rotas da aplicação
├── prisma/         # Prisma client e schema
├── utils/          # Funções auxiliares
└── server.js       # Inicialização do servidor
```

---

## 🔐 Autenticação

A autenticação é feita com **JWT (JSON Web Token)**, garantindo segurança nas rotas privadas.

### Fluxo de autenticação

1. Usuário realiza login
2. API valida as credenciais
3. Token JWT é gerado
4. Cliente envia o token nas rotas protegidas
5. API valida o token antes de liberar o acesso

### Header esperado

```http
Authorization: Bearer seu_token_aqui
```

---

## 📦 Funcionalidades

### 👤 Usuário

- Cadastro de usuário
- Login com autenticação JWT
- Perfil do usuário

### 💰 Transações

- Criar transações
- Listar transações
- Atualizar transações
- Deletar transações
- Separação entre entradas e saídas

### 🧾 Uploads

- Upload de imagens/avatar
- Armazenamento em nuvem com Cloudinary
- Processamento com Multer

---

## ☁️ Upload de arquivos

O upload de arquivos é feito utilizando **Multer**, com envio para a **Cloudinary**.

Fluxo:

1. Usuário envia o arquivo
2. Multer processa o upload
3. Arquivo é enviado para a Cloudinary
4. A URL do arquivo é salva no banco de dados
5. O arquivo fica disponível para consulta

---

## 🗄️ Banco de dados

A aplicação utiliza **PostgreSQL** como banco de dados principal, hospedado na **Neon**.

### Vantagens da stack

- banco relacional robusto
- ótima performance
- escalável
- ideal para dados financeiros
- integração moderna com Prisma ORM

---

## ⚙️ ORM

O projeto utiliza **Prisma ORM** para manipulação do banco de dados.

Benefícios:

- queries mais seguras
- migrations organizadas
- produtividade no desenvolvimento
- melhor manutenção da base de dados

---

## 🔥 Como rodar o projeto

### Clone o repositório

```bash
git clone https://github.com/winterzinha/finance-api.git
```

### Acesse a pasta

```bash
cd finance-api
```

### Instale as dependências

```bash
npm install
```

### Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Rode as migrations

```bash
npx prisma migrate dev
```

### Inicie o servidor

```bash
npm run dev
```

---

## 📌 Scripts

```bash
npm run dev       # ambiente de desenvolvimento
npm run start     # ambiente de produção
npx prisma studio # visualizar banco
```

---

## 🌐 Endpoints

Exemplo de rotas da API:

```http
POST   /users/register
POST   /users/login
GET    /users/profile

GET    /transactions
POST   /transactions
PUT    /transactions/:id
DELETE /transactions/:id

POST   /upload
```

---

## 🔒 Segurança

Algumas práticas aplicadas no projeto:

- autenticação com JWT
- proteção de rotas privadas
- hash de senhas
- validação de dados
- separação de responsabilidades
- upload seguro de arquivos

---

## 📈 Futuras melhorias

A API foi pensada para permitir futuras expansões, como:

- relatórios financeiros
- filtros por período
- exportação em PDF
- dashboard analítico
- categorização de gastos
- metas financeiras

---

## 👨‍💻 Objetivo

Este projeto foi desenvolvido com foco em estudo, prática e construção de uma aplicação real de finanças, aplicando conceitos modernos de backend e boas práticas de desenvolvimento.

---

## 📄 Licença

Este projeto está sob a licença MIT.

Sinta-se livre para usar, estudar e modificar.

---

## 💚 Autor

Desenvolvido com café, teimosia e vontade de fazer um app bonito funcionar.
