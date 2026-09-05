import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "../../contexts/useSnackbar";
import api from "../../api/refreshToken";

import {
  Avatar, Box, Menu, MenuItem, ListItemIcon, Divider,
  Typography, CircularProgress, IconButton, Tooltip,
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";

export default function UserMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [profile, setProfile] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // =========================
    // دالة مساعدة للحصول على رابط الصورة
  // =========================
  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    if (/^https?:\/\//i.test(avatar)) return avatar;
    return avatar.startsWith("/") ? avatar : "/" + avatar;
  };

  // =========================
  // 🎯 جلب بيانات البروفايل
  // =========================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/profile");
        const data = response.data?.data || response.data;
        setProfile(data);
      } catch (err) {
        console.error("UserMenu Profile Error:", err);
      }
    };

    fetchProfile();
  }, []);

  // =========================
  // 🚪 تسجيل الخروج
  // =========================
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout Error:", err);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      showSnackbar(t("loggedOut") || "تم تسجيل الخروج", "success");
      navigate("/login");
    }
  };

  // حالة التحميل
  if (!profile) {
    return <CircularProgress size={28} />;
  }

  return (
    <>
      {/* ===== زر الأفاتار ===== */}
      <Tooltip title={t("account") || "الحساب"}>
        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ p: 0.5 }}
        >
          <Avatar
            src={getAvatarUrl(profile.avatar)}
            sx={{
              width: 38,
              height: 38,
              bgcolor: "#3b82f6",
              fontWeight: "bold",
              border: "2px solid #e5e7eb",
            }}
          >
            {(profile.first_name || "U").charAt(0)}
          </Avatar>
        </IconButton>
      </Tooltip>

      {/* ===== القائمة المنسدلة ===== */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        onClick={() => setAnchorEl(null)}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1.5,
            minWidth: 220,
            borderRadius: 3,
            border: "1px solid #e5e7eb",
            boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* رأس القائمة: الصورة والاسم */}
        <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            src={getAvatarUrl(profile.avatar)}
            sx={{ width: 44, height: 44, bgcolor: "#3b82f6", fontWeight: "bold" }}
          >
            {(profile.first_name || "U").charAt(0)}
          </Avatar>
          <Box sx={{ overflow: "hidden" }}>
            <Typography fontWeight="bold" noWrap>
              {profile.first_name} {profile.last_name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap dir="ltr" display="block">
              {profile.email}
            </Typography>
          </Box>
        </Box>

        <Divider />

        {/* البروفايل */}
        <MenuItem onClick={() => navigate("/profile")}>
          <ListItemIcon>
           
          </ListItemIcon>
          {t("profile") || "البروفايل"}
        </MenuItem>

        <Divider />

        {/* تسجيل الخروج */}
        <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          {t("logout") || "تسجيل الخروج"}
        </MenuItem>
      </Menu>
    </>
  );
}