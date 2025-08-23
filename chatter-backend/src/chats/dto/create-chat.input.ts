import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateChatInput {
  // @Field()
  // @Transform(({ value }) => value === 'true') // Transforms string value to boolean
  // @IsBoolean()
  // isPrivate: boolean;

  // @Field(() => [String], { nullable: true }) // Complex data type: Tell NestJS GraphQL this is an array of strings
  // @IsArray()
  // @IsString({ each: true }) // Each item in the array is validated (must be a string)
  // @IsNotEmpty({ each: true }) // Each item in the array is validated (must be a string)
  // @IsOptional()
  // userIds?: string[]; // If the chat is public, we will not pass this Field

  // @Field({ nullable: true }) // Tell graphql this field is optional
  @Field()
  @IsNotEmpty() // Transforms string value to boolean
  @IsString()
  name: string;
}
