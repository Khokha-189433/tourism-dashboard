import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";
import SnackbarContext from "./SnackbarContext";

export function SnackbarProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };

  const closeSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setNotification((current) => ({ ...current, open: false }));
  };

  useEffect(() => {
    const message = location.state?.message;
    if (!message) return;

    const timeoutId = setTimeout(() => {
      showSnackbar(message, location.state.severity || "success");
    }, 0);
    navigate(`${location.pathname}${location.search}`, {
      replace: true,
      state: null,
    });

    return () => clearTimeout(timeoutId);
  }, [location, navigate]);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}
