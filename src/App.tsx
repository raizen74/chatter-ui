import { Container, createTheme, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
// import Auth from "./components/auth/Auth";
import { RouterProvider } from "react-router-dom";
import router from "./components/Route";
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container>
        <RouterProvider router={router} />
      </Container>
    </ThemeProvider>
  );
};

export default App;
