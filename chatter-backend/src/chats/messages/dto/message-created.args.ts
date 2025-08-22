import { ArgsType, Field } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@ArgsType()
export class MessageCreatedArgs {
  @Field()
  @IsNotEmpty()
  chatId: string; // The ID of the chat for which the message was created
}