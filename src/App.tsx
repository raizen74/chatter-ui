import { Container, createTheme, CssBaseline, Grid } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { ApolloProvider } from "@apollo/client";
import { RouterProvider } from "react-router-dom";
import router from "./components/Route";
import client from "./constants/apollo-client";
import Guard from "./components/auth/Guard";
import Header from "./components/header/Header";
import CustomizedSnackbar from "./components/snackbar/Snackbar";
import ChatList from "./components/chat-list/ChatList";

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
        <Grid container>
          <Grid size={3}>
            <ChatList />
          </Grid>
          <Grid container size={9}>
            <Container>
              <Guard>
                <RouterProvider router={router} />
              </Guard>
            </Container>
          </Grid>
        </Grid>
        <CustomizedSnackbar />
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
