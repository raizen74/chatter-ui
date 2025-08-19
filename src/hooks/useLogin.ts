import { useState } from "react";
import { API_URL } from "../constants/urls";
import client from "../constants/apollo-client";
import { UNKNOWN_ERROR_MESSAGE } from "../constants/error";

interface LoginRequest {
  email: string;
  password: string;
}

const useLogin = () => {
  const [error, setError] = useState<string>();

  const login = async (request: LoginRequest) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      // request object configuration
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
    // Check if the response is ok (status in the range 200-299)
    if (!res.ok) {
      if (res.status === 401) {
        setError("Credentials are not valid.");
      } else {
        setError(UNKNOWN_ERROR_MESSAGE);
      }
      return;
    }
    setError("");
    // after the user is logged in, we need to refetch the queries from Apollo Client cache
    // triggers useEffect hook in Auth.tsx
    await client.refetchQueries({
      include: "active",
    });
  };
  return { login, error };
};
export { useLogin };
