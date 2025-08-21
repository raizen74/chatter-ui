import { forwardRef, Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesResolver } from './messages.resolver';
import { ChatsModule } from '../chats.module';

@Module({
  imports: [forwardRef(() => ChatsModule)], // Importing ChatsModule to access chat-related functionality, like access to the chats repository
  providers: [MessagesResolver, MessagesService],
})
export class MessagesModule {}
