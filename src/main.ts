import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS se necessário
  app.enableCors();

  await app.listen(3000, () => {
    console.log('🚀 Servidor rodando em http://localhost:3000');
    console.log('📚 Documentação disponível em http://localhost:3000/api');
  });
}

bootstrap();
