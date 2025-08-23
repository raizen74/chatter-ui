import { graphql } from "../gql";

// MessageFragment provides all the properties of the given Message, user included
export const ChatFragment = graphql(`
  fragment ChatFragment on Chat {
    _id
    name
    latestMessage {
      ...MessageFragment
    }
  }
`);
