import { ApolloCache } from "@apollo/client";
import { Message } from "../gql/graphql";
import { getChatsDocument } from "../hooks/useGetChats";

export const updateLatestMessage = (
  cache: ApolloCache<any>,
  message: Message
) => {
  // Apollo does not support mutating the existing chats array so we create a new one
  const chats = [
    ...(cache.readQuery({ query: getChatsDocument })?.chats || []),
  ];
  const cachedChatIndex = chats.findIndex(
    (chat) => chat._id === message.chatId
  ); // find the chat index where the message belongs
  if (cachedChatIndex === -1) {
    // findIndex returns -1 if no index found
    return;
  }
  const cachedChat = chats[cachedChatIndex];
  const cachedChatCopy = { ...cachedChat };
  cachedChatCopy.latestMessage = message;
  // replace the existing chat in our copied array with the new chat with the latestMessage equal to the message parameter
  chats[cachedChatIndex] = cachedChatCopy;
  cache.writeQuery({
    query: getChatsDocument,
    data: {
      chats
    }
  })
};
