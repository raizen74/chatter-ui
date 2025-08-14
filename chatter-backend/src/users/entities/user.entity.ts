import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from 'src/common/database/abstract.entity';

@Schema({ versionKey: false })
@ObjectType()
export class User extends AbstractEntity {
  @Prop()
  @Field()  // This field is exposed in GraphQL
  email: string;

  @Prop() // This field is not exposed in GraphQL, but is used for MongoDB storage
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
