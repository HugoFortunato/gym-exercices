import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS se necessário
  app.enableCors();

  await app.listen(3001, () => {
    console.log('🚀 Backend running on http://localhost:3001');
    console.log('📚 GraphQL Playground: http://localhost:3001/graphql');
  });
}

bootstrap();
