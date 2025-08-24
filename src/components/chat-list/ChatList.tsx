import { Box, Divider, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { PAGE_SIZE } from "../../constants/page-size";
import { useGetChats } from "../../hooks/useGetChats";
import { useMessageCreated } from "../../hooks/useMessageCreated";
import { usePath } from "../../hooks/usePath";
import ChatListAdd from "./chat-list-add/ChatListAdd";
import ChatListHeader from "./chat-list-header/ChatListHeader";
import ChatListItem from "./chat-list-item/ChatListItem";
import { useCountChats } from "../../hooks/useCountChats";

const ChatList = () => {
  const [chatListAddVisible, setChatListAddVisible] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState("");
  // fetchMore is exposed by useQuery
  const { data, fetchMore } = useGetChats({
    skip: 0,
    limit: PAGE_SIZE,
  });
  const path = usePath(); // listen for path changes
  const { chatsCount, countChats } = useCountChats();

  useEffect(() => {
    countChats();
  }, [countChats]); // countChats is only declared once, when the component mounts

  useMessageCreated({ chatIds: data?.chats.map((chat) => chat._id) || [] }); // triggers a websocket subscription to new messages in this chat and updates the Apollo cache when a new message is created

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
        <Box
          sx={{
            width: "100%",
            // maxWidth: 360,
            bgcolor: "background.paper",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <InfiniteScroll
            pageStart={0}
            loadMore={ () => {
                fetchMore({
                  variables: {
                    skip: data?.chats.length, // number of chats loaded
                  },
                });
              } // function that loads the next page of data
            }
            hasMore={
              data?.chats && chatsCount ? data.chats.length < chatsCount : false
            }
            useWindow={false}
          >
            {data?.chats &&
              [...data.chats]
                .sort((chatA, chatB) => {
                  if (!chatA.latestMessage) {
                    return -1;
                  }
                  return (
                    new Date(chatA.latestMessage?.createdAt).getTime() -
                    new Date(chatB.latestMessage?.createdAt).getTime()
                  );
                })
                .map((chat) => (
                  <ChatListItem
                    chat={chat}
                    selected={chat._id === selectedChatId}
                  />
                ))
                .reverse()}
          </InfiniteScroll>
        </Box>
      </Stack>
    </>
  );
};

export default ChatList;
