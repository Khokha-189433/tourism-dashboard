import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

/**
 *    موحد - يستخدم في كل بطاقات الداشبورد
 */
export default function CardHeader({ icon, color = "#3b82f6", title, action }) {
  return (
    <Box
      sx={{
        p: 2.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2,
            bgcolor: `${color}15`,
            color: color,
          }}
        >
          {icon}
        </Avatar>
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
      </Box>

      {action}
    </Box>
  );
}