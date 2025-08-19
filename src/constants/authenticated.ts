import { makeVar } from "@apollo/client";
// mantain global authentication state
export const authenticatedVar = makeVar(false)