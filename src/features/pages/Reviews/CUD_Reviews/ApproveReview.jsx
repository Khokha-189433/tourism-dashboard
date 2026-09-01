import { useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../../../api/refreshToken";

import {
  IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, TextField, Typography, Tooltip,
  CircularProgress
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";

/**
 *  مكون الموافقة على التقييم
 * 
 * Props:
 * - review: التقييم الحالي
 * - disabled: تعطيل الزر إذا كان التقييم مقبولاً بالفعل
 * - onApproved: دالة تُستدعى بعد نجاح الموافقة
 */
export default function ApproveReview({ review, disabled = false, onApproved }) {
  const { t } = useTranslation();

  //  States
  const [openDialog, setOpenDialog] = useState(false);
  const [adminReply, setAdminReply] = useState("");
  const [loading, setLoading] = useState(false);

  // ============================================================
  // فتح وإغلاق النافذة
  // ============================================================
  const handleOpen = () => {
    setAdminReply(""); // تفريغ حقل الرد في كل مرة
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  // ============================================================
  // تنفيذ الموافقة
  // ============================================================
  const handleApprove = async () => {
    setLoading(true);

    try {
      // البيانات التي سنرسلها للـ API
      const data = {
        status: "approved",
      };

      // إذا كتب المدير رداً، نضيفه
      if (adminReply.trim()) {
        data.admin_reply = adminReply;
      }

      // إرسال الطلب
      await api.patch(`/reviews/${review.id}/status`, data);

      //  استدعاء الدالة القادمة من الصفحة الرئيسية لتحديث الجدول
      if (onApproved) {
        onApproved(review.id, data);
      }

      handleClose();
    } catch (error) {
      console.error("خطأ في الموافقة:", error);
      alert(error.response?.data?.message || "حدث خطأ أثناء الموافقة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ===== زر الموافقة ===== */}
      <Tooltip title={t("approve")}>
        <span>
          <IconButton
            color="success"
            size="small"
            onClick={handleOpen}
            disabled={disabled}
          >
            <CheckCircleIcon />
          </IconButton>
        </span>
      </Tooltip>

      {/* ===== نافذة الموافقة ===== */}
      <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="sm" disableRestoreFocus >
        <DialogTitle>{t("approveReview")}</DialogTitle>

        <DialogContent>
          {/* عرض التقييم الحالي */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>{t("comment")}:</strong> {review.comment}
          </Typography>

          {/* حقل رد الإدارة */}
          <TextField
            autoFocus
            margin="dense"
            label={t("adminReplyOptional")}
            fullWidth
            multiline
            rows={3}
            value={adminReply}
            onChange={(e) => setAdminReply(e.target.value)}
            placeholder="شكراً لتقييمك الإيجابي!"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            {t("cancel")}
          </Button>

          <Button
            onClick={handleApprove}
            variant="contained"
            color="success"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : t("confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}