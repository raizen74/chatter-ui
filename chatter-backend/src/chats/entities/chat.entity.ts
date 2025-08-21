import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from 'src/common/database/abstract.entity'; // Implements _id
import { Message } from '../messages/entities/message.entity';

@ObjectType()
@Schema() // Moongose picks this up as a valid schema
export class Chat extends AbstractEntity {
  @Field()
  @Prop()
  userId: string;

  @Field()
  @Prop()
  isPrivate: boolean;

  @Field(() => [String])
  @Prop([String])  // tell mongoose this is an array of strings
  userIds: string[]; // List of user IDs in the chat

  @Field({ nullable: true })
  @Prop()
  name?: string; // Only for private chats

  @Prop([Message])
  messages: Message[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);