import React, { useCallback, useEffect, useState } from 'react';
import TripGallery from "../Trips/Images/TripGallery";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Divider from '@mui/material/Divider';
import StatCard from '../../../components/UI/StartCard';
import {
  Box, Button, Card, CardContent, Chip, CircularProgress,
  Grid, Stack, Typography,
} from "@mui/material";
import {
  CalendarMonth, Group, LocationOn, MonetizationOn,
  CheckCircle, Cancel, FreeCancellation
} from "@mui/icons-material";

import api from '../../../api/refreshToken';
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const TripDetails = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { i18n, t } = useTranslation();

  const getTrip = useCallback(async () => {
    if (!tripId) {
      setError(t("tripNotFound"));
      setLoading(false);
      return;
    }
    try {
      const response = await api.get(`/trips/${tripId}`);
      setTrip(response.data.data || response.data);
    } catch (error) {
      console.log(error);
      setError(t("errorFetchingTrip"));
    } finally {
      setLoading(false);
    }
  }, [tripId, t]);

  useEffect(() => {
  const loadDestination = async () => {
      await  getTrip();
    };
    loadDestination();
  }, [getTrip]);

  if (loading) return <Box sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", p: 3 }}><Typography color="error" variant="h6">{error}</Typography></Box>;

  //  إصلاح منطق السعر
  const isAr = i18n.language === "ar";
  const hasDiscount = trip?.discount_price && trip?.discount_price < trip?.price;
  const currentPrice = hasDiscount ? trip.discount_price : trip.price;
  const originalPrice = trip.price;

  return (
    <Box sx={{ minHeight: "100vh", py: 4, px: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: 1280, mx: "auto" }}>

        {/* ================= Header ================= */}
        <Card sx={{ borderRadius: 4, mb: 3, boxShadow: "0 6px 18px rgba(0,0,0,.08)", border: "1px solid", borderColor: "divider" }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
              <Box>
                <Typography variant="h3" fontWeight="bold">
                  {isAr ? trip?.title_ar : trip?.title_en}
                </Typography>
                <Typography variant="h5" color="text.secondary">
                  {isAr ? trip?.title_en : trip?.title_ar}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                  {trip?.status && <Chip label={t(trip.status)} color="success" />}
                  {trip?.is_featured && <Chip label={t("featured")} color="warning" />}
                </Box>
              </Box>
              <IconButton color="warning" component={Link} to={`/EditTrip/${trip.id}`}>
                <EditIcon />
              </IconButton>
            </Box>
          </CardContent>
        </Card>

        {/* ================= الصورة + معلومات الرحلة ================= */}
        <Grid container spacing={3}>
          <Grid  xs={12} md={7}>
            <Card sx={{ borderRadius: 4, boxShadow: "0 6px 18px rgba(0,0,0,.08)" }}>
              <Box component="img" src={trip?.images?.[0]?.image_url} sx={{ width: "100%", height: 430, objectFit: "cover", borderRadius: "16px 16px 0 0" }} />
              <CardContent>
                <TripGallery trip={trip} TripId={tripId} getTrip={getTrip} />
              </CardContent>
            </Card>
          </Grid>
      
          <Grid  xs={12} md={5}>
            <Card sx={{ borderRadius: 4, height: "100%", boxShadow: "0 6px 18px rgba(0,0,0,.08)" }}>
              <CardContent>
                <Typography variant="h6" color="primary" mb={3}>{t("tripInfo")}</Typography>
                <Divider sx={{ mb: 3, mx: 3 }} />
                
                <StatCard title={t("category")} value={isAr ? trip?.Category?.name_ar : trip?.Category?.name_en} />
                <StatCard title={t("destination")} value={isAr ? trip?.Destination?.name_ar : trip?.Destination?.name_en} />
                
                {/* ✅ تواريخ الرحلة */}
                <StatCard 
                  title={t("dates")} 
                  value={`${trip?.start_date} → ${trip?.end_date}`} 
                  icon={<CalendarMonth color="primary" />}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* ================= السعر والإحصائيات ================= */}
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid  xs={12} md={8}>
            <Card sx={{ borderRadius: 4, boxShadow: "0 6px 18px rgba(0,0,0,.08)" }}>
              <CardContent>
                <Typography variant="h6" color="primary" mb={3}>{t("bookingDetails")}</Typography>
                <Divider sx={{ mb: 3, mx: 3 }} />
                <Grid container spacing={2}>
                  <Grid  xs={6} md={3}>
                    <StatCard icon={<MonetizationOn color="primary" />} title={t("price")} value={`${currentPrice} ${trip?.currency}`} />
                  </Grid>
                  <Grid  xs={6} md={3}>
                    <StatCard icon={<CalendarMonth color="primary" />} title={t("duration")} value={`${trip?.duration_days} ${t("days")}`} />
                  </Grid>
                  <Grid  xs={6} md={3}>
                    <StatCard icon={<Group color="primary" />} title={t("maxParticipants")} value={trip?.max_participants} />
                  </Grid>
                  <Grid  xs={6} md={3}>
                    <StatCard icon={<LocationOn color="primary" />} title={t("departure")} value={isAr ? trip?.departure_location_ar : trip?.departure_location_en} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid  xs={12} md={4}>
            <Card sx={{ borderRadius: 4, height: "100%", boxShadow: "0 6px 18px rgba(0,0,0,.08)" }}>
              <CardContent>
                <Typography variant="h6" color="primary" mb={3}>{t("currentPrice")}</Typography>
                <Divider sx={{ mb: 3, mx: 3 }} />
                <Box sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 3, textAlign: "center", p: 3 }}>
                  
                  {/* ✅ العرض الصحيح للخصم */}
                  <Typography variant="h3" color="primary" fontWeight="bold">
                    {currentPrice}
                  </Typography>
                  <Typography>{trip?.currency}</Typography>

                  {hasDiscount && (
                    <Typography sx={{ textDecoration: "line-through", color: "text.secondary", mt: 1 }}>
                      {originalPrice} {trip?.currency}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* ================= الوصف والسياسات ================= */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid  xs={12} md={8}>
            <Card sx={{ borderRadius: 4 }}>
              <CardContent>
                <Typography variant="h6" color="primary" mb={3}>{t("description")}</Typography>
                <Divider sx={{ mb: 3, mx: 3 }} />
                <Typography color="text.secondary" sx={{ lineHeight: 2 }}>
                  {isAr ? trip?.description_ar : trip?.description_en}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid  xs={12} md={4}>
             {/* سياسة الإلغاء */}
             <Card sx={{ borderRadius: 4, height: "100%" }}>
               <CardContent>
                 <Typography variant="h6" color="primary" mb={3}>{t("cancellationPolicy")}</Typography>
                 <Divider sx={{ mb: 3, mx: 3 }} />
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                   <FreeCancellation color="success" />
                   <Typography>{isAr ? trip?.cancellation_policy_ar : trip?.cancellation_policy_en}</Typography>
                 </Box>
               </CardContent>
             </Card>
          </Grid>
        </Grid>

        {/* ✅ البرنامج اليومي (Programs) */}
        {trip?.programs && trip.programs.length > 0 && (
          <Card sx={{ borderRadius: 4, mt: 3 }}>
            <CardContent>
              <Typography variant="h6" color="primary" mb={3}>{t("dailyProgram")}</Typography>
              <Divider sx={{ mb: 3, mx: 3 }} />
              <Stack spacing={2}>
                {trip.programs.map((day) => (
                  <Card key={day.day_number} variant="outlined" sx={{ p: 2, borderLeft: '4px solid', borderColor: 'primary.main' }}>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {t("day")} {day.day_number}: {isAr ? day.title_ar : day.title_en}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                      {isAr ? day.description_ar : day.description_en}
                    </Typography>
                    <Stack direction="row" spacing={1}  sx={{flexWrap:"wrap"}}>
                      {day.meals_included?.breakfast && <Chip icon={<CheckCircle />} label={t("breakfast")} size="small" color="success" variant="outlined" />}
                      {day.meals_included?.lunch && <Chip icon={<CheckCircle />} label={t("lunch")} size="small" color="success" variant="outlined" />}
                      {day.meals_included?.dinner && <Chip icon={<CheckCircle />} label={t("dinner")} size="small" color="success" variant="outlined" />}
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </CardContent>
          </Card>
        )}

        {/*  الخدمات المشمولة وغير المشمولة */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid  xs={12} md={6}>
            <Card sx={{ borderRadius: 4, height: "100%" }}>
              <CardContent>
                <Typography variant="h6" color="success.main" mb={2} sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                  <CheckCircle /> {t("includedServices")}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                  {isAr ? trip?.included_services_ar : trip?.included_services_en}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid  xs={12} md={6}>
            <Card sx={{ borderRadius: 4, height: "100%" }}>
              <CardContent>
                <Typography variant="h6" color="error.main" mb={2} sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                  <Cancel /> {t("excludedServices")}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                  {isAr ? trip?.excluded_services_ar : trip?.excluded_services_en}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

      </Box>
    </Box>
  );
};

export default TripDetails;