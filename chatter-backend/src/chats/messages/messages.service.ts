import { Injectable } from '@nestjs/common';
import { ChatsRepository } from '../chats.repository';
import { CreateMessageInput } from './dto/create-message.input';
import { Message } from './entities/message.entity';
import { Types } from 'mongoose';
@Injectable()
export class MessagesService {
  constructor(private readonly chatsRepository: ChatsRepository) {}
  async createMessage({ content, chatId }: CreateMessageInput, userId: string) {
    const message: Message = {
      content,
      userId,
      createAt: new Date(),
      _id: new Types.ObjectId(),
    };
    await this.chatsRepository.findOneAndUpdate({
      _id: chatId,
      $or: [
        { userId },  // The owner of the chat can push messages
        // Users in the chat can also push messages
        {
          userIds: {
            $in: [userId],
          },
        },
      ],
    }, {
      $push: { messages: message },
    }); // The first argument is the filter query, which tells mongodb which document to update
    return message; // Return the created message
  }
}
