import { Divider, ListItemButton } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { Chat } from "../../../gql/graphql";
import router from "../../Route";

interface ChatListProps {
  // name?: string | null; // null to match the GraphQL type which is nullable
  chat: Chat;
  selected: boolean;
}

const ChatListItem = ({ chat, selected }: ChatListProps) => {
  return (
    <>
      <ListItem alignItems='flex-start' disablePadding>
        {/* Since the component is outside of the Router, we use router.navigate */}
        <ListItemButton
          onClick={() => router.navigate(`/chats/${chat._id}`)}
          selected={selected}
        >
          <ListItemAvatar>
            <Avatar alt='Remy Sharp' src='/static/images/avatar/1.jpg' />
          </ListItemAvatar>
          <ListItemText
            primary={chat.name}
            secondary={
              <>
                <Typography
                  component='span'
                  variant='body2'
                  sx={{ color: "text.primary", display: "inline" }}
                >
                  {chat.latestMessage?.user.username || ""}
                </Typography>
                {" " + (chat.latestMessage?.content || "")}
              </>
            }
          />
        </ListItemButton>
      </ListItem>
      <Divider variant='inset' />
    </>
  );
};

export default ChatListItem;
