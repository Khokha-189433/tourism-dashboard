import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useTranslation } from "react-i18next";
import api from "../../../api/refreshToken";

export default function ConfirmBooking({
  bookingId,
  onConfirmed,
  disabled = false,
}) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (!loading) {
      setOpen(false);
    }
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);

      const res = await api.patch(
        `/bookings/${bookingId}/status`,
        {
          status: "confirmed",
        }
      );

      setOpen(false);

      if (onConfirmed) {
        onConfirmed(res.data?.data);
      }
    } catch (error) {
      console.error("Error confirming booking:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Confirm Icon */}
      <IconButton
        color="success"
        onClick={handleOpen}
        title={t("confirmBooking")}
        disabled={disabled}
      >
        <CheckCircleIcon />
      </IconButton>

      {/* Confirm Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {t("confirmBooking")}
        </DialogTitle>

        <DialogContent>
          <Typography sx={{ mt: 1 }}>
            {t("confirmBookingMessage")}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            disabled={loading}
          >
            {t("cancel")}
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? t("updating") : t("confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}