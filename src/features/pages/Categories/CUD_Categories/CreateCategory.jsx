import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../api/refreshToken";
import { useTranslation } from "react-i18next";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import TerrainIcon from "@mui/icons-material/Terrain";

export default function CreateCategory() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    description_ar: "",
    description_en: "",
    icon: "mountain",
    sort_order: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
//     هذه الدالة تُحدّث حالة النموذج تلقائيًا لأي حقل
// لكنها تعالج حقل sort_order بشكل خاص
// لضمان أن قيمته تكون دائمًا رقمية (أو فارغة)، بينما بقية الحقول تبقى نصية كما أُدخلت.

    setFormData((prev) => ({
      ...prev,
      [name]: name === "sort_order" ? Number(value) || "" : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name_ar ||
      !formData.name_en ||
      !formData.description_ar ||
      !formData.description_en ||
      !formData.icon ||
      formData.sort_order === ""
    ) {
      alert(t("requiredCategoryFields"));
      return;
    }

    try {
      setLoading(true);

      await api.post("/categories", formData);

      navigate("/Categories", {
        state: { message: t("categoryCreated"), severity: "success" },
      });
    } catch (error) {
      console.error(error);
      alert(t("categoryCreateError"));
    } finally {
      setLoading(false);
    }
  };

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
              {t("addCategory")}
            </Typography>
          </Box>

          <Typography color="text.secondary">
            {t("addNewCategory")}
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
                label={t("descriptionArabic")}
                name="description_ar"
                value={formData.description_ar}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
                required
              />

              <TextField
                label={t("descriptionEnglish")}
                name="description_en"
                value={formData.description_en}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
                required
                dir="ltr"
              />

              <TextField
                select
                label={t("icon")}
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="mountain">{t("mountainIcon")}</MenuItem>
                <MenuItem value="beach">{t("beachIcon")}</MenuItem>
                <MenuItem value="museum">{t("museumIcon")}</MenuItem>
                <MenuItem value="camp">{t("campIcon")}</MenuItem>
                <MenuItem value="forest">{t("forestIcon")}</MenuItem>
              </TextField>

              <TextField
                label={t("sortOrder")}
                name="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={handleChange}
                fullWidth
                required
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
                disabled={loading}
                sx={{
                  px: 4,
                  py: 1.2,
                  borderRadius: 3,
                  textTransform: "none",
                }}
              >
                {loading ? t("saving") : t("saveCategory")}
              </Button>

              <Button
                variant="outlined"
                onClick={() => navigate("/Categories")}
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