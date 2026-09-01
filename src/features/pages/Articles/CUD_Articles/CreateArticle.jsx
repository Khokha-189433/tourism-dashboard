import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function CreateArticle() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  //  حالة بيانات النموذج
  const [formData, setFormData] = useState({
    title_ar: "",
    title_en: "",
    content_ar: "",
    content_en: "",
    status: "draft",
  });

  // حالات التحميل والخطأ
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // دالة موحدة لتحديث أي حقل
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // دالة إرسال البيانات للسيرفر
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title_ar || !formData.content_ar) {
      setError("يرجى ملء العنوان والمحتوى بالعربية على الأقل");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/articles", formData);
      navigate("/Articles");
    } catch (err) {
      console.error("Create Error:", err);
      setError(err?.response?.data?.message || "فشل حفظ المقال");
    } finally {
      setLoading(false);
    }
  };


  

  return (
    <Box component="main" sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
      
      {/* الهيدر */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/Articles")}>
          {t("back")}
        </Button>
        <Typography variant="h4" fontWeight="bold">
          {t("addArticle")}
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              
              {/* العناوين */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label={t("titleArabic")}
                  name="title_ar"
                  value={formData.title_ar}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t("titleEnglish")}
                  name="title_en"
                  value={formData.title_en}
                  onChange={handleChange}
                />
              </Grid>

              {/* المحتوى */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={6}
                  label={t("contentArabic")}
                  name="content_ar"
                  value={formData.content_ar}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label={t("contentEnglish")}
                  name="content_en"
                  value={formData.content_en}
                  onChange={handleChange}
                />
              </Grid>

              {/* حالة النشر */}
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>{t("status")}</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    label={t("status")}
                    onChange={handleChange}
                  >
                    <MenuItem value="draft">{t("draft")}</MenuItem>
                    <MenuItem value="published">{t("published")}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* الأزرار */}
              <Grid item xs={12}>
                <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/Articles")}
                    disabled={loading}
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={loading}
                    sx={{ minWidth: 150 }}
                  >
                    {loading ? t("saving") : t("save")}
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