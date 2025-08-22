import { Injectable } from '@nestjs/common';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { ChatsRepository } from './chats.repository';

@Injectable()
export class ChatsService {
  constructor(private readonly chatsRepository: ChatsRepository) {}

  async create(createChatInput: CreateChatInput, userId: string) {
    return this.chatsRepository.create({
      ...createChatInput,
      userId,
      userIds: createChatInput.userIds || [], // userIds is optional, default to empty array if not provided
      messages: [], // Initialize messages as an empty array
    });
  }

  async findAll(userId: string) {
    return this.chatsRepository.find({ ...this.userChatFilter(userId) }); // Pass an empty object to find all chats
  }

  async findOne(_id: string) {
    return this.chatsRepository.findOne({ _id }); // Find a chat by its ID
  }

  userChatFilter(userId: string) {
    return {
      $or: [
        { userId }, // The owner of the chat can push messages
        // Users in the chat can also push messages
        {
          userIds: {
            $in: [userId],
          },
        },
        { isPrivate: false }, // If the chat is public anyone can push messages
      ],
    };
  }

  update(id: number, updateChatInput: UpdateChatInput) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
