import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [TasksController],
  providers: [TasksService, TasksResolver],
  exports: [TasksService],
})
export class TasksModule {}
