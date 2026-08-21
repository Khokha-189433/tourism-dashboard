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
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from "@mui/icons-material/Visibility";
import Alert from '@mui/material/Alert';
import DeleteButton from "../../../components/UI/DeleteButton";

import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../../api/refreshToken";
import { useTranslation } from "react-i18next";

const categories = ["تاريخية", "طبيعية", "دينية", "مغامرات"];
const statuses = ["published", "draft"];

export default function TripsTable() {
   const theme = useTheme();
  const { i18n, t } = useTranslation();
  const categoryLabels = {
    "تاريخية": "historical",
    "طبيعية": "natural",
    "دينية": "religious",
    "مغامرات": "adventure",
  };
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
    //    لايحظ: إذا لم يتم تمرير أي فلاتر، سيتم تحميل جميع الرحلات
       const response = await api.get(`/trips?${params.toString()}`);
      //  لعرض الرحلات في الجدول
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
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }
    ////////////////////////////////////////
    ///////////////////////////////////////

  return (
    <Box p={30}>
     {/* Header */} 
      <Box
        display="flex"
       
        mb={30}
        sx={{ marginBlockEnd:4, justifyContent: "space-between", alignItems: "center" }}
      >
        <Typography variant="h4" fontWeight="bold">
          {t("trips")}
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
          {t("add")} {t("trips")}
        </Button>
       
      </Box>

      {/* واجهة الفلاتر */}
      <Card sx={{ p: 2, mb: 3, borderRadius: 5 , border:'1px solid #b0a3a399' }}>
        <Typography variant="h6" mb={2}>{t("filterTrips")}</Typography>
        <Grid container spacing={2} sx={{alignItems:"center"}}>
          <Grid  xs={12} md={4}>
            <TextField
              fullWidth
              name="search"
              label={t("searchTrip")}
              value={filters.search}
              onChange={handleFilterChange}
              slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                 ),
                 },
              }}

            />
          </Grid>
      
          <Grid  xs={12} md={2}>
            <TextField select fullWidth name="category" label={t("category")} value={filters.category} onChange={handleFilterChange}>
              <MenuItem value="">{t("all")}</MenuItem>
              {categories.map((c) => (<MenuItem key={c} value={c}>{t(categoryLabels[c])}</MenuItem>))}
            </TextField>
          </Grid>

          <Grid  xs={12} md={2}>
            <TextField select fullWidth name="status" label={t("status")} value={filters.status} onChange={handleFilterChange}>
              <MenuItem value="">{t("all")}</MenuItem>
              {statuses.map((s) => (<MenuItem key={s} value={s}>{t(s)}</MenuItem>))}
            </TextField>
          </Grid>

          <Grid  xs={6} md={2}>
            <TextField fullWidth type="number" name="minPrice" label={t("minPrice")} value={filters.minPrice} onChange={handleFilterChange} />
          </Grid>

          <Grid  xs={6} md={2}>
            <TextField fullWidth type="number" name="maxPrice" label={t("maxPrice")} value={filters.maxPrice} onChange={handleFilterChange} />
          </Grid>

          <Grid  xs={12} md={12}>
            <Box display="flex" gap={2} mt={1}>
              <Button variant="contained" startIcon={<FilterAltIcon />} onClick={applyFilters} sx={{margin:2}}>{t("applyFilters")}</Button>
              <Button variant="outlined" onClick={resetFilters}>{t("reset")}</Button>
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
          
            <TableCell>{t("tripTitle")}</TableCell>
              <TableCell>{t("price")}</TableCell>
              <TableCell>{t("duration")}</TableCell>
 
              <TableCell>{t("status")}</TableCell>
              <TableCell>{t("featured")}</TableCell>
              
              <TableCell align="center">
                  {t("actions")}
              </TableCell>
            </TableRow>
          </TableHead>

          {/* بيانات الجدول */}
          <TableBody>
            {trips.map((trip) => (
              <TableRow key={trip.id} hover>
                <TableCell>
                 {i18n.language === "ar"
                   ? trip.title_ar || trip.title_en
                   : trip.title_en || trip.title_ar}
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
                    label={t(trip.status)}
                    color={getStatusColor(trip.status)}
                    size="small"
                  />
                </TableCell>

                  <TableCell>
                    {trip.is_featured ? t("true") : t("false")}
                   
                  </TableCell>

               

                {/* ///////////الأزرار ////////////*/}
                <TableCell align="center">       {/*زر دخول الى الرحلة عن طريق   id     */}
               
                  <IconButton color="primary" component={Link} to={`/Trip/${trip.id}`} >
                    <VisibilityIcon />
                  </IconButton>

                  <IconButton color="warning" component={Link}  to={`/EditTrip/${trip.id}`}>
                    <EditIcon />
                  </IconButton>

                  <DeleteButton
                    endpoint={`/trips/${trip.id}`}
                    itemId={trip.id}
                    onDeleted={() => loadTrips(filters)}
                    confirmationMessage={t("confirmDeleteTrip")}
                    successMessage={t("tripDeleted")}
                    errorMessage={t("tripDeleteError")}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/*  عرض رسالة لاضافة رحلة  */}
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