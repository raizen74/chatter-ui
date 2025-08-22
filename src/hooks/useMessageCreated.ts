import { useSubscription } from "@apollo/client";
import { graphql } from "../gql";
import { SubscriptionMessageCreatedArgs } from "../gql/graphql";
import { updateMessages } from "../cache/messages";

const messageCreatedDocument = graphql(`
  subscription messageCreated($chatId: String!) {
    messageCreated(chatId: $chatId) {
      ...MessageFragment
    }
  }
`);

export const useMessageCreated = (
  variables: SubscriptionMessageCreatedArgs
) => {
  console.log("useMessageCreated subscription hook");
  return useSubscription(messageCreatedDocument, {
    variables,
    onData: ({ client, data }) => {  // callback function called when a message is published to the subscription
      if (data.data) {
        updateMessages(client.cache, data.data.messageCreated);  // Holds the logic to update the Apollo cache with the new message
      }
    },
  });
};
