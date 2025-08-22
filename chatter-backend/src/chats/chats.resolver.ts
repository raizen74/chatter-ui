import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ChatsService } from './chats.service';
import { Chat } from './entities/chat.entity';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import type { TokenPayload } from 'src/auth/token-payload.interface';

@Resolver(() => Chat)
export class ChatsResolver {
  constructor(private readonly chatsService: ChatsService) {}

  @UseGuards(GqlAuthGuard) // Only authenticated users can create chats
  @Mutation(() => Chat)  // This is returned by the GraphQL mutation
  createChat(
    @Args('createChatInput') createChatInput: CreateChatInput, // Created in the UI
    @CurrentUser() user: TokenPayload,
  ) {
    return this.chatsService.create(createChatInput, user._id);
  }

  @UseGuards(GqlAuthGuard) // Only authenticated users can create chats
  @Query(() => [Chat], { name: 'chats' })
  findAll(@CurrentUser() user: TokenPayload ) {
    return this.chatsService.findAll(user._id);
  }

  @Query(() => Chat, { name: 'chat' })
  findOne(@Args('_id') _id: string) {
    return this.chatsService.findOne(_id);
  }

  @Mutation(() => Chat)
  updateChat(@Args('updateChatInput') updateChatInput: UpdateChatInput) {
    return this.chatsService.update(updateChatInput.id, updateChatInput);
  }

  @Mutation(() => Chat)
  removeChat(@Args('id', { type: () => Int }) id: number) {
    return this.chatsService.remove(id);
  }
}
