import React  , {useState  , useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import api from '../../../api/refreshToken';
import ImageGallery from '../../../components/UI/ImageGallery';
import DeleteHotel from './CUD_Hotels/DeletHotel';
import EditHotel from './CUD_Hotels/EditHotel';
import StatCard from '../../../components/UI/StartCard';
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Rating,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  Divider,
  IconButton
} from "@mui/material";

import {
  LocationOn,
  Wifi,
  Pool,
  Spa,
  Restaurant,
  LocalParking,
  Phone,
  Email,
  Hotel,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";


function InfoRow({ title, value }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="text.secondary">
        {title}
      </Typography>

      <Typography fontWeight="medium">
        {value || "-"}
      </Typography>
    </Box>
  );
}



export default function Hotell() {
 const { hotelId } = useParams();
 const [hotel, setHotel] = useState(null);
 const [error, setError] = useState(null);
 const [loading, setLoading] = useState(true);
 const [mainImage, setMainImage] = useState("");
 const theme = useTheme();
 const { i18n, t } = useTranslation();
 const placeholder =
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200";

  // جلب بيانات الفندق، ويعاد استخدام الدالة بعد رفع أو حذف الصور لتحديث المعرض.
  const getHotel = useCallback(async () => {
    try {
      const response = await api.get(`/hotels/${hotelId}`);
      const data = response.data.data || response.data;
      setHotel(data);
      setMainImage(data.images?.[0]?.image_url || data.image || placeholder);
    } catch (err) {
      console.error(err);
      setError("فشل في تحميل بيانات الفندق");
    } finally {
      setLoading(false);
    }
  }, [hotelId]);


  useEffect(() => {
    const loadHotel = async () => {
      await getHotel();
    };

    loadHotel();
  }, [getHotel]);

  if (loading)
    return (
      <Box textalign="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box mt={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  const amenitiesIcons = {
    wifi: <Wifi fontSize="large" />,
    pool: <Pool fontSize="large" />,
    spa: <Spa fontSize="large" />,
    restaurant: <Restaurant fontSize="large" />,
    parking: <LocalParking fontSize="large" />,
  };

  const amenitiesNames = {
    wifi: "واي فاي",
    pool: "مسبح",
    spa: "منتجع للعناية بالجسم",
    restaurant: "مطعم",
    parking: "موقف سيارات",
  };

  // دعم استجابة الفندق التي قد تعيد الصورة داخل images أو داخل image مباشرة.
  const hotelImages = hotel.images?.length
    ? hotel.images
    : hotel.image
      ? [{ image_url: hotel.image }]
      : [];

return (
  <Box sx={{  minHeight: "100vh", py: 4 }}>
    <Box sx={{ maxWidth: 1280, mx: "auto", px: 4 }}>

      {/* ================= Header ================= */}

      <Card
        sx={{
          borderRadius: 4,
          mb: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,.08)"
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2
            }}
          >

            <Box>

              <Typography variant="h3" fontWeight="bold">
                {i18n.language === "ar"
                  ? hotel.name_ar || hotel.name_en
                  : hotel.name_en || hotel.name_ar}
              </Typography>

              <Typography variant="h5" color="text.secondary">
                {i18n.language === "ar"
                  ? hotel.name_en || hotel.name_ar
                  : hotel.name_ar || hotel.name_en}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 1
                }}
              >
                <Rating value={hotel.stars} readOnly />
                <Typography>{hotel.stars}</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 1
                }}
              >
                <LocationOn color="primary" />
                <Typography>
                  {i18n.language === "ar"
                    ? hotel.address_ar || hotel.address_en
                    : hotel.address_en || hotel.address_ar}
                </Typography>
              </Box>

            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>

                  <IconButton color="warning" component={Link}  to={`/EditHotel/${hotelId}`}>
                    <EditIcon />
                  </IconButton>

                <DeleteHotel hotelId={hotelId} onDeleted={() => {
                  window.location.href = "/hotels";
                }} />
          
             

            </Box>

          </Box>
        </CardContent>
      </Card>

      {/* ================= الصور + المعلومات ================= */}

      <Grid container spacing={3}>

        <Grid size={{ xs: 12, md: 7 }}>

          <Card sx={{ borderRadius: 4, overflow: "hidden" }}>

            <Box
              component="img"
              src={mainImage}
              sx={{
                width: "100%",
                height: 420,
                objectFit: "cover"
              }}
            />

            <CardContent>

              <ImageGallery
                images={hotelImages}
                resourcePath="hotels"
                resourceId={hotelId}
                uploadPath={`/hotels/${hotelId}/image`}
                deletePath={`/hotels/${hotelId}/image`}
                fieldName="image"
                multiple={false}
                displayLimit={4}
                onRefresh={getHotel}
                title={t("image")}
              />

            </CardContent>

          </Card>

        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>

          <Card sx={{ borderRadius: 4, overflow: "hidden" }}>

            <CardContent>

              <Typography variant="h5" color="primary" mb={3}>
                {t("hotels")}
              </Typography>
              <Divider sx={{ mb: 3 , mx: 3 }} />

              <StatCard title={t("name")} value={i18n.language === "ar" ? hotel.name_ar : hotel.name_en} />

              <StatCard  title="التصنيف" value={`${hotel.stars} ⭐`} />

              <StatCard 
                title={t("destination")}
                value={i18n.language === "ar"
                  ? hotel.Destination?.name_ar || hotel.Destination?.name_en
                  : hotel.Destination?.name_en || hotel.Destination?.name_ar}
              />

            </CardContent>

          </Card>

        </Grid>

      </Grid>

      {/* ================= المرافق + التواصل + الإحصائيات ================= */}

      <Grid container spacing={3} sx={{ mt: 3 }}>

        <Grid size={{ xs: 12, md: 6 }}>

          <Card sx={{ borderRadius: 4, height: "100%", overflow: "hidden" }}>

            <CardContent>

              <Typography variant="h6" color="primary" mb={3}>
                {t("amenities")}
              </Typography>
               <Divider sx={{ mb: 3 , mx: 3 }} />
              <Grid container spacing={2}>

                {hotel.amenities?.map((item) => (
                  <Grid size={{ xs: 6, sm: 4 }} key={item}>

                    <Box
                      sx={{
                         p: 2,
                          mb: 2,
                          borderRadius: 3,
                          backgroundColor: theme.palette.background.paper,
                          border: `1px solid ${theme.palette.divider}`,
                          boxShadow: theme.shadows[1],
                          textAlign: "center",
                          transition: "all .3s ease",
                      }}
                    >

                      <Box sx={{ color: "primary.main", mb: 1 }}>
                        {amenitiesIcons[item]}
                      </Box>

                      <Typography variant="body2">
                        {amenitiesNames[item]}
                      </Typography>

                    </Box>

                  </Grid>
                ))}

              </Grid>

            </CardContent>

          </Card>

        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>

          <Card sx={{ borderRadius: 4, height: "100%", overflow: "hidden" }}>

            <CardContent>

              <Typography variant="h6" color="primary" mb={3}>
                {t("contact")}
              </Typography>
             <Divider sx={{ mb: 3 , mx: 3 }} />
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  mb: 3
                }}
              >
                <Phone color="primary" />
                <Typography>{hotel.contact_phone}</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center"
                }}
              >
                <Email color="primary" />
                <Typography>{hotel.contact_email}</Typography>
              </Box>

            </CardContent>

          </Card>

        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>

          <Card sx={{ borderRadius: 4, height: "100%" }}>

            <CardContent>

              <Typography variant="h6" color="primary" mb={3}>
                {t("statistics")}
              </Typography>
             <Divider sx={{ mb: 3 , mx: 3 }} />
              <StatCard title="إجمالي الغرف" value={hotel.total_rooms} />

              <StatCard title={t("availableRooms")} value={hotel.available_rooms} />

              <StatCard
                title={t("price")}
                value={`${hotel.price_per_night} ${hotel.currency}`}
              />

            </CardContent>

          </Card>

        </Grid>

      </Grid>

      {/* ================= وصف الفندق ================= */}

      <Card sx={{ borderRadius: 4, mt: 3 }}>

        <CardContent>

          <Typography variant="h6" color="primary" mb={3}>
            {t("description")}
          </Typography>

          <Divider sx={{ mb: 3 , mx: 3 }} />

          <Typography color="text.secondary" lineHeight={2}>
            {i18n.language === "ar"
              ? hotel.description_ar || hotel.description_en
              : hotel.description_en || hotel.description_ar}
          </Typography>

        </CardContent>

      </Card>

      {/* ================= التقييمات ================= */}

      <Card sx={{ borderRadius: 4, mt: 3 }}>

        <CardContent>

          <Typography variant="h6" color="primary" mb={3}>
            {t("reviews")}
          </Typography>

          <Divider sx={{ mb: 3 , mx: 3 }} />

          {[1, 2, 3].map((item) => (
            <Box
              key={item}
              sx={{
                display: "flex",
                gap: 2,
                p: 2,
                mb: 2,
                bgcolor: "#cecbcb34",
                borderRadius: 3
              }}
            >

              <Avatar>أ</Avatar>

              <Box flex={1}>

                <Typography fontWeight="bold">
                  أحمد محمد
                </Typography>

                <Rating value={5} readOnly size="small" />

                <Typography color="text.secondary">
                  إقامة رائعة والخدمة ممتازة.
                </Typography>

              </Box>

            </Box>
          ))}

          <Box sx={{ textAlign: "center" }}>
            <Button>عرض جميع التقييمات</Button>
          </Box>

        </CardContent>

      </Card>

    </Box>
  </Box>
);
}