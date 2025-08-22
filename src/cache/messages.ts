import { ApolloCache } from "@apollo/client";
import { Message } from "../gql/graphql";
import { getMessagesDocument } from "../hooks/useGetMessages";

export const updateMessages = (cache: ApolloCache<any>, message: Message) => {
      const messagesQueryOptions = {
        query: getMessagesDocument, // Apollo client will use this query to read the current messages from the cache
        variables: { chatId: message.chatId },
      };
      const messages = cache.readQuery({ ...messagesQueryOptions });  // Read the current messages from the cache
      // Write the new message to the current messages query in the cache
      cache.writeQuery({
        ...messagesQueryOptions,
        data: { messages: (messages?.messages || []).concat(message) },
      });
      // // By default, cache modify is going to update the fields for all existing queries in the cache
      // cache.modify({
      //   fields: {
      //     // messages is the name of the field in the query in useGetMessages.ts
      //     messages(existingMessages = []) {
      //       const newMessageRef = cache.writeFragment({
      //         data: data?.createMessage,
      //         fragment: MessageFragment,
      //       }); // write directly to the cache
      //       return [...existingMessages, newMessageRef]; // what gets returned here is what is writen to the apollo client cache
      //     },
      //   }, // set individual fields in the cache based on the name of the query
      // });
}