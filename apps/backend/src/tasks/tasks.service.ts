import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RedisService } from '../redis/redis.service';
import { CreateTaskDto } from './models/rest/create-task.dto';

@Injectable()
export class TasksService implements OnModuleInit, OnModuleDestroy {
  private prisma!: PrismaClient;

  constructor(private redisService: RedisService) {}

  async onModuleInit() {
    this.prisma = new PrismaClient();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  async findAll() {
    const cacheKey = 'tasks:all';

    try {
      const cachedTasks = await this.redisService.get(cacheKey);

      if (cachedTasks) {
        return JSON.parse(cachedTasks);
      }

      const tasks = await this.prisma.task.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      await this.redisService.set(cacheKey, JSON.stringify(tasks), 300);

      return tasks;
    } catch {
      return await this.prisma.task.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
    }
  }

  async findOne(id: number) {
    const cacheKey = `task:${id}`;

    try {
      const cachedTask = await this.redisService.get(cacheKey);

      if (cachedTask) {
        console.log('Tarefa encontrada no Redis');
        return JSON.parse(cachedTask);
      }

      console.log('Tarefa não encontrada no Redis');

      const task = await this.prisma.task.findUnique({
        where: { id },
      });

      await this.redisService.set(cacheKey, JSON.stringify(task), 300);

      return task;
    } catch {
      console.log('Erro ao buscar tarefa no Redis');
    }
  }

  async create(data: CreateTaskDto) {
    const newTask = await this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
      },
    });

    await this.redisService.del('tasks:all');

    return newTask;
  }

  async update(id: number, data: CreateTaskDto) {
    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
      },
    });

    await this.redisService.del('tasks:all');

    return updatedTask;
  }

  async toggleComplete(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new Error('Tarefa não encontrada');
    }

    return await this.prisma.task.update({
      where: { id },
      data: {
        completed: !task.completed,
      },
    });
  }

  async delete(id: number) {
    const deletedTask = await this.prisma.task.delete({
      where: { id },
    });

    await this.redisService.del('tasks:all');
    console.log('🗑️  Cache invalidado após deletar tarefa');

    return deletedTask;
  }
}
