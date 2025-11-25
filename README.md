# Gym Exercices - Monorepo

Full-stack gym exercises management application.

## Stack

### Backend

- **NestJS** - Node.js framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Redis** - Cache
- **GraphQL** - API with Apollo Server

### Frontend

- **Next.js 16** - React framework
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components (ready to use)
- **TypeScript** - Type safety

## 🚀 Quick Start

### Prerequisites

- Node.js (version 18+)
- Docker and Docker Compose
- npm

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Setup Backend

```bash
# Create .env file in apps/backend
cd apps/backend
echo 'DATABASE_URL="postgresql://gym_user:gym_password@localhost:5432/gym_db?schema=public"' > .env

# Start PostgreSQL and Redis
docker-compose up -d

# Run migrations
npx prisma migrate dev --name init
npx prisma generate

# Seed database
npm run prisma:seed
```

### 3️⃣ Start Development

```bash
# From root directory

# Start backend only
npm run dev:backend

# Start frontend only
npm run dev:frontend

# Start both (recommended)
npm run dev
```

- Backend: `http://localhost:3001`
- Frontend: `http://localhost:3000`
- GraphQL Playground: `http://localhost:3001/graphql`

## 📚 API Endpoints

Base URL: `http://localhost:3001`

### REST API

- `GET /tasks` - Health check
- `GET /tasks/list` - List all tasks
- `GET /tasks/:id` - Get task by ID
- `POST /tasks` - Create task
- `PUT /tasks/:id` - Update task
- `PATCH /tasks/:id/toggle` - Toggle completion
- `DELETE /tasks/:id` - Delete task

### GraphQL

- Endpoint: `http://localhost:3001/graphql`
- Playground: `http://localhost:3001/graphql`

Example query:

```graphql
query {
  tasks {
    id
    title
    completed
  }
}
```

## 🗄️ Project Structure

```
gym-exercices/
├── apps/
│   ├── backend/         # NestJS API
│   │   ├── src/
│   │   ├── prisma/
│   │   └── package.json
│   └── frontend/        # Next.js App
│       ├── app/
│       ├── components/
│       ├── lib/
│       └── package.json
├── docs/                # Documentation
├── package.json         # Monorepo root
└── README.md
```

## 🛠️ Useful Commands

### Development

```bash
npm run dev              # Start both backend and frontend
npm run dev:backend      # Start backend only
npm run dev:frontend     # Start frontend only
```

### Build

```bash
npm run build            # Build both apps
npm run build:backend    # Build backend only
npm run build:frontend   # Build frontend only
```

### Database (from apps/backend)

```bash
cd apps/backend
npx prisma studio        # Open Prisma Studio
npx prisma migrate dev   # Create migration
npm run prisma:seed      # Seed database
```

### Shadcn (from apps/frontend)

```bash
cd apps/frontend
npx shadcn@latest add button  # Add component
npx shadcn@latest add card     # Add card component
```

## 🐳 Docker

All Docker commands should be run from `apps/backend`:

```bash
cd apps/backend

# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Remove data
docker-compose down -v
```

## 🔴 Redis Cache

The project already has **Redis implemented on task listing**!

- First request: fetches from database (50-200ms)
- Following requests: returns from cache (1-5ms)
- Cache expires automatically after 5 minutes
- Cache is invalidated when creating/updating/deleting tasks

## 🎨 GraphQL API

GraphQL implemented with Apollo Server:

- **Playground:** `http://localhost:3000/graphql`
- **2 Queries:** `tasks` and `task(id: Int!)`
- **Redis Cache** working

See [docs/graphql/GRAPHQL_SETUP.md](./docs/graphql/GRAPHQL_SETUP.md) for details

## 📝 Next Steps

1. Expand cache to other endpoints
2. Implement authentication and authorization
3. Add validations with `class-validator`
4. Create unit and integration tests
5. Add Swagger documentation
6. Implement global error handling
7. Add structured logging

## 📚 Documentation

**All documentation is organized in the [docs/](./docs/) folder**

- 🚀 **Setup:** [docs/setup/](./docs/setup/) - Installation and configuration
- 🎨 **GraphQL:** [docs/graphql/](./docs/graphql/) - GraphQL API
- 🔴 **Redis:** [docs/redis/](./docs/redis/) - Cache and performance

See [complete documentation index](./docs/README.md)

## 📖 References

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
