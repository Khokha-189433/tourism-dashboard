import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from "@mui/icons-material/Visibility";
import Alert from '@mui/material/Alert';
import { deleteTrip } from "./CUDTrip/DeleteTrip";

import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../../api/refreshToken";


const categories = ["تاريخية", "طبيعية", "دينية", "مغامرات"];
const statuses = ["published", "draft"];

export default function TripsTable() {
   const theme = useTheme();
   const [trips, setTrips] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const location = useLocation();
   const navigate = useNavigate();
   const [snackbarOpen, setSnackbarOpen] = useState(Boolean(location.state?.message));
   const [snackbarMessage] = useState(location.state?.message || "");
   const [snackbarSeverity] = useState(location.state?.severity || "success");


  // حالة الفلاتر في الشاشة
   const [filters, setFilters] = useState({
     search: "",
     category: "",
     status: "",
     minPrice: "",
     maxPrice: "",
   });

   const loadTrips = React.useCallback(async (filterValues) => {
     setLoading(true);
     try {
      
       const params = new URLSearchParams();
       params.append("page", 1);
       params.append("limit", 10);
       if (filterValues.search) params.append("search", filterValues.search);
       if (filterValues.category) params.append("category", filterValues.category);
       if (filterValues.status) params.append("status", filterValues.status);
       if (filterValues.minPrice) params.append("min_price", filterValues.minPrice);
       if (filterValues.maxPrice) params.append("max_price", filterValues.maxPrice);

       const response = await api.get(`/trips?${params.toString()}`);
       setTrips(response.data.data || response.data || []);
     } catch (err) {
       console.error("Error fetching trips:", err);
       setError(err?.response?.data?.message || err.message || "Fetch error");
     } finally {
       setLoading(false);
     }
   }, []);

   const handleFilterChange = (e) => {
     const { name, value } = e.target;
     setFilters((prev) => ({ ...prev, [name]: value }));
   };

   const applyFilters = () => {
     loadTrips(filters);
   };

   const resetFilters = () => {
     const emptyFilters = { search: "", category: "", status: "", minPrice: "", maxPrice: "" };
     setFilters(emptyFilters);
     loadTrips(emptyFilters);
   };
   //////////////////////////////////////////////
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

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (location.state?.message) {
      navigate(location.pathname, { replace: true, state: null });
    }

    // تحميل الرحلات عند دخول الصفحة لأول مرة
    const init = async () => {
      await loadTrips({});
    };

    init();
  }, [location.state, location.pathname, navigate, loadTrips]);

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
    ////////////////////////////////////////
    const handleDeleteTrip = async (tripId) => {
  if (!window.confirm("هل أنت متأكد من حذف الرحلة؟")) return;

      try {
        await deleteTrip(tripId);

        await loadTrips(filters);

        alert("تم حذف الرحلة بنجاح");
      } catch (err) {
        console.error(err);
        alert("حدث خطأ أثناء حذف الرحلة");
      }
      };
    ///////////////////////////////////////

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
        {/*  */}





        {/*  */}
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

      {/* واجهة الفلاتر */}
      <Card sx={{ p: 2, mb: 3, borderRadius: 5 , border:'1px solid #b0a3a399' }}>
        <Typography variant="h6" mb={2}>فلترة الرحلات</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              name="search"
              label="ابحث عن رحلة"
              value={filters.search}
              onChange={handleFilterChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
      
          <Grid item xs={12} md={2}>
            <TextField select fullWidth name="category" label="التصنيف" value={filters.category} onChange={handleFilterChange}>
              <MenuItem value="">الكل</MenuItem>
              {categories.map((c) => (<MenuItem key={c} value={c}>{c}</MenuItem>))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField select fullWidth name="status" label="الحالة" value={filters.status} onChange={handleFilterChange}>
              <MenuItem value="">الكل</MenuItem>
              {statuses.map((s) => (<MenuItem key={s} value={s}>{s}</MenuItem>))}
            </TextField>
          </Grid>

          <Grid item xs={6} md={2}>
            <TextField fullWidth type="number" name="minPrice" label="أقل سعر" value={filters.minPrice} onChange={handleFilterChange} />
          </Grid>

          <Grid item xs={6} md={2}>
            <TextField fullWidth type="number" name="maxPrice" label="أعلى سعر" value={filters.maxPrice} onChange={handleFilterChange} />
          </Grid>

          <Grid item xs={12} md={12}>
            <Box display="flex" gap={2} mt={1}>
              <Button variant="contained" startIcon={<FilterAltIcon />} onClick={applyFilters} sx={{margin:2}}>تطبيق الفلاتر</Button>
              <Button variant="outlined" onClick={resetFilters}>إعادة تعيين</Button>
            </Box>
          </Grid>
        </Grid>
      </Card>
        {/* واجهة الفلاتر  نهاية */}

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

               

                {/* ///////////الأزرار ////////////*/}
                <TableCell align="center">       {/*زر دخول الى الرحلة عن طريق   id     */}
               
                  <IconButton color="primary" component={Link} to={`/Trip/${trip.id}`} >
                    <VisibilityIcon />
                  </IconButton>

                  <IconButton color="warning" component={Link}  to={`/EditTrip/${trip.id}`}>
                    <EditIcon />
                  </IconButton>

                  <IconButton color="error"  
                  onClick={() => handleDeleteTrip(trip.id)
                  }>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}