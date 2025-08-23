// Define mongoose schema and GraphQL object type for Message

import { Field, ObjectType } from "@nestjs/graphql";
import { AbstractEntity } from "src/common/database/abstract.entity";
import { User } from "src/users/entities/user.entity";

// Message entity is the type schema returned by GraphQL resolver
@ObjectType()
export class Message extends AbstractEntity {
  @Field()
  content: string;

  @Field()
  createdAt: Date;

  @Field(() => User)
  user: User;

  @Field()
  chatId: string;
}