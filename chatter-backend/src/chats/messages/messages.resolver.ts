import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import type { TokenPayload } from 'src/auth/token-payload.interface';
import { CreateMessageInput } from './dto/create-message.input';
import { GetMessagesArgs } from './dto/get-messages.args';
import { Message } from './entities/message.entity';
import { MessagesService } from './messages.service';

@Resolver(() => Message) // Returns the Message entity type for GraphQL type and adds it to the schema
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) {}

  @Mutation(() => Message)
  @UseGuards(GqlAuthGuard) // Protects the mutation with a GraphQL authentication guard
  async createMessage(
    @Args('createMessageInput') createMessageInput: CreateMessageInput,
    @CurrentUser() user: TokenPayload, // Retrieves the current user from the request context
  ) {
    return this.messagesService.createMessage(createMessageInput, user._id);
  }
  @Query(() => [Message], {name: "messages"})  // Returns an array of Message entities
  @UseGuards(GqlAuthGuard) // Protects the query with a GraphQL authentication guard
  async getMessages(
    @Args() getMessagesArgs: GetMessagesArgs, // Accepts arguments for fetching messages
    @CurrentUser() user: TokenPayload, // Retrieves the current user from the request context
  ) {
    return this.messagesService.getMessages(getMessagesArgs, user._id);
  }
}
