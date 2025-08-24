import { useSubscription } from "@apollo/client";
import { graphql } from "../gql";
import { SubscriptionMessageCreatedArgs } from "../gql/graphql";
import { updateMessages } from "../cache/messages";
import { updateLatestMessage } from "../cache/latest-message";

const messageCreatedDocument = graphql(`
  subscription messageCreated($chatIds: [String!]!) {
    messageCreated(chatIds: $chatIds) {
      ...MessageFragment
    }
  }
`);

export const useMessageCreated = (
  variables: SubscriptionMessageCreatedArgs
) => {
  return useSubscription(messageCreatedDocument, {
    variables,
    onData: ({ client, data }) => {  // callback function called when a message is published to the subscription
      if (data.data) {
        updateMessages(client.cache, data.data.messageCreated);  // Holds the logic to update the Apollo cache with the new message
        updateLatestMessage(client.cache, data.data.messageCreated);  // Add the message on our subscription to the cache
      }
    },
  });
};
