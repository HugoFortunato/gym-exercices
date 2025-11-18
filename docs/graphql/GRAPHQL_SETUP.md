# GraphQL - Instalação e Uso

## Instalação

### 1. Instalar dependências

```bash
npm install @nestjs/graphql @nestjs/apollo @apollo/server graphql
```

### 2. Configurar no `app.module.ts`

```typescript
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
    }),
    // ... outros módulos
  ],
})
```

### 3. Criar o modelo GraphQL (`src/tasks/models/task.model.ts`)

```typescript
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Task {
  @Field(() => ID)
  id!: number;

  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  completed!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
```

### 4. Criar o resolver (`src/tasks/tasks.resolver.ts`)

```typescript
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { Task } from './models/task.model';

@Resolver(() => Task)
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  @Query(() => [Task], { name: 'tasks' })
  async getTasks(): Promise<Task[]> {
    return await this.tasksService.findAll();
  }

  @Query(() => Task, { name: 'task', nullable: true })
  async getTask(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Task | null> {
    return await this.tasksService.findOne(id);
  }
}
```

### 5. Adicionar resolver ao módulo (`src/tasks/tasks.module.ts`)

```typescript
import { TasksResolver } from './tasks.resolver';

@Module({
  providers: [TasksService, TasksResolver],
  // ...
})
```

### 6. Adicionar `schema.gql` ao `.gitignore`

```
# GraphQL
src/schema.gql
```

## Uso

### 1. Iniciar o servidor

```bash
npm run start:dev
```

### 2. Acessar o Playground

```
http://localhost:3000/graphql
```

### 3. Executar queries

**Buscar todas as tarefas:**

```graphql
query {
  tasks {
    id
    title
    description
    completed
  }
}
```

**Buscar uma tarefa:**

```graphql
query {
  task(id: 1) {
    id
    title
    description
  }
}
```

**Com variáveis:**

```graphql
query GetTask($taskId: Int!) {
  task(id: $taskId) {
    id
    title
  }
}
```

Variáveis (aba Variables):

```json
{
  "taskId": 1
}
```

## Testar via cURL

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ tasks { id title } }"}'
```

## Próximos Passos

### Criar Mutations

**1. Input Type (`src/tasks/dto/create-task.input.ts`):**

```typescript
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateTaskInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;
}
```

**2. Mutation no resolver:**

```typescript
import { Mutation, Args } from '@nestjs/graphql';

@Mutation(() => Task)
async createTask(@Args('input') input: CreateTaskInput): Promise<Task> {
  return await this.tasksService.create(input);
}

@Mutation(() => Task)
async updateTask(
  @Args('id', { type: () => Int }) id: number,
  @Args('input') input: CreateTaskInput,
): Promise<Task> {
  return await this.tasksService.update(id, input);
}

@Mutation(() => Boolean)
async deleteTask(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
  await this.tasksService.delete(id);
  return true;
}
```

**3. Usar no Playground:**

```graphql
mutation {
  createTask(input: { title: "Nova Tarefa", description: "Descrição" }) {
    id
    title
  }
}
```

## Referências

- [NestJS GraphQL](https://docs.nestjs.com/graphql/quick-start)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
