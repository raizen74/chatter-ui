import { forwardRef, Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsResolver } from './chats.resolver';
import { DatabaseModule } from 'src/common/database/database.module';
import { Chat, ChatSchema } from './entities/chat.entity';
import { ChatsRepository } from './chats.repository';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    // forwardRef is used to handle circular dependencies, MessagesModule also imports ChatsModule
    forwardRef(() => MessagesModule),  // Its part of the application's chat functionality, so we import it here
  ],
  providers: [ChatsResolver, ChatsService, ChatsRepository],
  exports: [ChatsRepository], // Exporting the repository for use in the messages module when we import this module
})
export class ChatsModule {}
