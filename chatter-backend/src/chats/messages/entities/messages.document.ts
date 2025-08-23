// Define mongoose schema and GraphQL object type for Message

import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { AbstractEntity } from "src/common/database/abstract.entity";

// @ObjectType()
// MessageDocument is the schema stored in MongoDB
@Schema()
export class MessageDocument extends AbstractEntity {
  @Prop()
  content: string;

  @Prop()
  createdAt: Date;

  @Prop()
  userId: Types.ObjectId;
}