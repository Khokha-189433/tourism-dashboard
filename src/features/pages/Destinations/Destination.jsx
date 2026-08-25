import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/refreshToken";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import PublicIcon from "@mui/icons-material/Public";
import LanguageIcon from "@mui/icons-material/Language";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { useTranslation } from "react-i18next";
import ImageGallery from "../../../components/UI/ImageGallery";

export default function DestinationDetails() {
  const { destinationId } = useParams();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // جلب معلومات الوجهة
  // ==========================================

  // جلب بيانات الوجهة من الخادم، وإعادة استخدامها بعد رفع صورة جديدة.
  const fetchDestination = useCallback(async () => {
      try {
        setLoading(true);

        const response = await api.get(
          `/destinations/${destinationId}`
        );

        setDestination(response.data?.data || response.data);

      } catch (error) {
        console.error(
          "Error fetching destination:",
          error
        );

        alert(t("destinationFetchError"));

        navigate("/Destinations");
      } finally {
        setLoading(false);
      }
  }, [destinationId, navigate, t]);

  useEffect(() => {
    const loadDestination = async () => {
      await fetchDestination();
    };

    loadDestination();
  }, [fetchDestination]);

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 400,
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // ==========================================
  // إذا لم توجد البيانات
  // ==========================================

  if (!destination) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h6"
          textAlign="center"
        >
          {t("destinationNotFound")}
        </Typography>
      </Container>
    );
  }

  // يرسل ImageUploader الطلب عبر api إلى POST /api/destinations/:id/image.
  const imageUploadPath = `/destinations/${destinationId}/image`;

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>

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
            navigate("/Destinations")
          }
        >
          {t("back")}
        </Button>

        {/* Title */}

        <Box
          sx={{
            textAlign: "right",
          }}
        >
          {/* يعرض الاسم باللغة الحالية، مع بديل إذا كانت الترجمة غير متوفرة. */}
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
                fontSize: 32,
              }}
            />

            <Typography
              variant="h4"
              fontWeight="bold"
            >
              {t("destinationDetails")}
            </Typography>
          </Box>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            {t("destinationDetailsDescription")}
          </Typography>
        </Box>
      </Box>

      {/* ======================================
          Main Card
      ====================================== */}

      <Card
        sx={{
          marginBlock:10,
          borderRadius: 4,
          overflow: "hidden",
          boxShadow:
            "0 6px 25px rgba(0,0,0,0.08)",
        }}
      >

        {/* ====================================
            Destination Image
        ==================================== */}

        <Box
          sx={{
            position: "relative",
            height: {
              xs: 250,
              md: 350,
            },
            overflow: "hidden",
          }}
        >

          {destination.image ? (
            <Box
              component="img"
              src={destination.image}
              alt={destination.name_en}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(135deg, #6ea3dc, #4286ae)",
              }}
            >
              <PublicIcon
                sx={{
                  fontSize: 100,
                  color: "white",
                  opacity: 0.8,
                }}
              />
            </Box>
          )}

          {/* Status */}

          <Box
            sx={{
              position: "absolute",
              top: 20,
              left: 20,
            }}
          >
            {destination.is_active ? (
              <Chip
                icon={<CheckCircleIcon />}
                label={t("active")}
                color="success"
                sx={{
                  fontWeight: "bold",
                  px: 1,
                }}
              />
            ) : (
              <Chip
                icon={<CancelIcon />}
                label={t("inactive")}
                color="error"
                sx={{
                  fontWeight: "bold",
                  px: 1,
                }}
              />
            )}
          </Box>

        </Box>

        {/* ====================================
            Information
        ==================================== */}

        <CardContent
          sx={{
            p: {
              xs: 3,
              md: 5,
            },
          }}
        >

          {/* Destination Names */}

          <Box
            sx={{
              textAlign: "right",
              mb: 4,
            }}
          >

            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                mb: 1,
              }}
            >
              {i18n.language === "ar"
                ? destination.name_ar || destination.name_en
                : destination.name_en || destination.name_ar}
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              dir="ltr"
              sx={{
                textAlign: "right",
              }}
            >
              {i18n.language === "ar"
                ? destination.name_en || destination.name_ar
                : destination.name_ar || destination.name_en}
            </Typography>

          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* ====================================
              Information Grid
          ==================================== */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 3,
            }}
          >

            {/* Country Arabic */}

            <InfoCard
              icon={<LocationOnIcon />}
              title={t("country")}
              value={i18n.language === "ar"
                ? destination.country_ar || destination.country_en
                : destination.country_en || destination.country_ar}
            />

            {/* Country English */}

            <InfoCard
              icon={<LanguageIcon />}
              title={t("countryCode")}
              value={destination.country_code}
              dir="ltr"
            />

            {/* Country Code */}

            <InfoCard
              icon={<PublicIcon />}
              title={t("id")}
              value={destination.id}
              dir="ltr"
            />

            {/* ID */}

            <InfoCard
              icon={<PublicIcon />}
              title={t("status")}
              value={destination.is_active ? t("active") : t("inactive")}
            />

          </Box>

          {/* ====================================
              Buttons
          ==================================== */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              gap: 2,
              mt: 5,
            }}
          >

            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() =>
                navigate(
                  `/destinations/EditDestination/${destination.id}`
                )
              }
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.3,
                textTransform: "none",
              }}
            >
              {t("edit")}
            </Button>

          </Box>

        </CardContent>
      </Card>

      {/* المعرض العام مسؤول عن رفع صورة الوجهة وعرضها وحذفها. */}
      <ImageGallery
        images={destination.image ? [{ image_url: destination.image }] : []}
        resourcePath="destinations"
        resourceId={destinationId}
        uploadPath={imageUploadPath}
        fieldName="image"
        multiple={false}
        displayLimit={1}
        onRefresh={fetchDestination}
        title={t("imageGallery")}
      
      />
    </Container>
  );
}


// ==========================================
// Information Card Component
// ==========================================

function InfoCard({
  icon,
  title,
  value,
  dir = "rtl",
}) {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        backgroundColor: "background.default",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 1,
          color: "#4286ae",
        }}
      >
        {icon}

        <Typography
          variant="body2"
          color="text.secondary"
        >
          {title}
        </Typography>
      </Box>

      <Typography
        variant="h6"
        fontWeight="bold"
        dir={dir}
      >
        {value || "-"}
      </Typography>
    </Box>
  );
}


