import { useCallback, useState } from "react";
import { API_URL } from "../constants/urls";
import { snackVar } from "../constants/snack";
import { UNKNOWN_ERROR_SNACK_MESSAGE } from "../constants/error";

export const useCountMessages = (chatId: string) => {
  const [messagesCount, setmessagesCount] = useState<number | undefined>(); // initially, messagesCount is undefined

  // useCallback defines a function callback that is memoized, a function redefinition does not trigger a rerender
  const countMessages = useCallback(async () => {
    const res = await fetch(`${API_URL}/messages/count?chatId=${chatId}`);
    if (!res.ok) {
      snackVar(UNKNOWN_ERROR_SNACK_MESSAGE);
      return;
    }
    // Check if the chat is empty
    if (
      !res.headers.get("content-length") ||
      res.headers.get("content-length") === "0"
    ) {
      setmessagesCount(0);
      return;
    }

    const { messages } = await res.json(); // Get the messages property of the returned object
    setmessagesCount(messages);
  }, [chatId]); // everytime the chatId changes, countMessages is redefined
  return { messagesCount, countMessages }; // return state and callback
};
