import { InputType, Int, Field } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CreateChatInput {
  @Field()
  @Transform(({ value }) => value === 'true') // Transforms string value to boolean
  @IsBoolean()
  isPrivate: boolean;

  @Field(() => [String], { nullable: true }) // Complex data type: Tell NestJS GraphQL this is an array of strings
  @IsArray()
  @IsString({ each: true }) // Each item in the array is validated (must be a string)
  @IsNotEmpty({ each: true }) // Each item in the array is validated (must be a string)
  @IsOptional()
  userIds?: string[]; // If the chat is public, we will not pass this Field

  @Field({ nullable: true }) // Tell graphql this field is optional
  @IsNotEmpty() // Transforms string value to boolean
  @IsString()
  @IsOptional() // If the value is missing all other validators are ignored, but if supplied they apply
  name?: string; // Only for private chats
}
