# Gym Exercices API

Gym exercises management API built with **NestJS**, **Prisma**, **PostgreSQL**, **Redis**, and **GraphQL**.

🚀 Featuring:
- **Redis Cache** on task listing for better performance!
- **GraphQL API** with Apollo Server and interactive Playground!

## 🚀 Quick Start

### Prerequisites

- Node.js (version 18+)
- Docker and Docker Compose
- npm or yarn

### 1️⃣ Installation

```bash
npm install
```

### 2️⃣ Configure the database

Create a `.env` file in the project root:

```bash
DATABASE_URL="postgresql://gym_user:gym_password@localhost:5432/gym_db?schema=public"
```

### 3️⃣ Start PostgreSQL with Docker

```bash
docker-compose up -d
```

Wait a few seconds for the database to be ready.

### 4️⃣ Run Prisma migrations

```bash
npx prisma migrate dev --name init
```

This will create the tables in the database.

### 5️⃣ Start the server

```bash
npm run start:dev
```

The server will be available at `http://localhost:3000`

## 📚 Endpoints

### Health Check / Hello World
```
GET /tasks
```

Returns information about the API and available endpoints.

### List all tasks
```
GET /tasks/list
```

### Get a specific task
```
GET /tasks/:id
```

### Create a new task
```
POST /tasks
Content-Type: application/json

{
  "title": "Task 1",
  "description": "Task description"
}
```

### Update a task
```
PUT /tasks/:id
Content-Type: application/json

{
  "title": "Updated task",
  "description": "New description"
}
```

### Toggle completion status
```
PATCH /tasks/:id/toggle
```

### Delete a task
```
DELETE /tasks/:id
```

## 🗄️ Project Structure

```
src/
├── main.ts              # Application entry point
├── app.module.ts        # Main module
├── tasks/               # Tasks module
│   ├── tasks.controller.ts
│   ├── tasks.service.ts
│   ├── tasks.module.ts
│   └── dto/
│       └── create-task.dto.ts
├── prisma/
│   └── schema.prisma    # Database schema
└── ...
```

## 🛠️ Useful Commands

### Development
```bash
npm run start:dev       # Start with hot reload
npm run start:debug     # Start in debug mode
```

### Build
```bash
npm run build           # Build for production
npm run start:prod      # Run compiled version
```

### Database
```bash
npx prisma studio      # Open Prisma Studio (data viewer)
npx prisma migrate dev # Create new migration
npx prisma db seed     # Run seed (if configured)
```

### Linting
```bash
npm run lint            # Run ESLint
npm run format          # Format code
```

## 🐳 Docker

### Stop the database
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f postgres
```

### Remove database data
```bash
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
