import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractEntityRepository } from 'src/common/database/abstract.repository';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatsRepository extends AbstractEntityRepository<Chat> {
  protected readonly logger = new Logger(ChatsRepository.name);

  constructor(@InjectModel(Chat.name) chatModel: Model<Chat>) {
    super(chatModel);
  }

  // This repository can be used to encapsulate user-related database operations
  // For example, methods to find, create, update, or delete users can be added here
}
