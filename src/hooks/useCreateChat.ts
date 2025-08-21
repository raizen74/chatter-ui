import { useMutation } from "@apollo/client";
import { graphql } from "../gql";
import { ChatFragment } from "../fragments/chat.fragment";

export const createChatDocument = graphql(`
  mutation CreateChat($createChatInput: CreateChatInput!) {
    createChat(createChatInput: $createChatInput) {
      ...ChatFragment
    }
  }
`);

// After we create a chat, we want to update the cache so that the new chat is included in the list of chats
// As soon as we execute a new mutation it gets appended to the client cache
const useCreateChat = () => {
  return useMutation(createChatDocument, {update(cache, {data}) {
    cache.modify({
      fields: {
        chats(existingChats = []) {
          const newChatRef = cache.writeFragment({
            data: data?.createChat,
            fragment: ChatFragment
          }) // write directly to the cache
          return [...existingChats, newChatRef ] // what gets returned here is what is write in the apollo client cache
        }
      } // set individual fields in the cache based on the name of the query
    })
  }}); // update fields in apollo client cache
};

export { useCreateChat };
