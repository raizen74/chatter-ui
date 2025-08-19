import * as React from "react";
// import Button from '@mui/material/Button';
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useReactiveVar } from "@apollo/client";
import { snackVar } from "../../constants/snack";

export default function CustomizedSnackbar() {
  // const [open, setOpen] = React.useState(false);
  const snack = useReactiveVar(snackVar);

  // const handleClick = () => {
  //   setOpen(true);
  // };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    snackVar(undefined);
  };

  return (
    <>
      {snack && (
        <div>
          {/* <Button onClick={handleClick}>Open Snackbar</Button> */}
          {/* Only open the Snackbar if the snack exist */}
          <Snackbar open={!!snack} autoHideDuration={6000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity={snack?.type}
              variant='filled'
              sx={{ width: "100%" }}
            >
              {snack.message}
            </Alert>
          </Snackbar>
        </div>
      )}
    </>
  );
}
