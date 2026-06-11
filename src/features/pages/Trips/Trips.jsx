import React from "react";

import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Divider , 
  CircularProgress
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
//////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////


// const trip = [
//   {
//     id: 1,
//     title: "رحلة إلى تدمر",
//     destination: "تدمر",
//     price: 150000 ,
//     currency : "SYP",
//     duration: 3,
//     participants: 25,
//     status: "published",
//   },
//   {
//     id: 2,
//     title: "رحلة إلى دمشق",
//     destination: "دمشق",
//     price: 100000, 
//      currency : "SYP",
//     duration: 2,
//     participants: 15,
//     status: "draft",
//   },
// ];

export default function TripsTable() {
   const theme = useTheme();
   const [trips, setTrips] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
  // لون الحالة
  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "success";

      case "draft":
        return "default";

      default:
        return "default";
    }
  };


  useEffect(() => {
    // الحصول على التوكن من التخزين المحلي
    const adminToken = localStorage.getItem("adminToken");

    const fetchTrips = async () => {
      try {
        // طلب بيانات الرحلات من API عبر بروكسي Vite
        const response = await axios.get(
          "/api/trips?page=1&limit=10",
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );

        console.log('Axios response.data:', response);
        // حفظ البيانات في حالة الرحلات
        setTrips(response.data.data || response.data );
      } catch (fetchError) {
        console.error("Error fetching trips:", fetchError?.response || fetchError);
        // حفظ رسالة الخطأ للعرض
        setError(fetchError?.response?.data?.message || fetchError.message || 'Fetch error');
      } finally {
        // إيقاف حالة التحميل بعد انتهاء الطلب
        setLoading(false);
      }
    };
  
    fetchTrips();
  }, []);

  // عرض مؤشر التحميل أثناء انتظار استجابة السيرفر
  if (loading) {
    return (
      <Box display="flex"  mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifycontent="center" mt={5}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }


  return (
    <Box p={30}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        mb={30}
        sx={{ marginBlockEnd:4}}
      >
        <Typography variant="h4" fontWeight="bold">
          إدارة الرحلات
        </Typography>
        <Divider />
        {/* زر إضافة رحلة */}
        
         <Button
          variant="contained"
          startIcon={<AddIcon />}
            component={Link}
            to="/CreateTrip"
                    
          sx={{
            borderRadius: 3,
            px: 3,
            marginTop:2,
           backgroundColor: theme.palette.mode === "dark" ? "#2d3033" : "#f5f5f5",
           color: theme.palette.mode === "dark" ? "#fff" : "#000",     
          }}
        >
          إضافة رحلة
        </Button>
       
      </Box>

      {/* الجدول */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          backgroundColor:
                  theme.palette.mode === "dark"
                    ? "#1a1d1f"
                    : "#fff",
        }}
      >
        <Table>
          {/* رأس الجدول */}
          <TableHead>
            <TableRow
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "#2d3033"
                    : "#f5f5f5",

              }}
            >
           <TableCell> 	Title_En  </TableCell>
           <TableCell> 	Title_Ar  </TableCell>
              <TableCell>	Price </TableCell>
              <TableCell>Duration_day</TableCell>
 
              <TableCell>status</TableCell>
              <TableCell> Is_featured </TableCell>
              
              <TableCell align="center">
                  Button
              </TableCell>
            </TableRow>
          </TableHead>

          {/* بيانات الجدول */}
          <TableBody>
            {trips.map((trip) => (
              <TableRow key={trip.id} hover>
                <TableCell>
                  {trip.title_en}
                </TableCell>
                <TableCell>
                  {trip.title_ar}
                </TableCell>
                <TableCell>
                 
                   {trip.price}
                   {trip.currency}
                </TableCell>

                 <TableCell>
                   {trip.duration_days} 
                 </TableCell>
                 
                   <TableCell>
                  <Chip
                    label={trip.status}
                    color={getStatusColor(trip.status)}
                    size="small"
                  />
                </TableCell>

                  <TableCell>
                    {trip.is_featured ? "True" : "False"}
                   
                  </TableCell>

               

                {/* الأزرار */}
                <TableCell align="center">
                  <IconButton color="primary">
                    <VisibilityIcon />
                  </IconButton>

                  <IconButton color="warning">
                    <EditIcon />
                  </IconButton>

                  <IconButton color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}