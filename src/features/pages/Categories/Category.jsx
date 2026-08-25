import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/refreshToken";
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
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
import TerrainIcon from "@mui/icons-material/Terrain";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import MuseumIcon from "@mui/icons-material/Museum";
import ForestIcon from "@mui/icons-material/Forest";

export default function Category() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const response = await api.get(`/categories/${categoryId}`);
        setCategory(response.data.data || response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getCategory();
  }, [categoryId]);

  const getIcon = (icon) => {
    switch (icon) {
      case "mountain":
        return <TerrainIcon sx={{ fontSize: 60, color: "#4286AE" }} />;
      case "beach":
        return <BeachAccessIcon sx={{ fontSize: 60, color: "#4286AE" }} />;
      case "museum":
        return <MuseumIcon sx={{ fontSize: 60, color: "#4286AE" }} />;
      case "forest":
        return <ForestIcon sx={{ fontSize: 60, color: "#4286AE" }} />;
      default:
        return <TerrainIcon sx={{ fontSize: 60, color: "#4286AE" }} />;
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 6 }}>
        <Box     sx={{display :"flex"  , justifyContent : "center"}}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!category) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography>{t("categoryNotFound")}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
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

        <Typography variant="h4" fontWeight="bold">
          {t("category")}
        </Typography>
      </Box>

      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Icon */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 110,
                height: 110,
                borderRadius: "50%",
                bgcolor: "#E8F3FB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {getIcon(category.icon)}
            </Box>
          </Box>

          {/* Names */}

          <Typography variant="h5" fontWeight="bold"   sx={{ textAlign :"center"}}>
            {category.name_ar}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            
            sx={{ mb: 3  , textAlign :"center"}}
          >
            {category.name_en}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* Information */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 3,
            }}
          >
            <InfoCard
              title={t("categoryNameArabic")}
              value={category.name_ar}
            />

            <InfoCard
              title={t("categoryNameEnglish")}
              value={category.name_en}
              dir="ltr"
            />

            <InfoCard
              title={t("descriptionArabic")}
              value={category.description_ar}
            />

            <InfoCard
              title={t("descriptionEnglish")}
              value={category.description_en}
              dir="ltr"
            />

            <InfoCard title={t("icon")} value={category.icon} dir="ltr" />

            <InfoCard
              title={t("sortOrder")}
              value={category.sort_order}
              dir="ltr"
            />
          </Box>

          {/* Status */}

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Chip
              label={category.is_active ? t("active") : t("inactive")}
              color={category.is_active ? "success" : "error"}
            />
          </Box>

          {/* Buttons */}

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              mt: 4,
            }}
          >
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              component={Link}
              to={`/Categories/EditCategory/${category.id}`}
              sx={{ borderRadius: 3 }}
            >
              {t("edit")}
            </Button>

            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/Categories")}
              sx={{ borderRadius: 3 }}
            >
              {t("back")}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

function InfoCard({ title, value, dir = "rtl" }) {
  return (
    <Box
      sx={{
        p: 2.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        bgcolor: "background.default",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>

      <Typography variant="h6" fontWeight="bold" dir={dir}>
        {value || "-"}
      </Typography>
    </Box>
  );
}