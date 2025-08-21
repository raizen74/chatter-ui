import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateMessageInput {
  @Field() // GraphQL picks it up for the schema
  @IsNotEmpty() // Validates that the content is not empty
  content: string;

  @Field() // GraphQL picks it up for the schema
  @IsNotEmpty() // Validates that the content is not empty
  chatId: string;
}
