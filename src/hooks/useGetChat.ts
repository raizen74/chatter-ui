import { graphql } from "../gql";
import { useQuery } from "@apollo/client";
import { ChatQueryVariables } from "../gql/graphql";

const getChatDocument = graphql(`
  query Chat($_id: String!) {
    chat(_id: $_id) {
      name
    }
  }
`);

export const useGetChat = ( variables: ChatQueryVariables ) => {
  return useQuery(getChatDocument, {variables})
}
