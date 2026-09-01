import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTranslation } from "react-i18next";
import api from "../../../api/refreshToken";

export default function CancelBooking({
  bookingId,
  onCancelled,
  disabled = false,
}) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);  // يحدد هل نافذة الإلغاء مفتوحة أم مغلقة.
  const [reason, setReason] = useState("");  // يخزن سبب الإلغاء الذي يكتبه المستخدم
  const [loading, setLoading] = useState(false);

  // فتح النافذة
  const handleOpen = (e) => {
    e.currentTarget.blur();
    setReason("");
    setOpen(true);
  };

  // إغلاق النافذة
  const handleClose = () => {
    if (loading) return;

    setOpen(false);
    setReason("");
  };

  // إلغاء الحجز
  const handleCancel = async () => {
    try {
      setLoading(true);

      const data = {
        status: "cancelled",
      };

      // إضافة السبب إذا كتبه المستخدم 
      if (reason.trim()) {  // trim()  تحذف المسافة الغير ضرورية في بداية ونهاية الكلمة 
        data.cancellation_reason = reason.trim();  //إذا كان سبب الإلغاء يحتوي على نص حقيقي، أضفه إلى البيانات بعد إزالة المسافات من البداية والنهاية
      }

      const response = await api.patch(
        `/bookings/${bookingId}/status`,
        data
      );

      // إغلاق النافذة
      setOpen(false);
      setReason("");

      // تحديث الحجز في الصفحة
      if (onCancelled) {
        onCancelled(response.data?.data);
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* زر إلغاء الحجز */}
      <IconButton
        color="error"
        onClick={handleOpen}
        disabled={disabled}
        title={t("cancelBooking")}
      >
        <CancelIcon />
      </IconButton>

      {/* نافذة التأكيد */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {t("cancelBooking")}
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            multiline
            minRows={3}
            margin="dense"
            label={t("cancellationReason")}
            placeholder={t("enterCancellationReason")}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          {/* إغلاق */}
          <Button
            onClick={handleClose}
            disabled={loading}
          >
            {t("cancel")}
          </Button>

          {/* تأكيد الإلغاء */}
          <Button
            color="error"
            variant="contained"
            onClick={handleCancel}
            disabled={loading}
          >
            {loading ? t("updating") : t("confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}