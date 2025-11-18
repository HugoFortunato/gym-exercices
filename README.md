# Gym Exercices API

API de gerenciamento de exercícios de academia construída com **NestJS**, **Prisma**, **PostgreSQL**, **Redis** e **GraphQL**.

🚀 Com implementação de:
- **Cache com Redis** na listagem de tarefas para melhor performance!
- **GraphQL API** com Apollo Server e Playground interativo!

## 🚀 Quick Start

### Pré-requisitos

- Node.js (versão 18+)
- Docker e Docker Compose
- npm ou yarn

### 1️⃣ Instalação

```bash
npm install
```

### 2️⃣ Configurar o banco de dados

Crie um arquivo `.env` na raiz do projeto:

```bash
DATABASE_URL="postgresql://gym_user:gym_password@localhost:5432/gym_db?schema=public"
```

### 3️⃣ Iniciar o PostgreSQL com Docker

```bash
docker-compose up -d
```

Aguarde alguns segundos para o banco estar pronto.

### 4️⃣ Executar as migrações do Prisma

```bash
npx prisma migrate dev --name init
```

Isso irá criar as tabelas no banco de dados.

### 5️⃣ Iniciar o servidor

```bash
npm run start:dev
```

O servidor estará disponível em `http://localhost:3000`

## 📚 Endpoints

### Health Check / Hello World
```
GET /tasks
```

Retorna informações sobre a API e endpoints disponíveis.

### Listar todas as tarefas
```
GET /tasks/list
```

### Obter uma tarefa específica
```
GET /tasks/:id
```

### Criar uma nova tarefa
```
POST /tasks
Content-Type: application/json

{
  "title": "Tarefa 1",
  "description": "Descrição da tarefa"
}
```

### Atualizar uma tarefa
```
PUT /tasks/:id
Content-Type: application/json

{
  "title": "Tarefa atualizada",
  "description": "Nova descrição"
}
```

### Alternar status de conclusão
```
PATCH /tasks/:id/toggle
```

### Deletar uma tarefa
```
DELETE /tasks/:id
```

## 🗄️ Estrutura do Projeto

```
src/
├── main.ts              # Ponto de entrada da aplicação
├── app.module.ts        # Módulo principal
├── tasks/               # Módulo de tarefas
│   ├── tasks.controller.ts
│   ├── tasks.service.ts
│   ├── tasks.module.ts
│   └── dto/
│       └── create-task.dto.ts
├── prisma/
│   └── schema.prisma    # Schema do banco de dados
└── ...
```

## 🛠️ Comandos Úteis

### Desenvolvimento
```bash
npm run start:dev       # Inicia com hot reload
npm run start:debug     # Inicia em modo debug
```

### Build
```bash
npm run build           # Compila para produção
npm run start:prod      # Executa a versão compilada
```

### Banco de dados
```bash
npx prisma studio      # Abre o Prisma Studio (visualizador de dados)
npx prisma migrate dev # Cria nova migração
npx prisma db seed     # Executa seed (se configurado)
```

### Linting
```bash
npm run lint            # Executa ESLint
npm run format          # Formata o código
```

## 🐳 Docker

### Parar o banco de dados
```bash
docker-compose down
```

### Ver logs
```bash
docker-compose logs -f postgres
```

### Remover dados do banco
```bash
docker-compose down -v
```

## 🔴 Redis Cache

O projeto já possui **Redis implementado na listagem de tarefas**!

- Primeira requisição: busca do banco (50-200ms)
- Requisições seguintes: retorna do cache (1-5ms)
- Cache expira automaticamente após 5 minutos
- Cache é invalidado ao criar/atualizar/deletar tarefas

## 🎨 GraphQL API

GraphQL implementado com Apollo Server:

- **Playground:** `http://localhost:3000/graphql`
- **2 Queries:** `tasks` e `task(id: Int!)`
- **Cache Redis** funcionando

Veja [docs/graphql/GRAPHQL_SETUP.md](./docs/graphql/GRAPHQL_SETUP.md) para detalhes

## 📝 Próximas etapas

1. Expandir cache para outras endpoints
2. Implementar autenticação e autorização
3. Adicionar validações com `class-validator`
4. Criar testes unitários e de integração
5. Adicionar documentação com Swagger
6. Implementar tratamento de erros global
7. Adicionar logging estruturado

## 📚 Documentação

**Toda a documentação está organizada na pasta [docs/](./docs/)**

- 🚀 **Setup:** [docs/setup/](./docs/setup/) - Instalação e configuração
- 🎨 **GraphQL:** [docs/graphql/](./docs/graphql/) - API GraphQL
- 🔴 **Redis:** [docs/redis/](./docs/redis/) - Cache e performance

Ver [índice completo da documentação](./docs/README.md)

## 📖 Referências

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
