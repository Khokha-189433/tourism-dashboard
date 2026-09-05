import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "../../../../contexts/useSnackbar"; 
import api from "../../../../api/refreshToken";

import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  MenuItem, TextField, FormControlLabel, Switch,
  Box, CircularProgress, Avatar, Typography, Divider,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import BadgeIcon from "@mui/icons-material/Badge";

export default function EditUser({ open, handleClose, user, onUserUpdated }) {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: "customer",
    is_active: true,
  });

  if (user && open) {
      setFormData({
        role: user.role || "customer",
        is_active: Boolean(user.is_active ?? true),
      });
    }

  // تحديث المستخدم
  const handleUpdateUser = async () => {
    if (!user) return;
    setLoading(true); 

    try {
      const response = await api.put(
        "/admin/users/" + user.id, 
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      const updatedUser = response.data?.data ?? response.data;

      if (typeof onUserUpdated === "function") {
        onUserUpdated(updatedUser);
      }

      handleClose();
      showSnackbar(t("userUpdated") || "تم تحديث المستخدم بنجاح", "success");
    } catch (err) {
      console.error("Update Error:", err);
      showSnackbar(
        err?.response?.data?.message || (t("userUpdateError") || "فشل تحديث المستخدم"),
        "error"
      );
    } finally {
      setLoading(false); 
    }
  };

  if (!user) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      fullWidth 
      maxWidth="sm"
    >
      <DialogTitle 
        id="edit-user-dialog-title"
        sx={{ display: "flex", alignItems: "center", gap: 2 }}
      >
        <Avatar sx={{ bgcolor: "#1976d2", width: 44, height: 44 }}>
          <EditIcon />
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {t("editUser") || "تعديل بيانات المستخدم"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user.first_name} {user.last_name} — #{user.id}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* معلومات المستخدم (للعرض فقط) */}
        <Box sx={{ 
          p: 2, mb: 2, bgcolor: "#f9fafb", borderRadius: 2,
          border: "1px solid #e5e7eb" 
        }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
            {t("userInfo") || "معلومات المستخدم (للعرض فقط)"}
          </Typography>
          <Typography variant="body2">
            📧 <b>{user.email}</b>
          </Typography>
          {user.phone && (
            <Typography variant="body2" dir="ltr">
              📱 {user.phone}
            </Typography>
          )}
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* الصلاحيات */}
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, color: "primary.main" }}>
          <BadgeIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: "middle" }} />
          {t("permissions") || "الصلاحيات والحالة"}
        </Typography>

        {/* اختيار الدور */}
        <TextField
          select
          fullWidth
          size="small"
          label={t("role") || "الدور"}
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          sx={{ mb: 2 }}
        >
          <MenuItem value="admin">{t("admin") || "مدير"}</MenuItem>
          <MenuItem value="employee">{t("employee") || "موظف"}</MenuItem>
          <MenuItem value="customer">{t("customer") || "عميل"}</MenuItem>
        </TextField>

        {/* حالة الحساب */}
        <Box sx={{ 
          p: 2, 
          border: "1px solid",
          borderColor: formData.is_active ? "success.main" : "error.main",
          borderRadius: 2,
          bgcolor: formData.is_active ? "#f0fdf4" : "#fef2f2",
        }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.is_active}
                onChange={(e) => 
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                color="success"
              />
            }
            label={
              <Box>
                <Typography fontWeight="bold">
                  {t("accountStatus") || "حالة الحساب"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formData.is_active 
                    ? (t("canLogin") || "يمكنه تسجيل الدخول") 
                    : (t("cannotLogin") || "لا يمكنه تسجيل الدخول")}
                </Typography>
              </Box>
            }
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          {t("cancel") || "إلغاء"}
        </Button>

        <Button
          variant="contained"
          onClick={handleUpdateUser}
          disabled={loading} 
          sx={{ minWidth: 100 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : (t("save") || "حفظ")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}