# 📊 Diagramas do Redis

## 1. Fluxo de Requisição com Cache

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRIMEIRA REQUISIÇÃO                          │
│                  GET /tasks/list                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CLIENT                 CONTROLLER              SERVICE         │
│    │                        │                      │            │
│    ├──GET /tasks/list──────>│                      │            │
│    │                        ├──findAll()─────────>│            │
│    │                        │                      │            │
│    │                        │        ┌─────────────────────┐   │
│    │                        │        │ Buscar Redis        │   │
│    │                        │        │ tasks:all           │   │
│    │                        │        │ ❌ NÃO ENCONTRADO   │   │
│    │                        │        └─────────────────────┘   │
│    │                        │                      │            │
│    │                        │        ┌─────────────────────┐   │
│    │                        │        │ Buscar PostgreSQL   │   │
│    │                        │        │ (~150ms)            │   │
│    │                        │        └─────────────────────┘   │
│    │                        │                      │            │
│    │                        │        ┌─────────────────────┐   │
│    │                        │        │ Salvar no Redis     │   │
│    │                        │        │ TTL: 5 minutos      │   │
│    │                        │        └─────────────────────┘   │
│    │                        │                      │            │
│    │<────────────tasks─────────────────────────────┤            │
│    │                                                            │
│  ⏱️  TEMPO: ~150ms                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                    SEGUNDA REQUISIÇÃO                           │
│                  GET /tasks/list                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CLIENT                 CONTROLLER              SERVICE         │
│    │                        │                      │            │
│    ├──GET /tasks/list──────>│                      │            │
│    │                        ├──findAll()─────────>│            │
│    │                        │                      │            │
│    │                        │        ┌─────────────────────┐   │
│    │                        │        │ Buscar Redis        │   │
│    │                        │        │ tasks:all           │   │
│    │                        │        │ ✅ ENCONTRADO!      │   │
│    │                        │        │ (~2ms)              │   │
│    │                        │        └─────────────────────┘   │
│    │                        │                      │            │
│    │<────────────tasks─────────────────────────────┤            │
│    │                                                            │
│  ⏱️  TEMPO: ~2ms   (75x MAIS RÁPIDO!)                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Cache-Aside Pattern (Implementado)

```
                    REQUEST /tasks/list
                            │
                            ▼
                    ┌───────────────┐
                    │ Buscar Redis? │
                    └───────┬───────┘
                            │
                    ┌───────┴───────┐
                    │               │
              HIT ◀─┘               └─▶ MISS
                    │               │
            ✅ CACHE │               │ ❌ DB
              VALID │               │
                    │               │
                ┌───▼──────┐    ┌───▼──────────┐
                │ Retornar │    │ Buscar dados │
                │do CACHE  │    │ do banco     │
                │ ~2ms     │    │ ~150ms       │
                └───┬──────┘    └───┬──────────┘
                    │               │
                    │               ├──────────────┐
                    │               │ Salvar em    │
                    │               │ Redis/5min   │
                    │               │ TTL          │
                    │               └──────┬───────┘
                    │                      │
                    └──────────┬───────────┘
                               │
                          RESPONSE
                         (Client)
```

---

## 3. Invalidação de Cache

```
OPERAÇÃO DE ESCRITA
    │
    ├─ POST /tasks     (CREATE)
    ├─ PUT /tasks/:id  (UPDATE)
    └─ DELETE /tasks   (DELETE)
    │
    ▼
┌──────────────────────┐
│ Executar no BD       │
│ (Prisma)             │
└────────┬─────────────┘
         │
         ▼
    ✅ SUCESSO?
         │
         ├─ SIM ──────────────────┐
         │                        │
         │           ┌────────────▼────────┐
         │           │ DEL tasks:all       │
         │           │ (Limpar cache)      │
         │           └────────────┬────────┘
         │                        │
         │           ┌────────────▼────────┐
         │           │ Próxima requisição  │
         │           │ GET /tasks/list     │
         │           │ ↓                   │
         │           │ Cache MISS          │
         │           │ Refaz do banco      │
         │           └────────────────────┘
         │
         └─ NÃO ────> ERRO (não toca cache)
```

---

## 4. Timeline de 5 Minutos

```
TEMPO        AÇÃO                    ESTADO DO CACHE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
0s           GET /tasks/list         EMPTY
             ↓ Busca BD              MISS (~150ms)
             ↓ Armazena              SET (5 min TTL)

5s           GET /tasks/list         VALID ✅
             ↓ Cache HIT             (~2ms)

50s          GET /tasks/list         VALID ✅
             ↓ Cache HIT             (~2ms)

120s         POST /tasks (criar)     DELETE 🗑️
             ↓ Invalida cache

125s         GET /tasks/list         EMPTY
             ↓ Busca BD              MISS (~150ms)
             ↓ Armazena              SET (5 min TTL)

200s         GET /tasks/list         VALID ✅
             ↓ Cache HIT             (~2ms)

300s         Cache expira!           AUTO DELETE
             GET /tasks/list         EMPTY
             ↓ Busca BD              MISS (~150ms)
             ↓ Armazena              SET (5 min TTL)
```

---

## 5. Estrutura de Dados no Redis

```
REDIS MEMORY
═════════════════════════════════════════════════════

Key: "tasks:all"
TTL: 295 segundos
Type: STRING (JSON)

Value:
┌─────────────────────────────────────────────────┐
│ [                                               │
│   {                                             │
│     "id": 1,                                    │
│     "title": "Supino Reto",                     │
│     "description": "4 séries de 8-10 reps",    │
│     "completed": false,                         │
│     "createdAt": "2024-01-01T10:00:00.000Z",   │
│     "updatedAt": "2024-01-01T10:00:00.000Z"    │
│   },                                            │
│   { ... mais tarefas ... },                     │
│   { ... mais tarefas ... }                      │
│ ]                                               │
└─────────────────────────────────────────────────┘

MEMÓRIA USADA: ~2-5KB (aproximadamente)
```

---

## 6. Logs de Execução

```
┌────────────────────────────────────────────────────┐
│ INICIALIZAÇÃO                                      │
├────────────────────────────────────────────────────┤
│ ✅ Conectado ao Redis com sucesso!                 │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│ PRIMEIRA REQUISIÇÃO GET /tasks/list                │
├────────────────────────────────────────────────────┤
│ ❌ Cache MISS para chave: tasks:all                │
│ 📌 Tarefas buscadas do BANCO DE DADOS e cacheadas │
│ 💾 Cache SET para chave: tasks:all (expira em 300s)│
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│ SEGUNDA REQUISIÇÃO GET /tasks/list                 │
├────────────────────────────────────────────────────┤
│ 💾 Cache HIT para chave: tasks:all                 │
│ 📌 Retornando tarefas do CACHE                     │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│ POST /tasks (CRIAR)                                │
├────────────────────────────────────────────────────┤
│ 🗑️  Cache invalidado após criar tarefa              │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│ TERCEIRA REQUISIÇÃO GET /tasks/list                │
├────────────────────────────────────────────────────┤
│ ❌ Cache MISS para chave: tasks:all                │
│ 📌 Tarefas buscadas do BANCO DE DADOS e cacheadas │
│ 💾 Cache SET para chave: tasks:all (expira em 300s)│
└────────────────────────────────────────────────────┘
```

---

## 7. Comparação: Com vs Sem Redis

```
                    SEM REDIS       COM REDIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1ª Requisição       ~150ms          ~150ms
2ª Requisição       ~150ms          ~2ms    ⚡
3ª Requisição       ~150ms          ~2ms    ⚡
4ª Requisição       ~150ms          ~2ms    ⚡
...                 ...             ...
100ª Requisição     ~150ms          ~2ms    ⚡

Após modificação    ~150ms          ~150ms  (cache inválido)
Próxima depois      ~150ms          ~2ms    ⚡

BENEFÍCIO:          75x mais rápido (em média)
ECONOMIA CPU BD:    99% redução

EXEMPLO REAL:
1000 requisições
SEM Redis:  150ms × 1000 = 150 segundos
COM Redis:  150ms + (2ms × 999) = ~2 segundos

⏱️  SPEEDUP: 75x mais rápido!
```

---

## 8. Arquitetura Completa

```
┌──────────────────────────────────────────────────────────┐
│                  CLIENT (Browser/curl)                   │
└────────────────────┬─────────────────────────────────────┘
                     │ HTTP
                     ▼
┌──────────────────────────────────────────────────────────┐
│               NESTJS APPLICATION                         │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  TasksController                                   │ │
│  │  GET /tasks/list  →  TasksService.findAll()       │ │
│  └────────────────────────────────────────────────────┘ │
│                     │                                    │
│                     ▼                                    │
│  ┌────────────────────────────────────────────────────┐ │
│  │  TasksService                                      │ │
│  │  1. Tentar Redis                                   │ │
│  │  2. Se não encontrar, buscar BD                    │ │
│  │  3. Armazenar em Redis                             │ │
│  └────────────────────────────────────────────────────┘ │
│           │                          │                  │
│           ▼ (1)                      ▼ (2)              │
│  ┌──────────────────┐      ┌──────────────────┐        │
│  │  RedisService    │      │  PrismaService   │        │
│  │                  │      │                  │        │
│  │  get/set/del     │      │  findMany()      │        │
│  │  (MEMÓRIA)       │      │  (DISCO)         │        │
│  └────────────┬─────┘      └──────────┬───────┘        │
│               │                        │                │
└───────────────┼────────────────────────┼────────────────┘
                │ TCP:6379               │ TCP:5432
                ▼                        ▼
        ┌──────────────┐        ┌──────────────┐
        │ REDIS        │        │ PostgreSQL   │
        │ :6379        │        │ :5432        │
        │ (Memória)    │        │ (Disco)      │
        │ Fast! ⚡    │        │ Persistente  │
        └──────────────┘        └──────────────┘
```

---

## 9. Decision Tree: Usar Cache ou Não?

```
┌─ Dados são acessados FREQUENTEMENTE?
│
├─ SIM ──────────────────> USE CACHE! 🔴
│                         Exemplo: /tasks/list
│                         5+ requisições/minuto
│
└─ NÃO ─────────────────> Talvez não seja necessário
                         Exemplo: /tasks/:id
                         Requisições esporádicas


┌─ Dados MUDAM FREQUENTEMENTE?
│
├─ SIM ──────────────────> Use TTL curto (30-60s)
│                         Exemplo: Placar ao vivo
│
└─ NÃO ─────────────────> Use TTL longo (5-10min)
                         Exemplo: Lista de tarefas
```

---

Esse é o poder do Redis! 🚀
