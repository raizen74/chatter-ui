import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Divider, ListItemButton } from "@mui/material";
import router from "../../Route";
import { Chat } from "../../../gql/graphql";

interface ChatListProps {
  // name?: string | null; // null to match the GraphQL type which is nullable
  chat: Chat;
}

const ChatListItem = ({ chat }: ChatListProps) => {
  return (
    <>
      <ListItem alignItems='flex-start' disablePadding>
        {/* Since the component is outside of the Router, we use router.navigate */}
        <ListItemButton onClick={() => router.navigate(`/chats/${chat._id}`)}>
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
                  Ali Connors
                </Typography>
                {" — I'll be in your neighborhood doing errands this…"}
              </>
            }
          />
        </ListItemButton>
      </ListItem>
      <Divider variant='inset' component='li' />
    </>
  );
};

export default ChatListItem;
