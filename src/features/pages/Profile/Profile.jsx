import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "../../../contexts/useSnackbar";
import api from "../../../api/refreshToken";

import {
  Box, Container, Paper, Typography, Avatar, Button, Grid,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Chip, Stack,
} from "@mui/material";
 import MenuItem from "@mui/material/MenuItem";

import EditIcon from "@mui/icons-material/Edit";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LanguageIcon from "@mui/icons-material/Language";
import BadgeIcon from "@mui/icons-material/Badge";
import SaveIcon from "@mui/icons-material/Save";

const BACKEND_URL = "http://localhost:5000";

export default function Profile() {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();

  // =========================
  // 📦 الحالات (States)
  // =========================
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // نافذة التعديل
  const [openEdit, setOpenEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    preferred_language: "ar",
  });

  // مرجع حقل رفع الصورة
  const fileInputRef = useRef(null);

  // =========================
  //  بناء رابط الصورة الكامل
  // =========================

const getAvatarUrl = (avatar) => {
  const avatarPath = typeof avatar === "string" 
    ? avatar 
    : avatar?.url || avatar?.image_url || avatar?.path;
  
  if (!avatarPath) return undefined;
  
  // إذا كان رابط كامل، أرجعه كما هو
  if (/^https?:\/\//i.test(avatarPath)) return avatarPath;
  
    // إذا كان رابط نسبي، أضف عنوان السيرفر
  return avatarPath.startsWith('/') ? avatarPath : '/' + avatarPath;
};

  // =========================
  //  جلب بيانات البروفايل
  // =========================

 useEffect(() => {
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/auth/profile");
      const data = response.data?.data || response.data;
      setProfile(data);
      console.log("Profile data:", data);
      // تجهيز نموذج التعديل
      setFormData({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        phone: data.phone || "",
        preferred_language: data.preferred_language || "ar",
      });
    } catch (err) {
      console.error("Profile Error:", err);
      showSnackbar(t("profileLoadError") || "فشل تحميل البيانات", "error");
    } finally {
      setLoading(false);
    }
  };

    fetchProfile();
  }, [showSnackbar, t]);

  // =========================
  // 📷 رفع الصورة الشخصية
  // =========================
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // التحقق من الحجم (2 ميجا كحد أقصى حسب التوثيق)
    if (file.size > 2 * 1024 * 1024) {
      showSnackbar(t("avatarTooLarge") || "حجم الصورة يجب أن يكون أقل من 2 ميجا", "warning");
      return;
    }

    try {
      setUploadingAvatar(true);
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await api.put("/auth/profile/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = response.data?.data || response.data;
      const newAvatar =
        data.avatar || data.avatar_url;
      setProfile((prev) => ({ ...prev, ...data, avatar: newAvatar || prev.avatar }));
      showSnackbar(t("avatarUpdated") || "تم تحديث الصورة بنجاح", "success");
    } catch (err) {
      console.error("Avatar Error:", err);
      showSnackbar(
        err?.response?.data?.message || (t("avatarUpdateError") || "فشل رفع الصورة"),
        "error"
      );
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // =========================
  // 💾 حفظ التعديلات
  // =========================
  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await api.put("/auth/profile", formData);
      const data = response.data?.data || response.data;
      setProfile((prev) => ({ ...prev, ...data }));
      setOpenEdit(false);
      showSnackbar(t("profileUpdated") || "تم تحديث البيانات بنجاح", "success");
    } catch (err) {
      console.error("Save Error:", err);
      showSnackbar(
        err?.response?.data?.message || (t("profileUpdateError") || "فشل التحديث"),
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // ألوان الأدوار
  const getRoleColor = (role) => {
    if (role === "admin") return "error";
    if (role === "employee") return "info";
    return "default";
  };
  const getRoleLabel = (role) => {
    if (role === "admin") return t("admin") || "مدير";
    if (role === "employee") return t("employee") || "موظف";
    return t("customer") || "عميل";
  };

  // حالة التحميل
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) return null;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {/* ===== العنوان ===== */}
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3, textAlign: "center" }}>
        {t("profile") || "البروفايل"}
      </Typography>

      {/* ===== بطاقة البروفايل ===== */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
        }}
      >
        {/* الغطاء العلوي */}
        <Box
          sx={{
            height: 110,
            background: "linear-gradient(135deg, #1a5276 0%, #2e86c1 100%)",
          }}
        />

        <Box sx={{ px: 3, pb: 3 }}>
          {/* الصورة مع زر الكاميرا */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: -5, mb: 2 }}>
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={getAvatarUrl(
                  profile.avatar ||
                    profile.avatar_url ||
                    profile.profile_image ||
                    profile.image
                )}
                sx={{
                  width: 110,
                  height: 110,
                  fontSize: 44,
                  fontWeight: "bold",
                  bgcolor: "#3b82f6",
                  border: "4px solid white",
                }}
              >
                {(profile.first_name || "U").charAt(0)}
              </Avatar>

              {/* 📷 زر إضافة صورة */}
              <Button
                component="label"
                disabled={uploadingAvatar}
                sx={{
                  position: "absolute",
                  bottom: 4,
                  right: 4,
                  minWidth: 38,
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  boxShadow: 2,
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                {uploadingAvatar ? (
                  <CircularProgress size={18} sx={{ color: "white" }} />
                ) : (
                  <PhotoCameraIcon sx={{ color: "white", fontSize: 20 }} />
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </Button>
            </Box>
          </Box>

          {/* الاسم والدور */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="h5" fontWeight="bold">
              {profile.first_name} {profile.last_name}
            </Typography>
            <Chip
              icon={<BadgeIcon />}
              label={getRoleLabel(profile.role)}
              color={getRoleColor(profile.role)}
              size="small"
              sx={{ mt: 1, fontWeight: "bold" }}
            />
          </Box>

          {/* ===== معلومات البروفايل ===== */}
          <Stack spacing={1.5}>
            <InfoRow
              icon={<EmailIcon fontSize="small" />}
              label={t("email") || "البريد الإلكتروني"}
              value={profile.email}
              dir="ltr"
            />
            <InfoRow
              icon={<PhoneIcon fontSize="small" />}
              label={t("phone") || "رقم الهاتف"}
              value={profile.phone || "-"}
              dir="ltr"
            />
            <InfoRow
              icon={<LanguageIcon fontSize="small" />}
              label={t("preferredLanguage") || "اللغة المفضلة"}
              value={profile.preferred_language === "ar" ? "العربية" : "English"}
            />
          </Stack>

          {/* ===== زر التعديل ===== */}
          <Button
            fullWidth
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setOpenEdit(true)}
            sx={{ mt: 3, py: 1.3, borderRadius: 2, fontWeight: "bold" }}
          >
            {t("editProfile") || "تعديل البيانات"}
          </Button>
        </Box>
      </Paper>

      {/* ===== نافذة التعديل ===== */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="xs">
        <DialogTitle>{t("editProfile") || "تعديل البيانات"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid  xs={6}>
              <TextField
                fullWidth size="small"
                label={t("firstName") || "الاسم الأول"}
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              />
            </Grid>
            <Grid  xs={6}>
              <TextField
                fullWidth size="small"
                label={t("lastName") || "الاسم الأخير"}
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
            </Grid>
            <Grid  xs={12}>
              <TextField
                fullWidth size="small"
                label={t("phone") || "رقم الهاتف"}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                dir="ltr"
              />
            </Grid>
            <Grid  xs={12}>
            <TextField
                select fullWidth size="small"
                label={t("preferredLanguage") || "اللغة المفضلة"}
                value={formData.preferred_language}
                onChange={(e) => setFormData({ ...formData, preferred_language: e.target.value })}
                >
                <MenuItem value="ar">العربية</MenuItem>
                <MenuItem value="en">English</MenuItem>
            </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenEdit(false)}>{t("cancel") || "إلغاء"}</Button>
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (t("saving") || "جاري الحفظ...") : (t("save") || "حفظ")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

// ======================================================================
// 🧩 مكوّن مساعد: صف معلومات
// ======================================================================
function InfoRow({ icon, label, value, dir = "rtl" }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 1.5,
        borderRadius: 2,
        bgcolor: "#f9fafb",
      }}
    >
      <Box sx={{ color: "primary.main", display: "flex" }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          {label}
        </Typography>
        <Typography variant="body2" fontWeight="600" dir={dir}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}