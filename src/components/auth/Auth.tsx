import { Button, Stack, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useGetMe } from "../../hooks/useGetMe";
import { useNavigate } from "react-router-dom";

interface AuthProps {
  // Define any props if needed
  submitLabel: string;
  onSubmit: (credentials: { email: string; password: string }) => Promise<void>;
  children: React.ReactNode;
  error?: string;
}

const Auth = ({ submitLabel, onSubmit, children, error }: AuthProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { data } = useGetMe(); // reexecuted after we log in, thanks to client.refetchQueries in useLogin.ts
  const navigate = useNavigate();
  // triggered by client.refetchQueries in useLogin.ts
  useEffect(() => {
    if (data) {
      // check if user is already logged in
      navigate("/"); // redirect to home if user is logged in
    }
  }, [data, navigate]);

  return (
    <Stack
      spacing={3}
      sx={{
        height: "100vh",
        maxWidth: {
          xs: "70%",
          md: "30%",
        },
        margin: "0 auto",
        justifyContent: "center",
      }}
    >
      <TextField
        type='email'
        label='Email'
        variant='outlined'
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={!!error} //coarse error, if undefined or null then it will be false
        helperText={error}
      />
      <TextField
        type='password'
        label='Password'
        variant='outlined'
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={!!error} //coarse error, if undefined or null then it will be false
        helperText={error}
      />
      <Button variant='contained' onClick={() => onSubmit({ email, password })}>
        {submitLabel}
      </Button>
      {children}
    </Stack>
  );
};

export default Auth;
