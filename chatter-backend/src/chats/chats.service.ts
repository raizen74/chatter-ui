import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { ChatsRepository } from './chats.repository';
import { PipelineStage, Types } from 'mongoose';

@Injectable()
export class ChatsService {
  constructor(private readonly chatsRepository: ChatsRepository) {}

  async create(createChatInput: CreateChatInput, userId: string) {
    // Creates the chat document providing userId, name and messages
    return this.chatsRepository.create({
      ...createChatInput,  // name
      userId,
      messages: [], // Initialize messages as an empty array
    });
  }

  async findMany(prePipelineStages: PipelineStage[] = []) {
    const chats = await this.chatsRepository.model.aggregate([
      ...prePipelineStages,
      { $set: { latestMessage: { $arrayElemAt: ['$messages', -1] } } },
      { $unset: 'messages' },
      {
        $lookup: {  // retrieve the user from users database that has sent the latestMessage
          from: 'users',
          localField: 'latestMessage.userId',
          foreignField: '_id',
          as: 'latestMessage.user',
        },
      },
    ]);
    chats.forEach((chat) => {
      if (!chat.latestMessage?._id) {
        delete chat.latestMessage;
        return;
      }
      chat.latestMessage.user = chat.latestMessage.user[0];
      delete chat.latestMessage.userId;
      chat.latestMessage.chatId = chat._id;
    });
    return chats  // fullfill the [Chat] GraphQL entity type, returned by chats.resolver
  }

  async findOne(_id: string) {
    const chats = await this.findMany([
      { $match: { chatId: new Types.ObjectId(_id) } },  // prePipelineStages variable of findMany, only return the latestMessage of the given chat
    ]);
    if (!chats[0]) {
      throw new NotFoundException(`No chat was found with ID ${_id}`);
    }
    return chats[0];  // Chat entity
  }

  // userChatFilter(userId: string) {
  //   return {
  //     $or: [
  //       { userId }, // The owner of the chat can push messages
  //       // Users in the chat can also push messages
  //       {
  //         userIds: {
  //           $in: [userId],
  //         },
  //       },
  //       { isPrivate: false }, // If the chat is public anyone can push messages
  //     ],
  //   };
  // }

  update(id: number, updateChatInput: UpdateChatInput) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
