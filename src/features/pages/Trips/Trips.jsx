import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Button, Card, Chip, CircularProgress, Grid, IconButton,
  InputAdornment, MenuItem, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography,
  Pagination, Alert, Snackbar, Tooltip
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from "@mui/icons-material/Visibility";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InboxIcon from '@mui/icons-material/Inbox';

import { Link, useLocation  } from "react-router-dom";
import api from "../../../api/refreshToken";
import { useTranslation } from "react-i18next";
import DeleteButton from "../../../components/UI/DeleteButton";

export default function TripsTable() {
  const theme = useTheme();
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const [trips, setTrips] = useState([]); //تخزين البيانات التي تتغير داخل الصفحة.
  const [categoriesList, setCategoriesList] = useState([]);  //
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
  const [snackbar, setSnackbar] = useState({
  open: Boolean(location.state?.message),
  message: location.state?.message || "",
  severity: location.state?.severity || "success",
  });

  const [filters, setFilters] = useState({
    search: "",
    category_id: "", // تم تغييرها من category إلى category_id لتطابق الـ API
    status: "",
    minPrice: "",
    maxPrice: "",
  });

  const statuses = ["published", "draft"];

  // 1. جلب التصنيفات من الـ API ديناميكياً
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategoriesList(res.data.data || res.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // 2. جلب الرحلات مع دعم الـ Pagination
  const loadTrips = useCallback(async (filterValues, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", pagination.limit);
      
      if (filterValues.search) params.append("search", filterValues.search);
      if (filterValues.category_id) params.append("category_id", filterValues.category_id);
      if (filterValues.status) params.append("status", filterValues.status);
      if (filterValues.minPrice) params.append("min_price", filterValues.minPrice);
      if (filterValues.maxPrice) params.append("max_price", filterValues.maxPrice);

      const response = await api.get(`/trips?${params.toString()}`);
      
      const resData = response.data;
      const tripsData = resData.data || resData.trips || resData || [];
      setTrips(Array.isArray(tripsData) ? tripsData : []);

      // حساب عدد الصفحات (يعتمد على هيكلة الـ API الخاص بك)
      const totalPages = resData.totalPages || resData.last_page || Math.ceil((resData.total || 1) / pagination.limit);
      setPagination(prev => ({ ...prev, page: page, totalPages: totalPages || 1 }));

    } catch (err) {
      console.error("Error fetching trips:", err);
      setError(err?.response?.data?.message || err.message || "Fetch error");
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value })); // 
  };

  const applyFilters = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    loadTrips(filters, 1); //  نرسل الفلاتر إلى api    , ونرجع للصفحة الأولى.
  };

  const resetFilters = () => {
    const emptyFilters = { search: "", category_id: "", status: "", minPrice: "", maxPrice: "" };
    setFilters(emptyFilters); // عيد جميع الفلاتر إلى الوضع الفارغ.
    setPagination(prev => ({ ...prev, page: 1 }));
    loadTrips(emptyFilters, 1);
  };

  const handlePageChange = (event, value) => {
    loadTrips(filters, value);
  };
  // لون Status 
  const getStatusColor = (status) => {
    switch (status) {
      case "published": return "success"; // اجعل اللون اخضر  published  اذا كانت 
      case "draft": return "default";  
      default: return "default";
    }
  };

useEffect(() => {
  const initData = async () => {
    await fetchCategories();
    await loadTrips(filters, 1);
  };
  initData();
}, []);

  // trips.length === 0   اذا ما كان في رحلات 
  if (loading && trips.length === 0) {
    return (
      <Box  sx={{justifyContent:"center" ,  display:"flex"}}     mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}> 
      
      {/* Header */}
      <Box
      
        sx={{  display:"flex",justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 , mb: 3,}}
      >
        <Typography variant="h4" fontWeight="bold">
          {t("tripsManagement")}
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/Trips/CreateTrip"
          sx={{ borderRadius: 3, px: 3 }}
        >
          {t("addTrip")}
        </Button>
      </Box>

      {/* واجهة الفلاتر */}
      <Card sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterAltIcon /> {t("filterTrips")}
        </Typography>
        <Grid container spacing={2} sx={{ alignItems: "center" }}>
          <Grid  xs={12} md={4}>
            <TextField
            fullWidth
            name="search"
            label={t("searchTrip")}
            value={filters.search}
            onChange={handleFilterChange}
             slotProps={{  // يعني ضع Search Icon داخل TextField.
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
            <TextField 
              select 
              fullWidth 
              name="category_id" 
              label={t("category")} 
              value={filters.category_id} 
              onChange={handleFilterChange}
            >
              <MenuItem value="">{t("all")}</MenuItem>
              {categoriesList.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {i18n.language === "ar" ? cat.name_ar : cat.name_en}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid  xs={12} md={2}>
            <TextField 
              select 
              fullWidth 
              name="status" 
              label={t("status")} 
              value={filters.status} 
              onChange={handleFilterChange}
            >
              <MenuItem value="">{t("all")}</MenuItem>
              {statuses.map((s) => (
                <MenuItem key={s} value={s}>{t(s)}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid  xs={6} md={2}>
            <TextField fullWidth type="number" name="minPrice" label={t("minPrice")} value={filters.minPrice} onChange={handleFilterChange} />
          </Grid>

          <Grid  xs={6} md={2}>
            <TextField fullWidth type="number" name="maxPrice" label={t("maxPrice")} value={filters.maxPrice} onChange={handleFilterChange} />
          </Grid>

          <Grid  xs={12}>
            <Box display="flex" gap={2} mt={1}>
              <Button variant="contained" startIcon={<FilterAltIcon />} onClick={applyFilters}>
                {t("applyFilters")}
              </Button>
              <Button variant="outlined" onClick={resetFilters}>
                {t("reset")}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* رسالة الخطأ */}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* الجدول */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        {trips.length === 0 && !loading ? (
          <Box sx={{ p: 5, textAlign: 'center' }}>
            <InboxIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">{t("noTripsFound")}</Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.mode === "dark" ? "#2d3033" : "#f5f5f5" }}>
                <TableCell><strong>{t("tripTitle")}</strong></TableCell>
                <TableCell><strong>{t("destination")}</strong></TableCell>
                <TableCell><strong>{t("price")}</strong></TableCell>
                <TableCell><strong>{t("duration")}</strong></TableCell>
                <TableCell><strong>{t("startDate")}</strong></TableCell>
                <TableCell><strong>{t("status")}</strong></TableCell>
                <TableCell align="center"><strong>{t("featured")}</strong></TableCell>
                <TableCell align="center"><strong>{t("actions")}</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {trips.map((trip) => (
                <TableRow key={trip.id} hover>
                  <TableCell>
                    <Typography fontWeight="medium">
                      {i18n.language === "ar" ? trip.title_ar || trip.title_en : trip.title_en || trip.title_ar}
                    </Typography>
                  </TableCell>
                
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOnIcon fontSize="small" color="action" />
                     {/* : والا اعرض يلي بعد ال  name_ar العلامة ?. تعني اذا كان موجود اعرض ال  */}
                      {i18n.language === "ar" ? trip.Destination?.name_ar : trip.Destination?.name_en}
                    </Box>
                  </TableCell>

                  <TableCell>  
                    <Typography fontWeight="bold" color="primary"> 
                      {/*  اذا يوجد سعر تخفيضي اعرضه واذا لم يوجد اعرض ال السعر الكلي */}
                      {trip.discount_price || trip.price} {trip.currency}
                    </Typography>
                    {trip.discount_price && (
                      <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                        {trip.price}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarMonthIcon fontSize="small" color="action" />
                      {trip.duration_days} {t("days")}
                    </Box>
                  </TableCell>

                  <TableCell>{trip.start_date || "-"}</TableCell>
                 
                  <TableCell>
                    <Chip label={t(trip.status)} color={getStatusColor(trip.status)} size="small" variant="outlined" />
                  </TableCell>

                  <TableCell align="center">
                    <Tooltip title={trip.is_featured ? t("featuredTrip") : t("normalTrip")}>
                      {trip.is_featured ? <StarIcon sx={{ color: '#ffc107' }} /> : <StarBorderIcon sx={{ color: 'text.disabled' }} />}
                    </Tooltip>
                  </TableCell>

                  <TableCell align="center">
                    <Tooltip title={t("viewDetails")}>
                      <IconButton color="primary" size="small" component={Link} to={`/Trip/${trip.id}`}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title={t("edit")}>
                      <IconButton color="warning" size="small" component={Link} to={`/EditTrip/${trip.id}`}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <DeleteButton
                      endpoint={`/trips/${trip.id}`}
                      itemId={trip.id}
                      onDeleted={() => loadTrips(filters, pagination.page)}
                      confirmationMessage={t("confirmDeleteTrip")}
                      successMessage={t("tripDeleted")}
                      errorMessage={t("tripDeleteError")}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination 
            count={pagination.totalPages} 
            page={pagination.page} 
            onChange={handlePageChange} 
            color="primary" 
            shape="rounded"
          />
        </Box>
      )}

      {/* Snackbar للرسائل */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}