import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import type { TokenPayload } from 'src/auth/token-payload.interface';
import { PUB_SUB } from 'src/common/constants/injection-token';
import { MESSAGE_CREATED } from './constants/pubsub-triggers';
import { CreateMessageInput } from './dto/create-message.input';
import { GetMessagesArgs } from './dto/get-messages.args';
import { MessageCreatedArgs } from './dto/message-created.args';
import { Message } from './entities/message.entity';
import { MessagesService } from './messages.service';

@Resolver(() => Message) // Returns the Message entity type for GraphQL type and adds it to the schema
export class MessagesResolver {
  constructor(
    private readonly messagesService: MessagesService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Mutation(() => Message)
  @UseGuards(GqlAuthGuard) // Protects the mutation with a GraphQL authentication guard
  async createMessage(
    @Args('createMessageInput') createMessageInput: CreateMessageInput,
    @CurrentUser() user: TokenPayload, // Retrieves the current user from the request context
  ) {
    return this.messagesService.createMessage(createMessageInput, user._id);
  }

  @Query(() => [Message], { name: 'messages' }) // Returns an array of Message entities
  @UseGuards(GqlAuthGuard) // Protects the query with a GraphQL authentication guard
  async getMessages(
    @Args() getMessagesArgs: GetMessagesArgs, // Accepts arguments for fetching messages
    @CurrentUser() user: TokenPayload, // Retrieves the current user from the request context
  ) {
    return this.messagesService.getMessages(getMessagesArgs, user._id);
  }

  // Return type for the subscription
  @Subscription(() => Message, {
    // variables are the arguments passed to the subscription when first subscribed
    filter: (payload, variables, context) => {
      const userId = context.req.user._id; // context is the context object created in app.module.ts onConnect function
      // Filter the messages based on the chatId provided in the variables
      return (
        payload.messageCreated.chatId === variables.chatId &&
        userId !== payload.messageCreated.userId
      ); // Only return messages for the specific chatId
      // and do not send the message to the user who created it
    },
  })
  messageCreated(
    @Args() messageCreatedArgs: MessageCreatedArgs,
    @CurrentUser() user: TokenPayload,
  ) {
    // MessageCreatedArgs is part of the Schema and will be provided in these parameter. messageCreated is the name of the subscription
    return this.messagesService.messageCreated(messageCreatedArgs, user._id); // userId is not needed here as we filter in the filter function above
  }
}
