import React, { useState } from "react"; // 🎯 تم حذف useEffect
import { useTranslation } from "react-i18next";
import { useSnackbar } from "../../../../contexts/useSnackbar"; 
import api from "../../../../api/refreshToken";
import { useParams } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  FormControlLabel,
  Switch,
  Box,
  CircularProgress
} from "@mui/material";

export default function EditUser({ open, handleClose, user, onUserUpdated }) {
  const { t } = useTranslation();
  const {UserId} = useParams();
  const { showSnackbar } = useSnackbar();
  
  const [loading, setLoading] = useState(false);
 
  // 🎯 تهيئة الحالة بناءً على بيانات المستخدم الحالية
  // بسبب وجود key={`edit-${user.id}`} في الملف الأب، 
  // هذا السطر سيعاد تشغيله تلقائياً ببيانات المستخدم الجديد عند فتح النافذة لمستخدم مختلف.
  const [formData, setFormData] = useState({
    role: user?.role || "customer",
    is_active: Boolean(user?.is_active ?? true),
  });

  const handleUpdateUser = async () => {
    setLoading(true); 
    try {
      const response = await api.put(
        `/admin/users/${UserId}`, 
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
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

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{t("editUser") || "تعديل بيانات المستخدم"}</DialogTitle>

      <DialogContent dividers>
        {/* 🎯 اختيار الدور */}
        <TextField
          select
          fullWidth
          margin="normal"
          label={t("role") || "الدور"}
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <MenuItem value="admin">{t("admin") || "مدير"}</MenuItem>
          <MenuItem value="employee">{t("employee") || "موظف"}</MenuItem>
          <MenuItem value="customer">{t("customer") || "عميل"}</MenuItem>
        </TextField>

        {/* 🎯 حالة الحساب (مفتاح تبديل Switch) */}
        <Box sx={{ mt: 3, mb: 1 }}>
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
            label={formData.is_active ? (t("active") || "نشط") : (t("inactive") || "غير نشط")}
            sx={{ 
              fontWeight: "bold", 
              color: formData.is_active ? "success.main" : "text.secondary" 
            }}
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
};