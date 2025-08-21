import { Injectable } from '@nestjs/common';
import { ChatsRepository } from '../chats.repository';
import { CreateMessageInput } from './dto/create-message.input';
import { Message } from './entities/message.entity';
import { Types } from 'mongoose';
import { GetMessagesArgs } from './dto/get-messages.args';
@Injectable()
export class MessagesService {
  constructor(private readonly chatsRepository: ChatsRepository) {}
  async createMessage({ content, chatId }: CreateMessageInput, userId: string) {
    const message: Message = {
      content,
      userId,
      createdAt: new Date(),
      _id: new Types.ObjectId(),
    };
    await this.chatsRepository.findOneAndUpdate(
      {
        _id: chatId,
        ...this.userChatFilter(userId), // Ensures the user is allowed to push messages
      },
      {
        $push: { messages: message },
      },
    ); // The first argument is the filter query, which tells mongodb which document to update
    return message; // Return the created message
  }

  private userChatFilter(userId: string) {
    return {
      $or: [
        { userId }, // The owner of the chat can push messages
        // Users in the chat can also push messages
        {
          userIds: {
            $in: [userId],
          },
        },
      ],
    };
  }

  async getMessages({ chatId }: GetMessagesArgs, userId: string) {
    return (await this.chatsRepository.findOne({
      _id: chatId,
      ...this.userChatFilter(userId),
    })).messages; // Returns the messages of the chat if the user is allowed to access it
  }
}
