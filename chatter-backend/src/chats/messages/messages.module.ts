import { forwardRef, Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesResolver } from './messages.resolver';
import { ChatsModule } from '../chats.module';
import { UsersModule } from 'src/users/users.module';
import { MessagesController } from './messages.controller';

@Module({
  imports: [forwardRef(() => ChatsModule), UsersModule], // Importing ChatsModule to access chat-related functionality, like access to the chats repository
  providers: [MessagesResolver, MessagesService], controllers: [MessagesController],
})
export class MessagesModule {}
