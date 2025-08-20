import { useQuery } from "@apollo/client";
import { graphql } from "../gql";

// GraphQL fragments are reusable parts of a query that can be included in multiple queries or mutations.
export const getChatsDocument = graphql(`
  query Chats {
    chats {
      ...ChatFragment
    }
  }
`);

const useGetChats = () => {
  return useQuery(getChatsDocument);
}

export { useGetChats };
