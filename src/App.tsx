import { Container, createTheme, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { ApolloProvider } from "@apollo/client";
import { RouterProvider } from "react-router-dom";
import router from "./components/Route";
import client from "./constants/apollo-client";
import Guard from "./components/auth/Guard";
import Header from "./components/header/Header";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Header />
        <Container>
          <Guard>
            <RouterProvider router={router} />
          </Guard>
        </Container>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
