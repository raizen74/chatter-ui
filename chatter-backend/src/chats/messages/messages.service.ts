import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { Types } from 'mongoose';
import { PUB_SUB } from 'src/common/constants/injection-token';
import { UsersService } from 'src/users/users.service';
import { ChatsRepository } from '../chats.repository';
import { MESSAGE_CREATED } from './constants/pubsub-triggers';
import { CreateMessageInput } from './dto/create-message.input';
import { GetMessagesArgs } from './dto/get-messages.args';
import { MessageCreatedArgs } from './dto/message-created.args';
import { Message } from './entities/message.entity';
import { MessageDocument } from './entities/messages.document';

@Injectable()
export class MessagesService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    // private readonly chatsService: ChatsService,
    private readonly usersService: UsersService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}
  async createMessage({ content, chatId }: CreateMessageInput, userId: string) {
    // messageDocument fullfills MongoDB document schema
    const messageDocument: MessageDocument = {
      content,
      userId: new Types.ObjectId(userId),
      createdAt: new Date(),
      _id: new Types.ObjectId(),
    };
    // search the chatId and update its messages array
    await this.chatsRepository.findOneAndUpdate(
      {
        _id: chatId,  // filterQuery in AbstractRepository
        // ...this.chatsService.userChatFilter(userId), // Ensures the user is allowed to push messages
      },
      {
        $push: { messages: messageDocument },  // update parameter in AbstractRepository
      },
    ); // The first argument is the filter query, which tells mongodb which document to update
    // construct the Message object
    const message: Message = {
      ...messageDocument,
      chatId,
      user: await this.usersService.findOne(userId),
    };
    await this.pubSub.publish(MESSAGE_CREATED, { messageCreated: message }); // Publish the new message to the PubSub system so subscribers can receive it
    return message; // Return the created message
  }

  async getMessages({ chatId }: GetMessagesArgs) {
    return this.chatsRepository.model.aggregate([  // aggregation pipeline, transforms a chatDocument to a chat entity
      { $match: { _id: new Types.ObjectId(chatId) } },
      { $unwind: '$messages' },
      { $replaceRoot: { newRoot: '$messages' } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $unset: 'userId' },
      { $set: { chatId } },
    ]);
  }

  async messageCreated({ chatId }: MessageCreatedArgs) {
    await this.chatsRepository.findOne({
      _id: chatId,
      // ...this.chatsService.userChatFilter(userId),
    }); // Ensure the chat exists
    return this.pubSub.asyncIterableIterator(MESSAGE_CREATED); // Subscribes the calling client to this trigger, when new messages are created they will be sent to the subscribing clients
  }
}
