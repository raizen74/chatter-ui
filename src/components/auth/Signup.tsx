import { Link as MUILink, TextField } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { UNKNOWN_ERROR_MESSAGE } from "../../constants/error";
import { useCreateUser } from "../../hooks/useCreateUser";
import { useLogin } from "../../hooks/useLogin";
import { extractErrorMessage } from "../../utils/error";
import Auth from "./Auth";

const Signup = () => {
  const [createUser] = useCreateUser();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { login } = useLogin();

  return (
    <Auth
      submitLabel='Signup'
      error={error}
      extraFields={[
        <TextField
          type='email'
          label='Username'
          variant='outlined'
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          error={!!error} //coarse error, if undefined or null then it will be false
          helperText={error}
        />,
      ]}
      onSubmit={async ({ email, password }) => {
        console.log(email, password);
        try {
          await createUser({
            variables: {
              createUserInput: {
                email,
                username,
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
