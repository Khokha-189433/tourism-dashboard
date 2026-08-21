import React, { useCallback, useEffect, useState } from 'react';
import TripGallery from "../Trips/Images/TripGallery"
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Divider from '@mui/material/Divider';
import StatCard from '../../../components/UI/StartCard';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Grid,
  Stack,
  Typography,
  
} from "@mui/material";
 // icons
import {
  CalendarMonth,
  Group,
  LocationOn,
  MonetizationOn,
  Upload,
} from "@mui/icons-material";

import api from '../../../api/refreshToken';
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
const TripDetails = () => {
  
    //   // GET rip ID FROM LOCATION
//   // ======================================================================

  // نستقبل البيانات القادمة من الصفحة السابقة
 // const location = useLocation();  

  // TripId القادم من navigate أو من حالة الرابط
  // const TripId = location.state?.TripId || location.state?.UserId || location.state?.tripId || location.state?.id;

 //  جلب tripId
  const { tripId } = useParams();
  // State لتخزين بيانات الرحلة
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState(null);

  // loading
  const [loading, setLoading] = useState(true);
  const { i18n, t } = useTranslation();

  // جلب بيانات الرحلة
  const getTrip = useCallback(async () => {
  
    if (!tripId) {
      setError("رقم الرحلة غير موجود");
      setLoading(false);
      return;
    }
   
    try {
      const response = await api.get(
        `/trips/${tripId}`
      );
      console.log(response.data);

      setTrip(response.data.data || response.data);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  // تحميل البيانات عند فتح الصفحة
  useEffect(() => {
    const loadData = async () => {
      await getTrip();
    };

    loadData();
  }, [getTrip]);



  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
        }}
      >
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

return (
  <Box sx={{ minHeight: "100vh", py: 4 , padding:4 }}>
    <Box sx={{ maxWidth: 1280, mx: "auto", padding:4 }}>

      {/* ================= Header ================= */}

      <Card
        sx={{
          borderRadius: 4,
          mb: 3,
          boxShadow: "0 6px 18px rgba(0,0,0,.08)",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="h3" fontWeight="bold">
                {i18n.language === "ar" ? trip?.title_ar || trip?.title_en : trip?.title_en || trip?.title_ar}
              </Typography>

              <Typography variant="h5" color="text.secondary">
                {i18n.language === "ar" ? trip?.title_en || trip?.title_ar : trip?.title_ar || trip?.title_en}
              </Typography>

              <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                {trip?.status && (
                  <Chip label={trip.status} color="success" />
                )}

                {trip?.is_featured && (
                  <Chip label={t("featured")} color="warning" />
                )}
              </Box>
            </Box>

            <IconButton color="warning" component={Link}  to={`/EditTrip/${trip.id}`}>
                    تعديل
                    <EditIcon />
            </IconButton>
          
          </Box>
        </CardContent>
      </Card>

      {/* ================= الصورة + معلومات الرحلة ================= */}

      <Grid container spacing={3}>

        <Grid size={{ xs: 12, md: 7 }}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: "0 6px 18px rgba(0,0,0,.08)",
            }}
          >
            <Box
              component="img"
              src={trip?.images?.[0]?.image_url}
              sx={{
                width: "100%",
                height: 430,
                objectFit: "cover",
                borderRadius: "16px 16px 0 0",
              }}
            />

            <CardContent>
              <TripGallery trip={trip} TripId={tripId} getTrip={getTrip} />
            </CardContent>
          </Card>
        </Grid>
    
        <Grid size={{ xs: 12, md: 5 }}>
          <Card
            sx={{
              borderRadius: 4,
              height: "100%",
              boxShadow: "0 6px 18px rgba(0,0,0,.08)",
            }}
          >
            <CardContent>

              <Typography variant="h6" color="primary" mb={3}>
                {t("trips")}
              </Typography>
              <Divider sx={{ mb: 3 , mx: 3 }} />
              <StatCard title={t("name")} value={i18n.language === "ar" ? trip?.title_ar : trip?.title_en} />

              <StatCard
                title={t("description")}
                value={i18n.language === "ar" ? trip?.short_description_ar : trip?.short_description_en}
              />

              <StatCard
                title="الفئة"
                value={i18n.language === "ar" ? trip?.Category?.name_ar || trip?.Category?.name_en : trip?.Category?.name_en || trip?.Category?.name_ar}
              />

              <StatCard
                title="الوجهة"
                value={i18n.language === "ar" ? trip?.Destination?.name_ar || trip?.Destination?.name_en : trip?.Destination?.name_en || trip?.Destination?.name_ar}
              />

            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* ================= السعر والإحصائيات ================= */}

      <Grid container spacing={3} sx={{ mt: 4 }}>

        <Grid size={{ xs: 12, md: 8  }}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: "0 6px 18px rgba(0,0,0,.08)",
            }}
          >
            <CardContent>

              <Typography variant="h6" color="primary" mb={3}>
                تفاصيل الحجز
              </Typography>
           <Divider sx={{ mb: 3 , mx: 3 }} />
              <Grid container spacing={2}>

                <Grid size={{ xs: 6, md: 3 }}>
                  <StatCard
                    icon={<MonetizationOn color="primary" />}
                    title="السعر"
                    value={`${trip?.price} ${trip?.currency}`}
                  />
                </Grid>

                <Grid size={{ xs: 6, md: 3 }}>
                  <StatCard
                    icon={<CalendarMonth color="primary" />}
                    title="المدة"
                    value={`${trip?.duration_days} أيام`}
                  />
                </Grid>

                <Grid size={{ xs: 6, md: 3 }}>
                  <StatCard
                    icon={<Group color="primary" />}
                    title="المشاركون"
                    value={trip?.max_participants}
                  />
                </Grid>

                <Grid size={{ xs: 6, md: 3 }}>
                  <StatCard
                    icon={<LocationOn color="primary" />}
                    title="الانطلاق"
                    value={trip?.departure_location_ar}
                  />
                </Grid>

              </Grid>

            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              borderRadius: 4,
              height: "100%",
              boxShadow: "0 6px 18px rgba(0,0,0,.08)",
            }}
          >
            <CardContent>

              <Typography variant="h6" color="primary" mb={3}>
                السعر الحالي
              </Typography>
             <Divider sx={{ mb: 3 , mx: 3 }} />
              <Box
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                  textAlign: "center",
                  p: 3,
                }}
              >
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {trip?.price}
                </Typography>

                <Typography>{trip?.currency}</Typography>

                {trip?.discount_price && (
                  <Typography
                    sx={{
                      textDecoration: "line-through",
                      color: "text.secondary",
                      mt: 1,
                    }}
                  >
                    {trip.discount_price}
                  </Typography>
                )}
              </Box>

            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* ================= وصف الرحلة ================= */}

      <Card sx={{ borderRadius: 4, mt: 3 }}>
        <CardContent>
       
          <Typography variant="h6" color="primary" mb={3}>
            {t("description")}
          </Typography>
          <Divider sx={{ mb: 3 , mx: 3 }} />
          <Typography color="text.secondary"  sx={{ lineHeight: 2 }}>
            {i18n.language === "ar" ? trip?.description_ar || trip?.description_en : trip?.description_en || trip?.description_ar}
          </Typography>


        </CardContent>
      </Card>



    </Box>
  </Box>
);
};

export default TripDetails;


