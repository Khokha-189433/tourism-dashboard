import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import PaymentsIcon from "@mui/icons-material/Payments";

import api from "../../../../api/refreshToken";

export default function EditTransport() {
  const { transportId } = useParams();
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();

  const isArabic = i18n.language === "ar";

  // ==========================================
  // بيانات النموذج
  // ==========================================

  const [price, setPrice] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ==========================================
  // جلب بيانات وسيلة النقل
  // ==========================================

  useEffect(() => {
    const getTransport = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/transports/${transportId}`
        );

        const transport = response.data?.data;

        // وضع السعر الحالي داخل input
        setPrice(transport?.price_per_trip || "");

      } catch (error) {
        console.error(
          "Error fetching transport:",
          error
        );

        alert(t("transportFetchError"));

      } finally {
        setLoading(false);
      }
    };

    getTransport();
  }, [transportId, t]);

  // ==========================================
  // تعديل السعر
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // التأكد من إدخال السعر
    if (!price || Number(price) <= 0) {
      alert(t("enterValidPrice"));
      return;
    }

    try {
      setSaving(true);

      // إرسال السعر الجديد إلى API
      await api.put(
        `/transports/${transportId}`,
        {
          price_per_trip: Number(price),
        }
      );

      // العودة إلى صفحة التفاصيل
      navigate(`/Transport/${transportId}`, {
        state: {
          message: t("transportUpdated"),
          severity: "success",
        },
      });

    } catch (error) {
      console.error(
        "Transport update failed:",
        error
      );

      alert(t("transportUpdateError"));

    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <Container
        maxWidth="md"
        sx={{ py: 8 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // ==========================================
  // Page
  // ==========================================

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 5,
        direction: isArabic ? "rtl" : "ltr",
      }}
    >

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

        {/* Back */}

        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() =>
            navigate(`/Transport/${transportId}`)
          }
          sx={{
            textTransform: "none",
          }}
        >
          {t("back")}
        </Button>


        {/* Title */}

        <Box
          sx={{
            textAlign: isArabic
              ? "right"
              : "left",
          }}
        >

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >

            <PaymentsIcon
              sx={{
                color: "#4286AE",
                fontSize: 32,
              }}
            />

            <Typography
              variant="h4"
              fontWeight="bold"
            >
              {t("editTransport")}
            </Typography>

          </Box>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            {t("editTransportDescription")}
          </Typography>

        </Box>

      </Box>


      {/* ======================================
          Form Card
      ====================================== */}

      <Card
        sx={{
          borderRadius: 4,
          boxShadow:
            "0 6px 25px rgba(0,0,0,0.08)",
        }}
      >

        <CardContent sx={{ p: 4 }}>

          <Box
            component="form"
            onSubmit={handleSubmit}
          >

            {/* Title */}

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


            {/* Price */}

           <TextField
            fullWidth
            label={t("pricePerTrip")}
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required

            slotProps={{
              htmlInput: {
                min: 1,
              },

              input: {
                startAdornment: (
                  <PaymentsIcon
                    sx={{
                      mr: 1,
                      color: "#4286AE",
                    }}
                  />
                ),
              },
            }}
          />


            {/* Buttons */}

            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 4,
              }}
            >

              {/* Save */}

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
                {saving
                  ? t("saving")
                  : t("save")}
              </Button>


              {/* Cancel */}

              <Button
                variant="outlined"
                onClick={() =>
                  navigate(
                    `/Transport/${transportId}`
                  )
                }
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