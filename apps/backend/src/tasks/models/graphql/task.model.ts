import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';

@ObjectType()
export class Task {
  @Field(() => ID)
  id!: number;

  @Field()
  title!: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field()
  completed!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@InputType()
export class CreateTaskInput {
  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;
}
