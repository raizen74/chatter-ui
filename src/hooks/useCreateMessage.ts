import { useMutation } from "@apollo/client";
import { graphql } from "../gql";

const CreateMessageDocument = graphql(`
  mutation CreateMessage($createMessageInput: CreateMessageInput!) {
    createMessage(createMessageInput: $createMessageInput) {
      ...MessageFragment
    }
  }
`);

export const useCreateMessage = () => {
  return useMutation(CreateMessageDocument);
};
