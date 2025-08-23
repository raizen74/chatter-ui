import { ObjectType, Field, Int } from '@nestjs/graphql';
import { AbstractEntity } from 'src/common/database/abstract.entity'; // Implements _id
import { Message } from '../messages/entities/message.entity';

// Chat entity is the type schema returned by GraphQL resolver
@ObjectType()
export class Chat extends AbstractEntity {
  // @Field()
  // @Prop()
  // userId: string;

  // @Field()
  // @Prop()
  // isPrivate: boolean;

  // @Field(() => [String])
  // @Prop([String])  // tell mongoose this is an array of strings
  // userIds: string[]; // List of user IDs in the chat

  @Field()
  name: string; // Only for private chats

  @Field(() => Message, { nullable: true })  // latestMessage can be null if no messages yet
  latestMessage?: Message;
}
