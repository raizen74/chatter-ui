import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from 'src/common/database/abstract.entity'; // Implements _id
import { MessageDocument } from '../messages/entities/messages.document';

// ChatDocument is the schema stored in MongoDB
@Schema() // Moongose picks this up as a valid schema
export class ChatDocument extends AbstractEntity {
  @Prop()
  userId: string;

  @Prop()
  name: string;

  @Prop([MessageDocument])
  messages: MessageDocument[];
}

export const ChatSchema = SchemaFactory.createForClass(ChatDocument);