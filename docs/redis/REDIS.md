# 🚀 Guia de Redis - Aprendizado Prático

## O que é Redis?

Redis é um **banco de dados em memória** extremamente rápido, usado principalmente para **cache**. É como ter um post-it na sua memória RAM em vez de ir procurar no disco/banco de dados.

### Características principais:
- ⚡ **Super rápido** - Tudo está na memória RAM
- 🔑 **Key-Value Store** - Armazena dados em formato chave-valor
- ⏱️ **TTL (Time To Live)** - Chaves expiram automaticamente
- 💾 **Persistência opcional** - Pode salvar em disco

---

## Como Está Implementado Neste Projeto

### 1. Serviço Redis (`src/redis/redis.service.ts`)

O `RedisService` fornece métodos simples para interagir com Redis:

```typescript
// Buscar valor do cache
const valor = await this.redisService.get('tasks:all');

// Armazenar valor (sem expiração)
await this.redisService.set('tasks:all', JSON.stringify(tasks));

// Armazenar com expiração (300 segundos = 5 minutos)
await this.redisService.set('tasks:all', JSON.stringify(tasks), 300);

// Deletar chave do cache
await this.redisService.del('tasks:all');

// Limpar todo o cache
await this.redisService.flushAll();
```

### 2. Service findAll com Cache (`src/tasks/tasks.service.ts`)

O método `findAll()` agora funciona assim:

```
┌─────────────────────────────────────────────────────────┐
│ Primeira Requisição GET /tasks/list                     │
├─────────────────────────────────────────────────────────┤
│ 1. Tenta buscar do Redis                                │
│ 2. ❌ NÃO ENCONTRA (Cache vazio)                         │
│ 3. ✅ Busca do Banco de Dados (PostgreSQL)              │
│ 4. 💾 Armazena no Redis por 5 minutos                    │
│ 5. Retorna dados (levou uns 50-200ms)                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Segunda Requisição GET /tasks/list (nos próximos 5min)  │
├─────────────────────────────────────────────────────────┤
│ 1. Tenta buscar do Redis                                │
│ 2. ✅ ENCONTRA NO CACHE!                                 │
│ 3. Retorna dados INSTANTANEAMENTE (levou ~1ms)          │
│ 4. ⛔ Não vai no Banco de Dados                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Quando você CRIA/ATUALIZA/DELETA uma tarefa             │
├─────────────────────────────────────────────────────────┤
│ 1. Executa a ação no Banco                              │
│ 2. 🗑️  DELETA a chave do cache automaticamente           │
│ 3. Na próxima requisição, refaz o cache com dados novos │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Como Testar

### Passo 1: Subir os containers

```bash
docker-compose up -d
```

Aguarde alguns segundos. Verifique se ambos estão rodando:

```bash
docker-compose ps
```

Você deve ver:
- ✅ `gym_postgres` (Port 5432)
- ✅ `gym_redis` (Port 6379)

### Passo 2: Preparar o banco

```bash
npm run prisma:migrate
npm run prisma:seed
```

### Passo 3: Rodar o servidor

```bash
npm run start:dev
```

Você verá nos logs:
```
✅ Conectado ao Redis com sucesso!
```

---

## 📊 Testando o Cache em Ação

### Opção 1: Via Curl (Terminal)

**Primeira requisição (vai no banco):**
```bash
curl http://localhost:3000/tasks/list
```

Nos **logs do terminal**, você verá:
```
❌ Cache MISS para chave: tasks:all
📌 Tarefas buscadas do BANCO DE DADOS e cacheadas
💾 Cache SET para chave: tasks:all (expira em 300s)
```

**Segunda requisição (vai no cache) - faça em menos de 5 minutos:**
```bash
curl http://localhost:3000/tasks/list
```

Nos **logs do terminal**, você verá:
```
💾 Cache HIT para chave: tasks:all
📌 Retornando tarefas do CACHE
```

**Agora crie uma tarefa (invalida o cache):**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nova Tarefa Test",
    "description": "Teste de cache"
  }'
```

Nos **logs do terminal**, você verá:
```
🗑️  Cache invalidado após criar tarefa
```

**Próxima requisição de listagem vai no banco novamente:**
```bash
curl http://localhost:3000/tasks/list
```

Logs:
```
❌ Cache MISS para chave: tasks:all
📌 Tarefas buscadas do BANCO DE DADOS e cacheadas
```

---

### Opção 2: Insomnia/Postman

1. Crie uma Collection chamada "Gym API"
2. Adicione requisições:

**GET - Listar com Cache**
```
GET http://localhost:3000/tasks/list
```

**POST - Criar (invalida cache)**
```
POST http://localhost:3000/tasks
Headers: Content-Type: application/json

Body (raw):
{
  "title": "Treino Perna",
  "description": "5 séries de 10 repetições"
}
```

Faça as requisições de GET várias vezes entre os 5 minutos e observe os logs!

---

### Opção 3: Inspeção Direta no Redis (CLI)

Conectar no Redis:
```bash
docker exec -it gym_redis redis-cli
```

Dentro do CLI do Redis:
```redis
# Ver todas as chaves
KEYS *

# Ver valor de uma chave (em JSON formatado)
GET tasks:all

# Ver TTL (tempo que falta pra expirar)
TTL tasks:all

# Deletar manualmente uma chave
DEL tasks:all

# Limpar todo o Redis
FLUSHALL

# Sair
EXIT
```

---

## 📈 Performance Comparison

### Sem Cache (Banco direto):
```
Tempo médio: 50-200ms
Depende de: quantidade de dados, índices, CPU do BD
```

### Com Cache (Redis):
```
Tempo médio: 1-5ms
Depende de: tamanho dos dados em memória
```

**Melhoria de Performance: 50-200x MAIS RÁPIDO!** 🚀

---

## 🎯 Conceitos Aprendidos

1. **Cache Strategy** - Armazenar dados frequentemente acessados na memória
2. **Cache Invalidation** - Remover cache quando dados são modificados
3. **TTL (Time To Live)** - Fazer cache expirar automaticamente
4. **Key Naming Convention** - Usar nomes descritivos como `tasks:all`, `user:123:profile`
5. **Fallback** - Se Redis falhar, continuar funcionando com o banco

---

## 💡 Próximos Passos

1. **Cache individual**: Implementar cache para `findOne(id)`
2. **Cache patterns**: Learn sobre diferentes estratégias
3. **Invalidation**: Melhorar lógica de invalidação
4. **TTL dinâmico**: Variar tempo de expiração por tipo de dado
5. **Monitoring**: Usar Redis Commander para UI visual

---

## 🆘 Troubleshooting

### Redis não conecta
```bash
# Verificar se está rodando
docker ps | grep redis

# Ver logs
docker logs gym_redis

# Reconectar
docker-compose restart redis
```

### Cache não funciona
```bash
# Limpar tudo
docker exec gym_redis redis-cli FLUSHALL

# Verificar conexão nos logs da app
npm run start:dev
# Procure por "Conectado ao Redis"
```

### Porta já em uso
```bash
# Matar processo na porta 6379
lsof -i :6379
kill -9 <PID>

# Ou usar porta diferente no docker-compose.yml
```

---

## 📚 Recursos Extras

- [Redis Official Docs](https://redis.io/docs/)
- [ioredis Library](https://github.com/luin/ioredis)
- [Redis Best Practices](https://redis.io/docs/manual/client-side-caching/)
- [NestJS Redis Integration](https://docs.nestjs.com/)
