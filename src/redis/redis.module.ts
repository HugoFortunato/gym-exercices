import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';

// Módulo do Redis que exporta o RedisService
// para ser usado em qualquer outro módulo da aplicação
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
