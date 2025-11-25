import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Put,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './models/rest/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  helloWorld() {
    return {
      message: 'Olá! Bem-vindo à API de Tarefas 👋',
      description: 'Use /tasks/list para listar todas as tarefas',
      endpoints: {
        list: 'GET /tasks/list',
        findOne: 'GET /tasks/:id',
        create: 'POST /tasks',
        update: 'PUT /tasks/:id',
        toggleComplete: 'PATCH /tasks/:id/toggle',
        delete: 'DELETE /tasks/:id',
      },
    };
  }

  @Get('list')
  async findAll() {
    const tasks = await this.tasksService.findAll();

    return {
      success: true,
      count: tasks.length,
      data: tasks,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const task = await this.tasksService.findOne(Number(id));

    if (!task) {
      return {
        success: false,
        message: 'Tarefa não encontrada',
      };
    }

    return {
      success: true,
      data: task,
    };
  }

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    const task = await this.tasksService.create(createTaskDto);
    return {
      success: true,
      message: 'Tarefa criada com sucesso!',
      data: task,
    };
  }

  // PUT /:id - Atualiza uma tarefa
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: CreateTaskDto) {
    const task = await this.tasksService.update(Number(id), updateTaskDto);
    return {
      success: true,
      message: 'Tarefa atualizada com sucesso!',
      data: task,
    };
  }

  // PATCH /:id/toggle - Alterna o status de conclusão
  @Patch(':id/toggle')
  async toggleComplete(@Param('id') id: string) {
    const task = await this.tasksService.toggleComplete(Number(id));
    return {
      success: true,
      message: 'Status da tarefa alterado com sucesso!',
      data: task,
    };
  }

  // DELETE /:id - Deleta uma tarefa
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.tasksService.delete(Number(id));
    return {
      success: true,
      message: 'Tarefa deletada com sucesso!',
    };
  }
}
