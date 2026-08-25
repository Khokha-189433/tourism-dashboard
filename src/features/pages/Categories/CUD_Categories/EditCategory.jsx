import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../api/refreshToken";
import { useTranslation } from "react-i18next";

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import TerrainIcon from "@mui/icons-material/Terrain";

export default function EditCategory() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    sort_order: "",
  });

  // جلب بيانات التصنيف
  useEffect(() => {
    const getCategory = async () => {
      try {
        const response = await api.get(`/categories/${categoryId}`);

        const data = response.data.data || response.data;

        setFormData({
          name_ar: data.name_ar || "",
          name_en: data.name_en || "",
          sort_order: data.sort_order ?? "",
        });
      } catch (error) {
        console.error("Error fetching category:", error);
        alert(t("categoryFetchError"));
      } finally {
        setLoading(false);
      }
    };

    getCategory();
  }, [categoryId, t]);

  // تحديث الحقول
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // حفظ التعديلات
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name_ar.trim() ||
      !formData.name_en.trim() ||
      formData.sort_order === ""
    ) {
      alert(t("requiredCategoryFields"));
      return;
    }

    try {
      setSaving(true);

      await api.put(`/categories/${categoryId}`, formData);

      navigate("/Categories", {
        state: { message: t("categoryUpdated"), severity: "success" },
      });
    } catch (error) {
      console.error("Error updating category:", error);
      alert(t("categoryUpdateError"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 6 }}>
        <Box   sx={{justifyContent:"center"  , display:"flex" }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      {/* Header */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/Categories")}
        >
          {t("back")}
        </Button>

        <Box sx={{ textAlign: "right" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 1,
            }}
          >
            <TerrainIcon sx={{ color: "#4286AE", fontSize: 30 }} />

            <Typography variant="h4" fontWeight="bold">
              {t("editCategory")}
            </Typography>
          </Box>

          <Typography color="text.secondary">
            {t("editCategoryDescription")}
          </Typography>
        </Box>
      </Box>

      {/* Form */}

      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit} dir="rtl">
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 3, color: "#4286AE" }}
            >
              {t("categoryInformation")}
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                },
                gap: 2,
              }}
            >
              <TextField
                label={t("categoryNameArabic")}
                name="name_ar"
                value={formData.name_ar}
                onChange={handleChange}
                required
                fullWidth
              />

              <TextField
                label={t("categoryNameEnglish")}
                name="name_en"
                value={formData.name_en}
                onChange={handleChange}
                required
                fullWidth
                dir="ltr"
              />

              <TextField
                label={t("sortOrder")}
                name="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={handleChange}
                required
                fullWidth
              />
            </Box>

            {/* Buttons */}

            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 4,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={saving}
                sx={{
                  px: 4,
                  py: 1.2,
                  borderRadius: 3,
                  textTransform: "none",
                }}
              >
                {saving ? t("saving") : t("updateCategory")}
              </Button>

              <Button
                variant="outlined"
                onClick={() => navigate("/Categories")}
                disabled={saving}
                sx={{
                  px: 4,
                  py: 1.2,
                  borderRadius: 3,
                  textTransform: "none",
                }}
              >
                {t("cancel")}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}