import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../api/refreshToken";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";

import { useTranslation } from "react-i18next";

export default function DestinationForm({ mode = "create", destinationId }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isEdit = mode === "edit";

  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    country_ar: "",
    country_en: "",
    country_code: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  // ==========================================
  // جلب بيانات الوجهة في حالة التعديل
  // ==========================================

  useEffect(() => {
    if (!isEdit || !destinationId) return;

    const fetchDestination = async () => {
      try {
        setFetching(true);

        const response = await api.get(
          `/destinations/${destinationId}`
        );

        const data = response.data?.data || response.data;

        setFormData({
          name_ar: data.name_ar || "",
          name_en: data.name_en || "",
          country_ar: data.country_ar || "",
          country_en: data.country_en || "",
          country_code: data.country_code || "",
        });
      } catch (error) {
        console.error("Error fetching destination:", error);

        alert(t("destinationFetchError"));

        navigate("/Destinations");
      } finally {
        setFetching(false);
      }
    };

    fetchDestination();
  }, [isEdit, destinationId, navigate, t]);

  // ==========================================
  // تغيير قيم الحقول
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "country_code"
          ? value.toUpperCase()
          : value,
    }));
  };

  // ==========================================
  // التحقق من البيانات
  // ==========================================

  const validateForm = () => {
    if (
      !formData.name_ar.trim() ||
      !formData.name_en.trim() ||
      !formData.country_ar.trim() ||
      !formData.country_en.trim() ||
      !formData.country_code.trim()
    ) {
      alert(t("requiredDestinationFields"));
      return false;
    }

    if (formData.country_code.length !== 3) {
      alert(t("countryCodeMustBeThreeCharacters"));
      return false;
    }

    return true;
  };

  // ==========================================
  // إنشاء أو تعديل الوجهة
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      if (isEdit) {
        // PUT
        await api.put(
          `/destinations/${destinationId}`,
          formData
        );

      } else {
        // POST
        await api.post(
          "/destinations",
          formData
        );

      }

      navigate("/Destinations", {
        state: {
          message: isEdit ? t("destinationUpdated") : t("destinationCreated"),
          severity: "success",
        },
      });

    } catch (error) {
      console.error(
        isEdit
          ? "Error updating destination:"
          : "Error creating destination:",
        error
      );

      alert(
        isEdit
          ? t("destinationUpdateError")
          : t("destinationCreateError")
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Loading أثناء جلب البيانات
  // ==========================================

  if (fetching) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 300,
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>

      {/* ======================================
          Header
      ====================================== */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >

        {/* زر الرجوع */}

        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/Destinations")}
          disabled={loading}
        >
          {t("back")}
        </Button>

        {/* العنوان */}

        <Box sx={{ textAlign: "right" }}>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 1,
            }}
          >

            <FlightTakeoffIcon
              sx={{
                color: "#6ea3dc",
                fontSize: 30,
              }}
            />

            <Typography
              variant="h4"
              fontWeight="bold"
            >
              {isEdit
                ? t("editDestination")
                : t("addDestination")}
            </Typography>

          </Box>

          <Typography color="text.secondary">
            {isEdit
              ? t("editDestinationDescription")
              : t("addNewDestination")}
          </Typography>

        </Box>
      </Box>

      {/* ======================================
          Form Card
      ====================================== */}

      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
        }}
      >

        <CardContent sx={{ p: 4 }}>

          <Box
            component="form"
            onSubmit={handleSubmit}
            dir="rtl"
          >

            {/* عنوان القسم */}

            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                mb: 3,
                fontSize: 27,
                color: "#4286ae",
              }}
            >
              {t("destinationInformation")}
            </Typography>

            {/* =================================
                Fields
            ================================= */}

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

              {/* الاسم العربي */}

              <TextField
                label={t("destinationNameArabic")}
                name="name_ar"
                value={formData.name_ar}
                onChange={handleChange}
                fullWidth
                required
                placeholder={t("cairoExample")}
              />

              {/* الاسم الإنجليزي */}

              <TextField
                label={t("destinationNameEnglish")}
                name="name_en"
                value={formData.name_en}
                onChange={handleChange}
                fullWidth
                required
                placeholder={t("cairoExampleEnglish")}
                dir="ltr"
              />

              {/* الدولة العربية */}

              <TextField
                label={t("countryNameArabic")}
                name="country_ar"
                value={formData.country_ar}
                onChange={handleChange}
                fullWidth
                required
                placeholder={t("egyptExample")}
              />

              {/* الدولة الإنجليزية */}

              <TextField
                label={t("countryNameEnglish")}
                name="country_en"
                value={formData.country_en}
                onChange={handleChange}
                fullWidth
                required
                placeholder={t("egyptExampleEnglish")}
                dir="ltr"
              />

              {/* رمز الدولة */}

              <TextField
                label={t("countryCode")}
                name="country_code"
                value={formData.country_code}
                onChange={handleChange}
                fullWidth
                required
                placeholder={t("countryCodeExample")}
                dir="ltr"
                slotProps={{
                  htmlInput: {
                    maxLength: 3,
                    style: {
                      textTransform: "uppercase",
                    },
                  },
                }}
              />

            </Box>

            {/* =================================
                Buttons
            ================================= */}

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                gap: 2,
                mt: 4,
              }}
            >

              {/* حفظ */}

              <Button
                type="submit"
                variant="contained"
                startIcon={
                  loading ? (
                    <CircularProgress
                      size={20}
                      color="inherit"
                    />
                  ) : (
                    <SaveIcon />
                  )
                }
                disabled={loading}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.3,
                  textTransform: "none",
                }}
              >
                {loading
                  ? t("saving")
                  : isEdit
                  ? t("updateDestination")
                  : t("saveDestination")}
              </Button>

              {/* إلغاء */}

              <Button
                variant="outlined"
                onClick={() =>
                  navigate("/Destinations")
                }
                disabled={loading}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.3,
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