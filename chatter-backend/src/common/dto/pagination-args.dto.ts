import { ArgsType, Field, Int } from '@nestjs/graphql';
import { number } from 'joi';

@ArgsType() // GraphQL argument
export class PaginationArgs {
  @Field(() => Int)
  skip: number;

  @Field(() => Int)
  limit: number;
}
