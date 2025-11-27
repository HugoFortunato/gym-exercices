import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { CreateTaskInput, Task } from './models/graphql/task.model';

@Resolver(() => Task)
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  @Query(() => [Task], { name: 'tasks', description: 'Busca todas as tarefas' })
  async getTasks(): Promise<Task[]> {
    return await this.tasksService.findAll();
  }

  @Query(() => Task, {
    name: 'task',
    description: 'Busca uma tarefa por ID',
    nullable: true,
  })
  async getTask(
    @Args('id', { type: () => Int, description: 'ID da tarefa' }) id: number,
  ): Promise<Task | null> {
    return await this.tasksService.findOne(id);
  }

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

  @Mutation(() => Task)
  async deleteTask(@Args('id', { type: () => Int }) id: number): Promise<Task> {
    return await this.tasksService.delete(id);
  }
}
