import React from "react";
import { Box, Typography } from "@mui/material";

/**
 * 🎯 مكون صف معلومات - قابل لإعادة الاستخدام
 * 
 * Props:
 * - icon: الأيقونة (مثل <EmailIcon fontSize="small" />)
 * - label: النص الوصفي (مثل "البريد الإلكتروني")
 * - value: القيمة (مثل "ahmed@test.com")
 * - dir: اتجاه النص ("rtl" أو "ltr")
 * - highlight: هل نبرز القيمة؟ (true/false)
 */
export default function InfoRow({ 
  icon, 
  label, 
  value, 
  dir = "rtl", 
  highlight = false 
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        py: 1.5,
        px: 1,
        borderBottom: "1px solid #f3f4f6",
        "&:last-child": { borderBottom: "none" },
        "&:hover": { bgcolor: "#f9fafb" },
        transition: "background 0.2s",
      }}
    >
      {/* الأيقونة */}
      <Box sx={{ color: "text.secondary", display: "flex" }}>
        {icon}
      </Box>

      {/* النص الوصفي */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ minWidth: 140, fontWeight: "medium" }}
      >
        {label}
      </Typography>

      {/* القيمة */}
      <Typography
        variant="body2"
        dir={dir}
        sx={{
          flex: 1,
          fontWeight: highlight ? "bold" : "regular",
          color: highlight ? "primary.main" : "text.primary",
          fontFamily: dir === "ltr" ? "monospace" : "inherit",
        }}
      >
        {value || "-"}
      </Typography>
    </Box>
  );
}