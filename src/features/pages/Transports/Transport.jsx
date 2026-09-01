import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import FlightIcon from "@mui/icons-material/Flight";
import TrainIcon from "@mui/icons-material/Train";

import PeopleIcon from "@mui/icons-material/People";
import PaymentsIcon from "@mui/icons-material/Payments";
import BusinessIcon from "@mui/icons-material/Business";
import PhoneIcon from "@mui/icons-material/Phone";
import PublicIcon from "@mui/icons-material/Public";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import api from "../../../api/refreshToken";

export default function Transport() {

  // ==========================================
  // Router
  // ==========================================

  const { transportId } = useParams();
  const navigate = useNavigate();


  // ==========================================
  // Translation
  // ==========================================

  const { i18n, t } = useTranslation();

  const isArabic = i18n.language === "ar";


  // ==========================================
  // State
  // ==========================================

  const [transport, setTransport] = useState(null);

  const [loading, setLoading] = useState(true);


  // ==========================================
  // Get Transport
  // ==========================================

  const fetchTransport = useCallback(async () => {

    try {

      setLoading(true);

      const response = await api.get(
        `/transports/${transportId}`
      );

      setTransport(
        response.data?.data || response.data
      );

    } catch (error) {

      console.error(
        "Error fetching transport:",
        error
      );

      alert(t("transportDetailsError"));

      navigate("/Transports");

    } finally {

      setLoading(false);

    }

  }, [transportId, navigate, t]);


  // ==========================================
  // Load Transport
  // ==========================================

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTransport();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchTransport]);


  // ==========================================
  // Loading
  // ==========================================

  if (loading) {

    return (
      <Container
        maxWidth="lg"
        sx={{ py: 8 }}
      >

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
  // No Transport
  // ==========================================

  if (!transport) {

    return (
      <Container
        maxWidth="lg"
        sx={{ py: 8 }}
      >

        <Typography
          variant="h6"
          textAlign="center"
        >
          {t("transportNotFound")}
        </Typography>

      </Container>
    );

  }


  // ==========================================
  // Transport Name
  // ==========================================

  const currentName = isArabic
    ? transport.name_ar || transport.name_en
    : transport.name_en || transport.name_ar;

  const secondName = isArabic
    ? transport.name_en || transport.name_ar
    : transport.name_ar || transport.name_en;


  // ==========================================
  // Description
  // ==========================================

  const description = isArabic
    ? transport.description_ar ||
      transport.description_en
    : transport.description_en ||
      transport.description_ar;


  // ==========================================
  // Transport Type
  // ==========================================

  const typeName = t(
    `transportTypes.${transport.type}`,
    {
      defaultValue: transport.type,
    }
  );


  // ==========================================
  // Transport Icon
  // ==========================================

  const getTransportIcon = () => {

    if (
      transport.type === "bus" ||
      transport.type === "minibus"
    ) {
      return <DirectionsBusIcon />;
    }

    if (transport.type === "car") {
      return <DirectionsCarIcon />;
    }

    if (transport.type === "airplane") {
      return <FlightIcon />;
    }

    if (transport.type === "boat") {
      return <DirectionsBoatIcon />;
    }

    if (transport.type === "train") {
      return <TrainIcon />;
    }

    return <DirectionsBusIcon />;

  };


  return (

    <Container
      maxWidth="lg"
      sx={{
        py: 5,

        direction: isArabic
          ? "rtl"
          : "ltr",
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
            navigate("/Transports")
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
              justifyContent: isArabic
                ? "flex-start"
                : "flex-end",
              gap: 1,
            }}
          >

            {/* Transport Icon */}

            <Box
              sx={{
                color: "#4286ae",
                display: "flex",
              }}
            >
              {getTransportIcon()}
            </Box>


            <Typography
              variant="h4"
              fontWeight="bold"
            >
              {t("transportDetails")}
            </Typography>

          </Box>


          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            {t("transportDetailsDescription")}
          </Typography>

        </Box>

      </Box>


      {/* ======================================
          Main Card
      ====================================== */}

      <Card
        sx={{
          marginBlock: 5,
          borderRadius: 4,
          overflow: "hidden",
          boxShadow:
            "0 6px 25px rgba(0,0,0,0.08)",
        }}
      >

        {/* ====================================
            Top Section
        ==================================== */}

        <Box
          sx={{
            position: "relative",
            minHeight: 230,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            background:
              "linear-gradient(135deg, #6ea3dc, #4286ae)",
          }}
        >

          {/* Big Icon */}

          <Box
            sx={{
              width: 120,
              height: 120,

              borderRadius: "50%",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              backgroundColor:
                "rgba(255,255,255,0.2)",

              color: "white",
            }}
          >

            {React.cloneElement(
              getTransportIcon(),
              {
                sx: {
                  fontSize: 75,
                },
              }
            )}

          </Box>


          {/* Status */}

          <Box
            sx={{
              position: "absolute",
              top: 20,
              left: 20,
            }}
          >

            {transport.is_active ? (

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

          {/* ====================================
              Transport Names
          ==================================== */}

          <Box
            sx={{
              textAlign: isArabic
                ? "right"
                : "left",

              mb: 4,
            }}
          >

            {/* Current Language */}

            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                mb: 1,
              }}
            >
              {currentName}
            </Typography>


            {/* Second Language */}

            <Typography
              variant="h6"
              color="text.secondary"
              dir={
                isArabic
                  ? "ltr"
                  : "rtl"
              }
            >
              {secondName}
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

            {/* Transport Type */}

            <InfoCard
              icon={getTransportIcon()}
              title={t("transportType")}
              value={typeName}
            />


            {/* Capacity */}

            <InfoCard
              icon={<PeopleIcon />}
              title={t("capacity")}
              value={`${transport.capacity} ${t(
                "passengers"
              )}`}
            />


            {/* Price */}

            <InfoCard
              icon={<PaymentsIcon />}
              title={t("pricePerTrip")}
              value={`${Number(
                transport.price_per_trip
              ).toLocaleString()} ${
                transport.currency
              }`}
              dir="ltr"
            />


            {/* Company */}

            <InfoCard
              icon={<BusinessIcon />}
              title={t("companyName")}
              value={
                transport.company_name
              }
            />


            {/* Phone */}

            <InfoCard
              icon={<PhoneIcon />}
              title={t("contactPhone")}
              value={
                transport.contact_phone
              }
              dir="ltr"
            />


            {/* ID */}

            <InfoCard
              icon={<PublicIcon />}
              title={t("id")}
              value={transport.id}
              dir="ltr"
            />

          </Box>


          {/* ====================================
              Description
          ==================================== */}

          <Box sx={{ mt: 5 }}>

            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 2 }}
            >
              {t("description")}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                lineHeight: 1.9,
              }}
            >
              {description || "-"}
            </Typography>

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

            {/* Edit */}

            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() =>
                navigate(
                  `/Transports/EditTransport/${transport.id}`
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

    </Container>
  );
}


// ==========================================
// Information Card
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

        backgroundColor:
          "background.default",

        border: "1px solid",

        borderColor: "divider",
      }}
    >

      {/* Icon + Title */}

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


      {/* Value */}

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