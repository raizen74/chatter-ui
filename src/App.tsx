import { Container, createTheme, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { ApolloProvider } from "@apollo/client";
import { RouterProvider } from "react-router-dom";
import router from "./components/Route";
import client from "./constants/apollo-client";
import Guard from "./components/auth/Guard";
import Header from "./components/header/Header";
import CustomizedSnackbar from "./components/snackbar/Snackbar";
import ChatList from "./components/chat-list/ChatList";
import { usePath } from "./hooks/usePath";
import Grid from "@mui/material/Grid"

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {
  const path = usePath();

  const showChatList = path === "/" || path.includes("chats");

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Header />
        <Guard>
          <Container maxWidth='xl' sx={{ marginTop: "1rem" }}>
            {showChatList ? (
              <Grid container spacing={5}>
                <Grid size={{ xs: 12, md: 5, lg: 4, xl: 3 }}>
                  <ChatList />
                </Grid>
                <Grid size={{ xs: 12, md: 7, lg: 8, xl: 9 }}>
                  <Routes />
                </Grid>
              </Grid>
            ) : (
              <Routes />
            )}
          </Container>
        </Guard>
        <CustomizedSnackbar />
      </ThemeProvider>
    </ApolloProvider>
  );
};

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default App;
