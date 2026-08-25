import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import api from "../../api/refreshToken";
import { useSnackbar } from "../../contexts/useSnackbar";

export default function DeleteButton({
  endpoint,
  itemId,
  onDeleted,
  confirmationMessage = "هل أنت متأكد من الحذف؟",
  successMessage = "تم الحذف بنجاح",
  errorMessage = "حدث خطأ أثناء الحذف",
  tooltip = "حذف",
}) {
  const [deleting, setDeleting] = useState(false);
  const { showSnackbar } = useSnackbar();

  const handleDelete = async () => {
    if (deleting || !window.confirm(confirmationMessage)) return;

    setDeleting(true);
    try {
      await api.delete(endpoint);
      onDeleted?.(itemId);
      showSnackbar(successMessage, "success");
    } catch (error) {
      console.error(error);
      showSnackbar(errorMessage, "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Tooltip title={tooltip}>
      <span>
        <IconButton color="error" onClick={handleDelete} disabled={deleting}>
          {deleting ? <CircularProgress size={22} /> : <DeleteIcon />}
        </IconButton>
      </span>
    </Tooltip>
  );
}
