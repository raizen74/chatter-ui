import { useMutation } from "@apollo/client";
import { graphql } from "../gql";

export const createChatDocument = graphql(`
  mutation CreateChat($createChatInput: CreateChatInput!) {
    createChat(createChatInput: $createChatInput) {
      ...ChatFragment
    }
  }
`);

const useCreateChat = () => {
  return useMutation(createChatDocument);
};

export { useCreateChat };
