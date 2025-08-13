import { Injectable, Logger } from '@nestjs/common';
import { AbstractEntityRepository } from 'src/common/database/abstract.repository';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository extends AbstractEntityRepository<User> {
  protected readonly logger = new Logger(UsersRepository.name);

  constructor(@InjectModel(User.name) userModel: Model<User>) {
    super(userModel);
  }

  // This repository can be used to encapsulate user-related database operations
  // For example, methods to find, create, update, or delete users can be added here
}
