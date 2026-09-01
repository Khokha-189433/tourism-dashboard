import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Button,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PeopleIcon from "@mui/icons-material/People";
import CardHeader from "./CardHeader";

export default function RecentUsers({ users = [] }) {
  const { t } = useTranslation();

  // دالة لتحديد لون شارة الدور
  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin": return "error";
      case "employee": return "info";
      case "customer": return "success";
      default: return "default";
    }
  };

  // دالة لاستخراج نص الدور بالعربية/الإنجليزية
  const getRoleLabel = (role) => {
    const roleMap = {
      admin: t("admin") || "مدير",
      employee: t("employee") || "موظف",
      customer: t("customer") || "عميل",
    };
    return roleMap[role?.toLowerCase()] || role;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        height: "100%",
      }}
    >
      {/* 🎯 الرأس الموحد */}
      <CardHeader
        icon={<PeopleIcon fontSize="small" />}
        color="#3b82f6"
        title={t("recentUsers") || "آخر المستخدمين"}
        action={
          <Button
            component={Link}
            to="/Users"
            endIcon={<ArrowForwardIcon />}
            size="small"
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            {t("viewAll") || "عرض الكل"}
          </Button>
        }
      />

      {/* محتوى البطاقة */}
      <Box sx={{ maxHeight: 400, overflowY: "auto" ,width:350 }}>
        {users.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <PeopleIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
            <Typography color="text.secondary">
              {t("noUsersYet") || "لا يوجد مستخدمين بعد"}
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 1 }}>
            {users.map((user, index) => (
              <ListItem
                key={user.id}
                divider={index < users.length - 1}
                sx={{
                  px: 2.5,
                  py: 1.5,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "#f9fafb",
                  },
                }}
              >
                <ListItemAvatar sx={{ minWidth: 48 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: getAvatarColor(user.role),
                      fontWeight: "bold",
                      fontSize: "1rem",
                    }}
                  >
                    {user.first_name?.charAt(0) || "U"}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight="bold" noWrap>
                      {user.first_name} {user.last_name}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      noWrap
                      dir="ltr"
                      sx={{ textAlign: "left" }}
                    >
                      {user.email}
                    </Typography>
                  }
                  sx={{ my: 0, mr: 2, minWidth: 0 }}
                />

                <Chip
                  label={getRoleLabel(user.role)}
                  color={getRoleColor(user.role)}
                  size="small"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "0.7rem",
                    height: 22,
                    flexShrink: 0,
                  }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
}

// ======================================================================
// 🎨 دالة مساعدة: لون الصورة الرمزية حسب الدور
// ======================================================================
function getAvatarColor(role) {
  switch (role?.toLowerCase()) {
    case "admin": return "#ef4444";     // أحمر للمدير
    case "employee": return "#3b82f6"; // أزرق للموظف
    case "customer": return "#10b981"; // أخضر للعميل
    default: return "#6b7280";         // رمادي افتراضي
  }
}