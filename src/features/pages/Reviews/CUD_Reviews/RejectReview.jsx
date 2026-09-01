import { useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../../../api/refreshToken";

import {
  IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, TextField, Typography, Tooltip,
  CircularProgress, Alert
} from "@mui/material";

import CancelIcon from "@mui/icons-material/Cancel";

/**
 * 🎯 مكون رفض التقييم
 * 
 * Props:
 * - review: التقييم الحالي
 * - disabled: تعطيل الزر إذا كان التقييم مرفوضاً بالفعل
 * - onRejected: دالة تُستدعى بعد نجاح الرفض
 */
export default function RejectReview({ review, disabled = false, onRejected }) {
  const { t } = useTranslation();

  // 🎯 States
  const [openDialog, setOpenDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(false);

  // ============================================================
  // فتح وإغلاق النافذة
  // ============================================================
  const handleOpen = () => {
    setRejectReason(""); // تفريغ حقل السبب في كل مرة
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  // ============================================================
  // تنفيذ الرفض
  // ============================================================
  const handleReject = async () => {
    setLoading(true);

    try {
      // البيانات التي سنرسلها للـ API
      const data = {
        status: "rejected",
      };

      // إذا كتب المدير سبب الرفض، نضيفه كـ رد إداري
      if (rejectReason.trim()) {
        data.admin_reply = rejectReason;
      }

      // إرسال الطلب
      await api.patch(`/reviews/${review.id}/status`, data);

      // 🎯 استدعاء الدالة القادمة من الصفحة الرئيسية لتحديث الجدول
      if (onRejected) {
        onRejected(review.id, data);
      }

      handleClose();
    } catch (error) {
      console.error("خطأ في الرفض:", error);
      alert(error.response?.data?.message || "حدث خطأ أثناء الرفض");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ===== زر الرفض ===== */}
      <Tooltip title={t("reject")}>
        <span>
          <IconButton
            color="warning"
            size="small"
            onClick={handleOpen}
            disabled={disabled}
          >
            <CancelIcon />
          </IconButton>
        </span>
      </Tooltip>

      {/* ===== نافذة الرفض ===== */}
      <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="sm"   disableRestoreFocus>
        <DialogTitle>{t("rejectReview")}</DialogTitle>

        <DialogContent>
          {/* عرض التقييم الحالي */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>{t("comment")}:</strong> {review.comment}
          </Typography>

          {/* تنبيه */}
          <Alert severity="warning" sx={{ mb: 2 }}>
            {t("rejectWarning")}
          </Alert>

          {/* حقل سبب الرفض */}
          <TextField
            autoFocus
            margin="dense"
            label={t("rejectionReason")}
            fullWidth
            multiline
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="التقييم يحتوي على كلمات غير لائقة..."
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            {t("cancel")}
          </Button>

          <Button
            onClick={handleReject}
            variant="contained"
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : t("confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}