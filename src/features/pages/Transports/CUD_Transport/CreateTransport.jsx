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
  Alert,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";

export default function CreateTransport() {
  const navigate = useNavigate();

  // الترجمة
  const { t, i18n } = useTranslation();

  // معرفة اللغة الحالية
  const isArabic = i18n.language === "ar";

  // حالة التحميل
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // بيانات النموذج
  const [formData, setFormData] = useState({
    type: "bus",

    name_ar: "",
    name_en: "",

    description_ar: "",
    description_en: "",

    capacity: "",

    price_per_trip: "",

    currency: "SYP",

    company_name: "",

    contact_phone: "",
  });

  // =====================================================
  // تغيير قيم الحقول
  // =====================================================

const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  // =====================================================
  // إرسال النموذج
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق من الحقول المطلوبة
    if (
      !formData.type ||
      !formData.name_ar ||
      !formData.name_en ||
      !formData.description_ar ||
      !formData.description_en ||
      formData.capacity === "" ||
      formData.price_per_trip === "" ||
      !formData.currency ||
      !formData.company_name ||
      !formData.contact_phone
    ) {
      setError(t("requiredTransportFields"));
      return;
    }

    if (
      !Number.isInteger(Number(formData.capacity)) ||
      Number(formData.capacity) < 1 ||
      !Number.isFinite(Number(formData.price_per_trip)) ||
      Number(formData.price_per_trip) < 0
    ) {
      setError(t("invalidTransportNumbers"));
      return;
    }

    try {
      setLoading(true);
      setError("");

const payload = {
  type: formData.type,

  name_ar: formData.name_ar.trim(),
  name_en: formData.name_en.trim(),

  description_ar: formData.description_ar.trim(),
  description_en: formData.description_en.trim(),

  capacity: Number(formData.capacity),
  price_per_trip: Number(formData.price_per_trip),

  currency: formData.currency,

  company_name: formData.company_name.trim(),
  contact_phone: formData.contact_phone.trim(),
};

console.log("Sending transport:", payload);

await api.post("/transports", payload);
      // بعد النجاح العودة إلى صفحة وسائل النقل
      navigate("/Transports", {
        state: {
          message: t("transportCreated"),
          severity: "success",
        },
      });
    }catch (error) {
    console.error(
        "Transport creation failed:",
        error.response?.data
    );

    console.log(
        "Validation errors:",
        error.response?.data?.errors
    );

    setError(
        error.response?.data?.message ||
        t("transportCreateError")
    );
    }finally {
        setLoading(false);
        }
    };

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 5,
        direction: isArabic ? "rtl" : "ltr",
      }}
    >

      {/* =================================================
          Header
      ================================================= */}

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
          onClick={() => navigate("/Transports")}
          sx={{
            textTransform: "none",
          }}
        >
          {t("back")}
        </Button>


        {/* عنوان الصفحة */}

        <Box
          sx={{
            textAlign: isArabic ? "right" : "left",
          }}
        >

          <Box
            sx={{
              display: "flex",
              alignItems: "center",

              justifyContent: isArabic
                ? "flex-start"
                : "flex-end",

              gap: 1,
            }}
          >

            <DirectionsBusIcon
              sx={{
                color: "#4286AE",
                fontSize: 32,
              }}
            />

            <Typography
              variant="h4"
              fontWeight="bold"
            >
              {t("addTransport")}
            </Typography>

          </Box>

          <Typography color="text.secondary">
            {t("addNewTransport")}
          </Typography>

        </Box>

      </Box>


      {/* =================================================
          Form Card
      ================================================= */}

      <Card
        sx={{
          borderRadius: 4,

          boxShadow:
            "0 6px 25px rgba(0,0,0,0.08)",
        }}
      >
        {error && (
          <Alert
            severity="error"
            onClose={() => setError("")}
            sx={{ mx: { xs: 2, sm: 4 }, mt: 3, borderRadius: 2 }}
          >
            {error}
          </Alert>
        )}

        <CardContent
          sx={{
            p: {
              xs: 2,
              sm: 4,
            },
          }}
        >

          <Box
            component="form"
            onSubmit={handleSubmit}

            // اتجاه النموذج يتغير حسب اللغة
            dir={isArabic ? "rtl" : "ltr"}
          >

            {/* =================================================
                عنوان القسم
            ================================================= */}

            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                mb: 3,
                color: "#4286AE",
              }}
            >
              {t("transportInformation")}
            </Typography>


            {/* =================================================
                الحقول
            ================================================= */}

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

              {/* ===============================================
                  Type
              =============================================== */}
            <TextField
            select
            label={t("transportType")}
            name="type"
            value={formData.type}
            onChange={handleChange}
            fullWidth
            required
            >
            <MenuItem value="bus">
                {t("transportTypes.bus")}
            </MenuItem>

            <MenuItem value="minibus">
                {t("transportTypes.minibus")}
            </MenuItem>

            <MenuItem value="car">
                {t("transportTypes.car")}
            </MenuItem>

            <MenuItem value="airplane">
                {t("transportTypes.airplane")}
            </MenuItem>

            <MenuItem value="boat">
                {t("transportTypes.boat")}
            </MenuItem>

            <MenuItem value="train">
                {t("transportTypes.train")}
            </MenuItem>
            </TextField>


              {/* ===============================================
                  Capacity
              =============================================== */}

              <TextField
                label={t("capacity")}
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
                fullWidth
                required
                slotProps={{
                htmlInput: {
                min: 1,
                 },
                }}
              />


              {/* ===============================================
                  Arabic Name
              =============================================== */}

              <TextField
                label={t("transportNameArabic")}
                name="name_ar"
                value={formData.name_ar}
                onChange={handleChange}
                required
                fullWidth

                // العربية
                dir="rtl"
              />


              {/* ===============================================
                  English Name
              =============================================== */}

              <TextField
                label={t("transportNameEnglish")}
                name="name_en"
                value={formData.name_en}
                onChange={handleChange}
                required
                fullWidth

                // الإنجليزية
                dir="ltr"
              />


              {/* ===============================================
                  Arabic Description
              =============================================== */}

              <TextField
                label={t("transportDescriptionArabic")}
                name="description_ar"
                value={formData.description_ar}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
                required

                dir="rtl"
              />


              {/* ===============================================
                  English Description
              =============================================== */}

              <TextField
                label={t("transportDescriptionEnglish")}
                name="description_en"
                value={formData.description_en}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
                required
                dir="ltr"
              />


              {/* ===============================================
                  Price
              =============================================== */}

              <TextField
                label={t("pricePerTrip")}
                name="price_per_trip"
                type="number"
                value={formData.price_per_trip}
                onChange={handleChange}
                fullWidth
                required
                slotProps={{
                htmlInput: {
                min: 0,
                    },
                }}
                
              />


              {/* ===============================================
                  Currency
              =============================================== */}

              <TextField
                select
                label={t("currency")}
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                fullWidth
                required
              >

                <MenuItem value="SYP">
                  SYP
                </MenuItem>

                <MenuItem value="USD">
                  USD
                </MenuItem>

              </TextField>


              {/* ===============================================
                  Company Name
              =============================================== */}

              <TextField
                label={t("companyName")}
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                fullWidth
                required
              />


              {/* ===============================================
                  Phone
              =============================================== */}

              <TextField
                label={t("contactPhone")}
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                fullWidth
                required

                // رقم الهاتف يكون LTR
                dir="ltr"
              />

            </Box>


            {/* =================================================
                Buttons
            ================================================= */}

            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 4,

                // في العربية تبدأ الأزرار من اليمين
                justifyContent: isArabic
                  ? "flex-start"
                  : "flex-start",
              }}
            >

              {/* Save */}

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
                  backgroundColor: "#4286AE",

                  "&:hover": {
                    backgroundColor: "#357391",
                  },
                }}
              >
                {loading
                  ? t("saving")
                  : t("saveTransport")}
              </Button>


              {/* Cancel */}

              <Button
                variant="outlined"
                onClick={() =>
                    navigate("/Transports")
                }
                disabled={loading}
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