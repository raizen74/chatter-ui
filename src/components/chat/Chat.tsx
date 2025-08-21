import { useParams } from "react-router-dom";
import { useGetChat } from "../../hooks/useGetChat";
import { Divider, IconButton, InputBase, Paper, Stack } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
const Chat = () => {
  // Extract the chat ID from the URL parameters
  const params = useParams<{ _id: string }>();
  const { data } = useGetChat({ _id: params._id! }); // the bang (!) asserts that _id is not undefined

  return (
    <Stack sx={{ height: "100%", justifyContent: "space-between" }}>
      <h1>{data?.chat.name}</h1>
      <Paper
        sx={{
          p: "2px 4px",
          display: "flex",
          justifySelf: "flex-end",
          alignItems: "center",
          width: "100%",
        }}
      >
        <InputBase sx={{ ml: 1, flex: 1, width: "100%" }} placeholder="Message"/>
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton color="primary" sx={{p: "10px"}}>
          <SendIcon />
        </IconButton>
      </Paper>
    </Stack>
  );
};

export default Chat;
