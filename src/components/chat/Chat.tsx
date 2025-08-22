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
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useCreateMessage } from "../../hooks/useCreateMessage";
import { useGetChat } from "../../hooks/useGetChat";
import { useGetMessages } from "../../hooks/useGetMessages";
import Grid from "@mui/material/Grid";
import { useMessageCreated } from "../../hooks/useMessageCreated";
import { Message } from "../../gql/graphql";

const Chat = () => {
  console.log("Chat.tsx rendered");
  // Extract the chat ID from the URL parameters
  const params = useParams<{ _id: string }>();
  const [message, setMessage] = useState("");
  const chatId = params._id!; // Get the chat ID from the URL parameters
  const { data } = useGetChat({ _id: chatId }); // the bang (!) asserts that _id is not undefined
  // updating the Apollo cache causes all components using that cached data (like the <Box> with messages) to re-render with the latest data
  const [createMessage] = useCreateMessage(); // updates the apollo cache after creating a message
  const { data: existingMessages } = useGetMessages({ chatId }); // subscribed to the messages data in Apollo cache, When the cache is updated, Apollo automatically notifies all components using that data
  const [messages, setMessages] = useState<Message[]>([]); // local state to hold messages
  const divRef = useRef<HTMLDivElement>(null); // atatch a component ref to the div
  // works very similarly to usePath, but is more idiomatic in React Router v6 since we are inside of the Router context
  // Chat.tsx is rendered by the Router, so we can use useLocation to get the current location
  const location = useLocation();
  
  useMessageCreated({ chatId }); // subscribe to new messages
  
  const scrollToBottom = () =>
    divRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    // when a new message is created, initialize the messages state if it's empty, otherwise append the new message to the existing messages
    if (existingMessages) {
      setMessages(existingMessages.messages);
    }
  }, [existingMessages]);

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
    setMessage(""); // Reset the message input when the chat changes
    scrollToBottom();
  }, [location, messages]); // Scroll to the bottom when the location changes (i.e., when the chat changes)

  const handleCreateMessage = async () => {
    // execute a mutation to create a new message
    await createMessage({
      variables: { createMessageInput: { content: message, chatId } },
    });
    setMessage("");
    scrollToBottom();
  };

  return (
    <Stack sx={{ height: "100%", justifyContent: "space-between" }}>
      <h1>{data?.chat.name}</h1>
      <Box sx={{ maxHeight: "70vh", overflowY: "auto" }}>
        {[...messages]
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
                  <Typography variant='caption' sx={{ marginLeft: "0.25rem" }}>
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          ))}
        <div ref={divRef}></div>
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
