import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TasksModule } from './tasks/tasks.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: false,
      graphiql: true,
      introspection: true,
    }),
    RedisModule,
    TasksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
