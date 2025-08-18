import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UsersRepository } from './users.repository';
import { error } from 'console';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async create(createUserInput: CreateUserInput) {
    try {
      return await this.usersRepository.create({
        ...createUserInput,
        password: await this.hashPassword(createUserInput.password),
      });
    } catch (err) {
      // console.log(err);
      if (err.message.includes('E11000')) {
        throw new UnprocessableEntityException('Email already exists.');  // respond with a custom error to the UI client.
      }
      throw err;
    }
  }

  async findAll() {
    return this.usersRepository.find({});
  }

  async findOne(_id: string) {
    return this.usersRepository.findOne({ _id });
  }

  async update(_id: string, updateUserInput: UpdateUserInput) {
    const updateData = { ...updateUserInput };
    if (updateUserInput.password) {
      updateData.password = await this.hashPassword(updateUserInput.password);
    }
    return this.usersRepository.findOneAndUpdate({ _id }, { $set: updateData });
  }

  async remove(_id: string) {
    return this.usersRepository.findOneAndDelete({ _id });
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });  // if it does not throw an error it means that the user exist
    const passwordIsValid =
      user && (await bcrypt.compare(password, user.password));  // compare the password against the hashed password stored in mongodb
    if (!user || !passwordIsValid) {
      throw new UnauthorizedException('Credentials are invalid');
    }
    return user;
  }
}
