import SendIcon from "@mui/icons-material/Send";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useCreateMessage } from "../../hooks/useCreateMessage";
import { useGetChat } from "../../hooks/useGetChat";
import { useGetMessages } from "../../hooks/useGetMessages";
import { PAGE_SIZE } from "../../constants/page-size";
import { useCountMessages } from "../../hooks/useCountMessages";
import InfiniteScroll from "react-infinite-scroller";
// import { useMessageCreated } from "../../hooks/useMessageCreated";
// import { Message } from "../../gql/graphql";

const Chat = () => {
  // Extract the chat ID from the URL parameters
  const params = useParams<{ _id: string }>();
  const chatId = params._id!; // the bang (!) asserts that _id is not undefined
  const [message, setMessage] = useState("");
  // const [messages, setMessages] = useState<Message[]>([]); // local state to hold messages
  const { data } = useGetChat({ _id: chatId });
  // updating the Apollo cache causes all components using that cached data (like the <Box> with messages) to re-render with the latest data
  const [createMessage] = useCreateMessage(); // Creates a GraphQL CreateMessage mutation and updates the apollo cache after creating a message
  // useMessageCreated({ chatId }); // triggers a websocket subscription to new messages in this chat and updates the Apollo cache when a new message is created
  const { data: messages, fetchMore } = useGetMessages({
    chatId,
    skip: 0,
    limit: PAGE_SIZE,
  }); // subscribes to the chatId messages data in Apollo cache. When the cache is updated, Apollo automatically notifies all components using that data
  const divRef = useRef<HTMLDivElement>(null); // atatch a component ref to the div
  // works very similarly to usePath, but is more idiomatic in React Router v6 since we are inside of the Router context
  // Chat.tsx is rendered by the Router, so we can use useLocation to get the current location
  const location = useLocation();
  const { messagesCount, countMessages } = useCountMessages(chatId); // countMessages will be redefined everytime chatId changes

  useEffect(() => {
    countMessages();
  }, [countMessages]); // Reexecutes everytime countMessages is redefined

  const scrollToBottom = () =>
    divRef.current?.scrollIntoView({ behavior: "smooth" });

  // useEffect(() => {
  //   // when a new message is created, initialize the messages state if it's empty, otherwise append the new message to the existing messages
  //   if (messages) {
  //     setMessages(messages.messages);
  //   }
  // }, [messages]);

  // useEffect(() => {
  //   const existingLatestMessage = messages[messages.length - 1]?._id;
  //   if (
  //     latestMessage?.messageCreated && // Check if latestMessage has data on it
  //     existingLatestMessage !== latestMessage.messageCreated._id // Prevent adding duplicate messages
  //   ) {
  //     setMessages([...messages, latestMessage.messageCreated]);
  //   }
  // }, [latestMessage, messages]);

  useEffect(() => {
    if (messages && messages.messages.length <= PAGE_SIZE) { // first page of data

      setMessage(""); // Reset the message input when the chat changes
      scrollToBottom();
    }
  }, [location, messages]); // Scroll to the bottom when the location changes (i.e., when the chat changes)

  const handleCreateMessage = async () => {
    // execute a mutation to create a new message
    if (message) {
      await createMessage({
        variables: { createMessageInput: { content: message, chatId } },
      });
      setMessage("");
      scrollToBottom();
    }
  };
  return (
    <Stack sx={{ height: "100%", justifyContent: "space-between" }}>
      <h1>{data?.chat.name}</h1>
      <Box sx={{ maxHeight: "70vh", overflowY: "auto" }}>
        <InfiniteScroll
          pageStart={0}
          isReverse={true}
          loadMore={
            () => {
              fetchMore({
                variables: {
                  skip: messages?.messages.length, // number of messages loaded
                },
              });
            } // function that loads the next page of data
          }
          hasMore={
            messages && messagesCount
              ? messages.messages.length < messagesCount
              : false
          }
          useWindow={false}
        >
          {messages &&
            [...messages.messages]
              .sort(
                (messageA, messageB) =>
                  new Date(messageA.createdAt).getTime() -
                  new Date(messageB.createdAt).getTime()
              )
              .map((message) => (
                <Grid container alignItems={"center"} marginBottom='1rem'>
                  <Grid size={{ xs: 2, lg: 1 }}>
                    <Avatar src='' sx={{ width: 52, height: 52 }} />
                  </Grid>
                  <Grid size={{ xs: 10, lg: 11 }}>
                    <Stack>
                      <Paper sx={{ width: "fit-content" }}>
                        <Typography sx={{ padding: "0.9rem" }}>
                          {message.content}
                        </Typography>
                      </Paper>
                      <Typography
                        variant='caption'
                        sx={{ marginLeft: "0.25rem" }}
                      >
                        {new Date(message.createdAt).toLocaleTimeString()} -{" "}
                        {new Date(message.createdAt).toLocaleDateString()}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              ))}
          <div ref={divRef}></div>
        </InfiniteScroll>
      </Box>
      <Paper
        sx={{
          p: "2px 4px",
          display: "flex",
          justifySelf: "flex-end",
          alignItems: "center",
          width: "100%",
          margin: "1rem 0",
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1, width: "100%" }}
          onChange={(event) => setMessage(event.target.value)}
          value={message}
          placeholder='Message'
          onKeyDown={async (event) => {
            if (event.key === "Enter") {
              await handleCreateMessage();
            }
          }}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation='vertical' />
        <IconButton
          onClick={handleCreateMessage}
          color='primary'
          sx={{ p: "10px" }}
        >
          <SendIcon />
        </IconButton>
      </Paper>
    </Stack>
  );
};

export default Chat;
