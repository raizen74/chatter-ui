import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Divider,
  IconButton,
  InputBase,
  Paper,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCreateMessage } from "../../hooks/useCreateMessage";
import { useGetChat } from "../../hooks/useGetChat";
import { useGetMessages } from "../../hooks/useGetMessages";
const Chat = () => {
  // Extract the chat ID from the URL parameters
  const params = useParams<{ _id: string }>();
  const [message, setMessage] = useState("");
  const chatId = params._id!; // Get the chat ID from the URL parameters
  const { data } = useGetChat({ _id: chatId }); // the bang (!) asserts that _id is not undefined
  const [createMessage] = useCreateMessage(chatId);
  const { data: messages } = useGetMessages({ chatId });

  return (
    <Stack sx={{ height: "100%", justifyContent: "space-between" }}>
      <h1>{data?.chat.name}</h1>
      <Box>
        {messages?.messages.map((message) => (
          <p>{message.content}</p>
        ))}
      </Box>
      <Paper
        sx={{
          p: "2px 4px",
          display: "flex",
          justifySelf: "flex-end",
          alignItems: "center",
          width: "100%",
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1, width: "100%" }}
          onChange={(event) => setMessage(event.target.value)}
          value={message}
          placeholder='Message'
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation='vertical' />
        <IconButton
          onClick={() =>
            createMessage({
              variables: { createMessageInput: { content: message, chatId } },
            })
          }
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
