import { Link as MUILink } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { UNKNOWN_ERROR_MESSAGE } from "../../constants/error";
import { useCreateUser } from "../../hooks/useCreateUser";
import { useLogin } from "../../hooks/useLogin";
import { extractErrorMessage } from "../../utils/error";
import Auth from "./Auth";

const Signup = () => {
  const [createUser] = useCreateUser();
  const [error, setError] = useState("");
  const { login } = useLogin();

  return (
    <Auth
      submitLabel='Signup'
      error={error}
      onSubmit={async ({ email, password }) => {
        console.log(email, password);
        try {
          await createUser({
            variables: {
              createUserInput: {
                email,
                password,
              },
            },
          });
          await login({ email, password }); // Automatically log in after user creation in /signup
          setError(""); // After successful user creation, clear the error
        } catch (err) {
          const errorMessage = extractErrorMessage(err);
          if (errorMessage) {
            setError(errorMessage);
            return;
          }
          setError(UNKNOWN_ERROR_MESSAGE);
        }
      }}
    >
      <Link to={"/login"} style={{ alignSelf: "center" }}>
        <MUILink>Login</MUILink>
      </Link>
    </Auth>
  );
};
export default Signup;
