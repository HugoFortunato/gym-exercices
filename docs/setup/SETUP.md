# 🚀 Setup do Projeto

## Pré-requisitos
- Node.js 18+
- Docker e Docker Compose
- npm ou yarn

## 1️⃣ Instalação das Dependências

```bash
npm install
```

## 2️⃣ Iniciar o PostgreSQL

```bash
docker-compose up -d
```

Aguarde 10-15 segundos para o banco estar pronto.

## 3️⃣ Executar Migrações do Prisma

```bash
npm run prisma:migrate
```

Isso criará todas as tabelas no banco de dados.

## 4️⃣ Popular o Banco com Dados Iniciais (Seed)

```bash
npm run prisma:seed
```

Isso irá popular o banco com tarefas de exemplo para testes.

## 5️⃣ Iniciar o Backend

```bash
npm run start:dev
```

O servidor estará rodando em `http://localhost:3000`

---

## 📋 Comandos Úteis

### Prisma
```bash
npm run prisma:migrate   # Criar/executar migrações
npm run prisma:seed      # Popular banco com dados de teste
npm run prisma:studio    # Abrir interface visual do Prisma
```

### Backend
```bash
npm run start:dev        # Rodar com hot reload
npm run start:debug      # Rodar em modo debug
npm run build            # Compilar para produção
npm run start:prod       # Rodar versão compilada
```

### Code Quality
```bash
npm run lint             # Verificar e corrigir ESLint
npm run format           # Formatar código com Prettier
```

### Docker
```bash
docker-compose down      # Parar o banco
docker-compose logs -f   # Ver logs em tempo real
docker-compose down -v   # Remover banco e volumes
```

---

## 🔍 Testando a API

### Health Check
```bash
curl http://localhost:3000/tasks
```

### Listar Tarefas
```bash
curl http://localhost:3000/tasks/list
```

### Criar Tarefa
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nova Tarefa",
    "description": "Descrição da tarefa"
  }'
```

### Obter Tarefa por ID
```bash
curl http://localhost:3000/tasks/1
```

### Atualizar Tarefa
```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tarefa Atualizada",
    "description": "Nova descrição"
  }'
```

### Alternar Status de Conclusão
```bash
curl -X PATCH http://localhost:3000/tasks/1/toggle
```

### Deletar Tarefa
```bash
curl -X DELETE http://localhost:3000/tasks/1
```

---

## 🐛 Troubleshooting

### Banco não conecta
```bash
# Verificar logs do Docker
docker-compose logs postgres

# Resetar banco
docker-compose down -v
docker-compose up -d
```

### Prisma não encontra tabelas
```bash
# Regenerar cliente Prisma
npx prisma generate

# Recriar migrações
npx prisma migrate reset
```

### Porta 3000 já em uso
```bash
# Encontrar processo usando a porta
lsof -i :3000

# Matar processo
kill -9 <PID>
```

---

## 📚 Documentação

- [NestJS](https://docs.nestjs.com)
- [Prisma](https://www.prisma.io/docs/)
- [PostgreSQL](https://www.postgresql.org/docs/)
