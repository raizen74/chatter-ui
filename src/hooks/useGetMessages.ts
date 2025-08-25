import { useQuery } from "@apollo/client";
import { graphql } from "../gql";
import { GetMessagesQueryVariables } from "../gql/graphql";

export const getMessagesDocument = graphql(`
  query GetMessages($chatId: String!, $skip: Int!, $limit: Int!) {
    messages(chatId: $chatId, skip: $skip, limit: $limit) {
      ...MessageFragment
    }
  }
`);

export const useGetMessages = (variables: GetMessagesQueryVariables) => {
  return useQuery(getMessagesDocument, {variables});  
}
