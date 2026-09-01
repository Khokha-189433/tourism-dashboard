import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../../../api/refreshToken";

// =========================
// MUI COMPONENTS
// =========================
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";

// =========================
// ICONS
// =========================
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";

export default function EditArticle() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { articleId } = useParams(); // 🎯 جلب الـ ID من الرابط

  // 1️⃣ حالة بيانات النموذج
  const [formData, setFormData] = useState({
    title_ar: "",
    title_en: "",
    content_ar: "",
    content_en: "",
    status: "draft",
  });

  // 2️⃣ حالات التحميل والخطأ
  const [loading, setLoading] = useState(false);     // أثناء الحفظ
  const [fetching, setFetching] = useState(true);    // أثناء جلب البيانات
  const [error, setError] = useState("");
  const [fetchError, setFetchError] = useState("");

  // 3️⃣ 🎯 جلب بيانات المقال الحالية عند فتح الصفحة
  useEffect(() => {
    if (!articleId) return;

    const fetchArticle = async () => {
      try {
        setFetching(true);
        const response = await api.get(`/articles/${articleId}`);
        const article = response.data?.data || response.data;

        if (!article) {
          setFetchError("المقال غير موجود");
          return;
        }

        // 🎯 ملء النموذج بالبيانات الموجودة
        setFormData({
          title_ar: article.title_ar || "",
          title_en: article.title_en || "",
          content_ar: article.content_ar || "",
          content_en: article.content_en || "",
          status: article.status || "draft",
        });
      } catch (err) {
        console.error("Fetch Error:", err);
        setFetchError(err?.response?.data?.message || "فشل جلب بيانات المقال");
      } finally {
        setFetching(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  // 4️⃣ دالة موحدة لتحديث أي حقل
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 5️⃣ دالة إرسال التعديلات للسيرفر (PUT بدلاً من POST)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // تحقق بسيط من الحقول المطلوبة
    if (!formData.title_ar || !formData.content_ar) {
      setError("يرجى ملء العنوان والمحتوى بالعربية على الأقل");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 🎯 استخدام PUT للتحديث بدلاً من POST للإنشاء
      await api.put(`/articles/${articleId}`, formData);
      
      // عند النجاح: العودة لصفحة قائمة المقالات
      navigate("/Articles");
    } catch (err) {
      console.error("Update Error:", err);
      setError(err?.response?.data?.message || "فشل تحديث المقال");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================================
  // حالات التحميل والخطأ (أثناء جلب البيانات)
  // ======================================================================
  if (fetching) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (fetchError) {
    return (
      <Box sx={{ p: 5, textAlign: "center" }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {fetchError}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/Articles")}
        >
          {t("back") || "رجوع"}
        </Button>
      </Box>
    );
  }

  // ======================================================================
  // واجهة المستخدم (UI) - مشابهة لـ CreateArticle
  // ======================================================================
  return (
    <Box component="main" sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
      
      {/* ===== الهيدر ===== */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/Articles")}>
          {t("back") || "رجوع"}
        </Button>
        <EditIcon color="primary" />
        <Typography variant="h4" fontWeight="bold">
          {t("editArticle") || "تعديل المقال"}
        </Typography>
      </Box>

      {/* ===== رسالة الخطأ ===== */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* ===== نموذج التعديل ===== */}
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              
              {/* 1. العناوين (عربي / إنجليزي) */}
              <Grid  xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label={t("titleArabic") || "العنوان بالعربية"}
                  name="title_ar"
                  value={formData.title_ar}
                  onChange={handleChange}
                />
              </Grid>
              <Grid  xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t("titleEnglish") || "العنوان بالإنجليزية"}
                  name="title_en"
                  value={formData.title_en}
                  onChange={handleChange}
                />
              </Grid>

              {/* 2. المحتوى (عربي / إنجليزي) */}
              <Grid  xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={6}
                  label={t("contentArabic") || "المحتوى بالعربية"}
                  name="content_ar"
                  value={formData.content_ar}
                  onChange={handleChange}
                />
              </Grid>
              <Grid  xs={12} md={6}>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label={t("contentEnglish") || "المحتوى بالإنجليزية"}
                  name="content_en"
                  value={formData.content_en}
                  onChange={handleChange}
                />
              </Grid>

              {/* 3. حالة النشر */}
              <Grid  xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>{t("status") || "حالة النشر"}</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    label={t("status") || "حالة النشر"}
                    onChange={handleChange}
                  >
                    <MenuItem value="draft">{t("draft") || "مسودة"}</MenuItem>
                    <MenuItem value="published">{t("published") || "منشور"}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* 4. أزرار التحكم */}
              <Grid  xs={12}>
                <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/Articles")}
                    disabled={loading}
                  >
                    {t("cancel") || "إلغاء"}
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={loading}
                    sx={{ minWidth: 150 }}
                  >
                    {loading ? (t("saving") || "جاري الحفظ...") : (t("update") || "تحديث المقال")}
                  </Button>
                </Box>
              </Grid>

            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}