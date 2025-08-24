import { useQuery } from "@apollo/client";
import { graphql } from "../gql";
import { QueryChatsArgs } from "../gql/graphql";

// GraphQL fragments are reusable parts of a query that can be included in multiple queries or mutations.
export const getChatsDocument = graphql(`
  query Chats($skip: Int!, $limit: Int!) {
    chats(skip: $skip, limit: $limit) {
      ...ChatFragment
    }
  }
`);

const useGetChats = (variables: QueryChatsArgs) => {
  return useQuery(getChatsDocument, {variables});
}

export { useGetChats };
