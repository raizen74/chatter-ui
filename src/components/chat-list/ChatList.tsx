import { Divider, Stack } from "@mui/material";
import List from "@mui/material/List";
import { useEffect, useState } from "react";
import { useGetChats } from "../../hooks/useGetChats";
import ChatListAdd from "./chat-list-add/ChatListAdd";
import ChatListHeader from "./chat-list-header/ChatListHeader";
import ChatListItem from "./chat-list-item/ChatListItem";
import { usePath } from "../../hooks/usePath";
import { useMessageCreated } from "../../hooks/useMessageCreated";

const ChatList = () => {
  const [chatListAddVisible, setChatListAddVisible] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState("");
  const { data } = useGetChats();
  const path = usePath(); // listen for path changes

  useMessageCreated({chatIds: data?.chats.map((chat) => chat._id) || []}) // triggers a websocket subscription to new messages in this chat and updates the Apollo cache when a new message is created

  useEffect(() => {
    const pathSplit = path.split("chats/");
    if (pathSplit.length === 2) {
      setSelectedChatId(pathSplit[1]);
    }
  }, [path]);

  return (
    <>
      <ChatListAdd
        open={chatListAddVisible}
        handleClose={() => setChatListAddVisible(false)}
      />
      <Stack>
        <ChatListHeader handleAddChat={() => setChatListAddVisible(true)} />
        <Divider />
        <List
          sx={{
            width: "100%",
            // maxWidth: 360,
            bgcolor: "background.paper",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          {data?.chats && [...data.chats].sort((chatA, chatB) => {
            if (!chatA.latestMessage) {
              return -1
            }
            return (
              new Date(chatA.latestMessage?.createdAt).getTime() -
              new Date(chatB.latestMessage?.createdAt).getTime()
            )
          })
            .map((chat) => (
              <ChatListItem
                chat={chat}
                selected={chat._id === selectedChatId}
              />
            ))
            .reverse()}
        </List>
      </Stack>
    </>
  );
};

export default ChatList;
