import React, { useCallback, useEffect, useState } from 'react';
import TripGallery from "../Trips/Images/TripGallery"

import Divider from '@mui/material/Divider';

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
  <Box
      sx={{
        p: 4,
      }}
    >
    <Box  >   
 <Grid container spacing={2}>
        <Grid size={6}>
         {/* Hero Section */}
        <Card
        sx={{
          borderRadius: 5,
          overflow: "hidden",
          mb: 4,
          position: "relative",
        }}
      >

        {/* صورة الرحلة */}
        <Box

          component="img"
        // إذا الرحلة موجودة
        // وإذا الصور موجودة
        // وإذا يوجد أول صورة  .[0]
        // أعطني رابط الصورة
       
        src={
            trip?.images?.[0]?.image_url   
          }
          sx={{
            width: "100%",
            height: 450,
            objectFit: "cover",
            cursor: "pointer",
            transition: "0.5s",
            "&:hover": { transform: "scale(1.09)" },
                
                 
          }}
        />

        {/* Overlay */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            p: 4,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
            color: "white",
          }}
        >

          
          {/* معلومات  الموجودة في الصورة */}
          <Stack
            direction="row"
            spacing={4}
            mt={3}
          >

            <Stack direction="row" spacing={1}>
              <LocationOn />
              <Typography>
                {trip?.destination?.name_ar}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <CalendarMonth />
              <Typography>
                {trip?.duration_days} أيام
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Group />
              <Typography>
                {trip?.max_participants} مشارك
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <MonetizationOn />
              <Typography>
                {trip?.price} {trip?.currency}
              </Typography>
            </Stack>

          </Stack>

        </Box>
        
        </Card>
        </Grid>

        {/* ////////////// Description ///////////////////// */}
        
        <Grid size={6}>
           <Card sx={{ borderRadius: "8px ", mb: 3 , height:"66vh"}}>
            <CardContent     
            sx={{
              height: "100%",
              overflowY: "auto",
              boxSizing: "border-box",
             }}>

              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{color:"#7cb8d8" , fontFamily:"math"}}
                mb={3}
              >
               
              <Divider sx={{  padding:2}} > وصف الرحلة </Divider>
              </Typography>
                
               <Divider />

              <Typography
                color="text.secondary"
                lineHeight={2}
                mb={2}
                sx={{marginTop:3}}
                
              >
                {trip?.description_ar}
              </Typography>

              {trip?.description_en && (
                <Typography
                  color="text.secondary"
                  lineHeight={2}
                >
                  {trip.description_en}
                </Typography>
              )}

            </CardContent>
          </Card>
        {/* ///////////////////////////////////// */}

        </Grid>

      </Grid>
    </Box>

      {/* ////////////////////////////////////////////// */}

      {/* Main Content */}
      <Grid container spacing={3}>

        {/* Left */}
        <Grid item xs={12} md={7}>
        {/* جدول موجز للحقول المطلوبة */}

        <Card sx={{ m: 1 ,  borderRadius: 5,}}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" mb={1} variant="h4">
              <Divider    sx={{color:"#7cb8d8" , fontFamily:"math" ,  padding:2}}> معلومات  الرحلة  </Divider>
              </Typography>
             
              <Table size="medium" 
              sx={{ 
                  m: 1  ,
                  boxShadow:2,
                  borderRadius: 3,
                  width:1000
                 }}>
                <TableBody >
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: 180 }}>Title (EN)</TableCell>
                    <TableCell>{trip?.title_en || '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: 180 }}>Title (AR)</TableCell>
                    <TableCell>{trip?.title_ar || '-'}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Short Description (AR)</TableCell>
                    <TableCell>{trip?.short_description_ar || '-'}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Short Description (EN)</TableCell>
                    <TableCell>{trip?.short_description_en || '-'}</TableCell>
                  </TableRow>

                 <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>status</TableCell>
                  <TableCell>{trip?.status && (
                   <Chip
                   label={trip.status}
                   color="success" />
                   )}</TableCell>
                 </TableRow>

                  <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>status</TableCell>
                  <TableCell>{trip?.is_featured && (
                  <Chip
                  label="Featured"
                  color="warning"  />
                  )}</TableCell>
                   {/* ///////////////////////////////// */}
                   </TableRow>

                  
                </TableBody>
              </Table>
            </CardContent>
        </Card>
        </Grid>

        {/* Right */}
        <Grid item sx={{ borderRadius: 5, mb: 3 }}>
          {/* معرض الصور */}
          <CardContent   >
              <TripGallery
                trip={trip}
                TripId={tripId}
                getTrip={getTrip}
                />
            </CardContent>
        </Grid>

      </Grid>
    </Box>
  );
};

export default TripDetails;