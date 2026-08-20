import React, { useRef, useState } from "react";
import { Button } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import api from "../../api/refreshToken";

// مكون عام لرفع صورة واحدة أو عدة صور يمكن استخدامه في أي صفحة داخل المشروع.
export default function ImageUploader({
  uploadUrl,
  fieldName = "images",
  buttonText = "إضافة صورة",
  multiple = true,
  onUploaded,
  onUnauthorized,
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  // اختيار الصور وتجهيز FormData ثم إرسالها إلى الرابط المحدد.
  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append(fieldName, file);
    });

    try {
      setUploading(true);
      const response = await api.post(uploadUrl, formData);
      onUploaded?.(response.data);
    } catch (error) {
      console.error("خطأ في رفع الصورة:", error.response?.data || error);

      if (error.response?.status === 401) {
        onUnauthorized?.();
        return;
      }

      alert("حدث خطأ أثناء رفع الصورة، يرجى المحاولة مرة أخرى.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Button
      variant="contained"
      component="label"
      startIcon={<UploadIcon />}
      disabled={uploading}
    >
      {uploading ? "جاري الرفع..." : buttonText}
      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileChange}
      />
    </Button>
  );
}
