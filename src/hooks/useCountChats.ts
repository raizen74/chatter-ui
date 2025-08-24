import { useCallback, useState } from "react";
import { API_URL } from "../constants/urls";
import { snackVar } from "../constants/snack";
import { UNKNOWN_ERROR_SNACK_MESSAGE } from "../constants/error";

export const useCountChats = () => {
  const [chatsCount, setChatsCount] = useState<number | undefined>();  // initially, chatsCount is undefined

  // useCallback defines a function callback that is memoized, a function redefinition does not trigger a rerender
    const countChats = useCallback(async () => {
        const res = await fetch(`${API_URL}/chats/count`);
      if (!res.ok) {
        snackVar(UNKNOWN_ERROR_SNACK_MESSAGE);
        return;
      }
        setChatsCount(parseInt(await res.text())); // res.text returns a string
      }, []); // no dependencies -> countChats is created only once
    return {chatsCount, countChats}; // return state and callback
};
