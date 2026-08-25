import React, { useRef, useState } from "react";
import { Button } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import api from "../../api/refreshToken";
import { useTranslation } from "react-i18next";

// مكون عام لرفع صورة واحدة أو عدة صور يمكن استخدامه في أي صفحة داخل المشروع.
export default function ImageUploader({
  uploadUrl,
  fieldName = "images",
  buttonText = "إضافة صورة",
  multiple = true,
  onUploaded,
  onUnauthorized,
}) {
  const { t } = useTranslation();
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

      alert(t("imageUploadError"));
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
      {uploading ? t("uploadingImage") : buttonText === "إضافة صورة" ? t("addImage") : buttonText}
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
