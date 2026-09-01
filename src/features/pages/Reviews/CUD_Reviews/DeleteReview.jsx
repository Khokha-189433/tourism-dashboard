import { useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../../../api/refreshToken";

import {
  IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, Typography, Tooltip,
  CircularProgress, Alert
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

/**
 * 🎯 مكون حذف التقييم
 * 
 * Props:
 * - review: التقييم الحالي
 * - onDeleted: دالة تُستدعى بعد نجاح الحذف
 */
export default function DeleteReview({ review, onDeleted }) {
  const { t } = useTranslation();

  // 🎯 States
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // ============================================================
  // فتح وإغلاق النافذة
  // ============================================================
  const handleOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  // ============================================================
  // تنفيذ الحذف
  // ============================================================
  const handleDelete = async () => {
    setLoading(true);

    try {
      // إرسال طلب الحذف
      await api.delete(`/reviews/${review.id}`);

      // 🎯 استدعاء الدالة القادمة من الصفحة الرئيسية لتحديث الجدول
      if (onDeleted) {
        onDeleted(review.id);
      }

      handleClose();
    } catch (error) {
      console.error("خطأ في الحذف:", error);
      alert(error.response?.data?.message || "حدث خطأ أثناء الحذف");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ===== زر الحذف ===== */}
      <Tooltip title={t("delete")}>
        <IconButton
          color="error"
          size="small"
          onClick={handleOpen}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>

      {/* ===== نافذة تأكيد الحذف ===== */}
      <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="xs" disableRestoreFocus>
        <DialogTitle>{t("deleteReview")}</DialogTitle>

        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            {t("deleteWarning")}
          </Alert>

          <Typography variant="body2" color="text.secondary">
            <strong>{t("comment")}:</strong> {review.comment}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            {t("cancel")}
          </Button>

          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : t("delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}