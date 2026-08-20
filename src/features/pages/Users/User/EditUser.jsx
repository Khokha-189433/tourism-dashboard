import React, { useState } from "react";
import api from "../../../../api/refreshToken"

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

      alert("User Updated Successfully");
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          "Error Updating User"
      );
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit User</DialogTitle>

      <DialogContent>

  {/* اختيار الدور */}
  <TextField
    select
    fullWidth
    margin="normal"
    label="Role"
    value={formData.role}
    onChange={(e) =>
      setFormData({
        ...formData,
        role: e.target.value,
      })
    }
  >
    <MenuItem value="admin">Admin</MenuItem>
    <MenuItem value="employee">Employee</MenuItem>
    <MenuItem value="customer">Customer</MenuItem>
  </TextField>

  {/* حالة الحساب */}
  <TextField
    select
    fullWidth
    margin="normal"
    label="Status"
    value={formData.is_active ? "true" : "false"}
    onChange={(e) =>
      setFormData({
        ...formData,
        is_active: e.target.value === "true",
      })
    }
  >
    <MenuItem value="true">Active</MenuItem>
    <MenuItem value="false">Inactive</MenuItem>
  </TextField>

 </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleUpdateUser}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}