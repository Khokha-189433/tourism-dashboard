import React, { useState } from "react";
import api from "../../../../api/refreshToken"
import { useTranslation } from "react-i18next";
import { useSnackbar } from "../../../../contexts/useSnackbar";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";

export default function EditUser({
  open,
  handleClose,
  user,
  userId,
  onUserUpdated,
}) {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [formData, setFormData] = useState(() => ({
    role: user?.role || "",
    is_active: Boolean(user?.is_active ?? true),
  }));

  const handleUpdateUser = async () => {
    try {
      const response = await api.put(
        `/admin/users/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const updatedUser = response.data?.data ?? response.data;

      // إرسال البيانات الجديدة للـ Parent
      if (typeof onUserUpdated === "function") {
        onUserUpdated(updatedUser);
      }

      handleClose();

      showSnackbar(t("userUpdated"), "success");
    } catch (err) {
      console.error(err);

      showSnackbar(
        err?.response?.data?.message || t("userUpdateError"),
        "error"
      );
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t("editUser")}</DialogTitle>

      <DialogContent>

  {/* اختيار الدور */}
  <TextField
    select
    fullWidth
    margin="normal"
    label={t("role")}
    value={formData.role}
    onChange={(e) =>
      setFormData({
        ...formData,
        role: e.target.value,
      })
    }
  >
    <MenuItem value="admin">{t("admin")}</MenuItem>
    <MenuItem value="employee">{t("employee")}</MenuItem>
    <MenuItem value="customer">{t("customer")}</MenuItem>
  </TextField>

  {/* حالة الحساب */}
  <TextField
    select
    fullWidth
    margin="normal"
    label={t("status")}
    value={formData.is_active ? "true" : "false"}
    onChange={(e) =>
      setFormData({
        ...formData,
        is_active: e.target.value === "true",
      })
    }
  >
    <MenuItem value="true">{t("active")}</MenuItem>
    <MenuItem value="false">{t("inactive")}</MenuItem>
  </TextField>

 </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          {t("cancel")}
        </Button>

        <Button
          variant="contained"
          onClick={handleUpdateUser}
        >
          {t("save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}