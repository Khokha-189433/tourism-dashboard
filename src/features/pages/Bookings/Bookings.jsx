import React, { useEffect, useState } from "react";
import api from "../../../api/refreshToken";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ConfirmBooking from "./ConfirmBooking";
import CancelBooking from "./Cancel_Booking";
import {
  Box, Card, Chip, IconButton, TextField, Typography, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, InputAdornment, Pagination, MenuItem, Grid,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleIcon from "@mui/icons-material/People";
import PaymentsIcon from "@mui/icons-material/Payments";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FilterListIcon from '@mui/icons-material/FilterList';

const statusColors = { pending: "warning", confirmed: "success", cancelled: "error" };
const paymentColors = { paid: "success", unpaid: "warning", failed: "error" };

export default function Bookings() {
  const { t, i18n } = useTranslation();

  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // فلتر الحالة
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // ======================================================
  // Get Bookings (مع دعم الـ Pagination والـ Filters)
  // ======================================================
  useEffect(() => {
    let isActive = true; // حماية من الـ Memory Leak

    const getBookings = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", 10);
        if (statusFilter !== "all") params.append("status", statusFilter);

        const response = await api.get(`/bookings?${params.toString()}`);
        
        if (isActive) {
          const resData = response.data;
          setBookings(resData?.data || resData?.bookings || []);
          
          // حساب عدد الصفحات
          const totalItems = resData?.total || resData?.totalItems || (resData?.data?.length || 0);
          setTotalPages(Math.ceil(totalItems / 10) || 1);
        }
      } catch (error) {
        if (isActive) console.error("Error fetching bookings:", error);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    getBookings();

    return () => { isActive = false; };
  }, [page, statusFilter]); // يعيد الجلب عند تغيير الصفحة أو الفلتر

  // ======================================================
  // Helpers & Search
  // ======================================================
  const statusLabel = (status) => t(status) || status;
  const paymentLabel = (status) => t(status) || status;
  
  const getBookableName = (item) => {
    // إذا كان الـ API يعيد العلاقة (Trip أو Package) نعرض الاسم، وإلا نعرض الـ ID
    if (item.bookable_type === "trip" && item.Trip) {
      return i18n.language === "ar" ? item.Trip.title_ar : item.Trip.title_en;
    }
    if (item.bookable_type === "package" && item.Package) {
      return i18n.language === "ar" ? item.Package.title_ar : item.Package.title_en;
    }
    return `${item.bookable_type === "trip" ? t("trip") : t("package")} #${item.bookable_id}`;
  };

  const filteredBookings = bookings.filter((item) => {
    const value = search.toLowerCase().trim();
    if (!value) return true;
    const searchableData = [
      item.booking_ref,
      item.User?.first_name,
      item.User?.last_name,
      item.User?.email,
    ];
    return searchableData.some((field) => String(field || "").toLowerCase().includes(value));
  });

  // ======================================================
  // Statistics (محسوبة بناءً على البيانات الحالية أو الإجمالية)
  // ======================================================
  const statistics = [
    { label: t("totalBookings"), value: bookings.length, icon: CalendarMonthIcon, color: "#4286AE" },
    { label: t("pendingBookings"), value: bookings.filter((i) => i.status === "pending").length, icon: PeopleIcon, color: "#ED9B32" },
    { label: t("confirmedBookings"), value: bookings.filter((i) => i.status === "confirmed").length, icon: CheckCircleIcon, color: "#4CAF50" },
    { label: t("unpaidBookings"), value: bookings.filter((i) => i.payment_status === "unpaid").length, icon: PaymentsIcon, color: "#e7730ecf" },
  ];

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1); // العودة للصفحة الأولى عند تغيير الفلتر
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">{t("bookings")}</Typography>
        <Typography color="text.secondary">{t("manageBookings")}</Typography>
      </Box>

      {/* Statistics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statistics.map((stat) => {
          const Icon = stat.icon;
          return (
            <Grid  xs={12} sm={6} md={3} key={stat.label}>
              <Card sx={{ p: 3, borderRadius: 3, height: "100%" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography color="text.secondary" variant="body2">{stat.label}</Typography>
                    <Typography variant="h4" fontWeight="bold">{stat.value}</Typography>
                  </Box>
                  <Icon sx={{ fontSize: 40, color: stat.color, opacity: 0.8 }} />
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Search + Filters */}
      <Card sx={{ borderRadius: 3, mb: 3, p: 2 }}>
        <Grid container spacing={2}  sx={{alignItems:"center"}}>
          <Grid  xs={12} md={8}>
            <TextField
              fullWidth
              placeholder={t("searchBookings")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
          <Grid  xs={12} md={4}>
            <TextField
              select
              fullWidth
              label={t("filterByStatus")}
              value={statusFilter}
              onChange={handleStatusFilterChange}
              slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterListIcon />
                  </InputAdornment>
                ),
              },
            }}
            >
              <MenuItem value="all">{t("all")}</MenuItem>
              <MenuItem value="pending">{t("pending")}</MenuItem>
              <MenuItem value="confirmed">{t("confirmed")}</MenuItem>
              <MenuItem value="cancelled">{t("cancelled")}</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {/* Table */}
      <Card sx={{ borderRadius: 3 }}>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow sx={{ "& th": { fontWeight: "bold", bgcolor: "background.default", whiteSpace: "nowrap" } }}>
                <TableCell align="center">{t("bookingReference")}</TableCell>
                <TableCell align="center">{t("customer")}</TableCell>
                <TableCell align="center">{t("bookingType")}</TableCell>
                <TableCell align="center">{t("bookingDate")}</TableCell>
                <TableCell align="center">{t("participants")}</TableCell>
                <TableCell align="center">{t("totalPrice")}</TableCell>
                <TableCell align="center">{t("paymentStatus")}</TableCell>
                <TableCell align="center">{t("bookingStatus")}</TableCell>
                <TableCell align="center">{t("actions")}</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((item) => (
                  <TableRow key={item.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                    <TableCell align="center">
                      <Typography fontWeight={600}>{item.booking_ref}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography fontWeight={600}>{item.User?.first_name} {item.User?.last_name}</Typography>
                      <Typography variant="body2" color="text.secondary">{item.User?.email}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={getBookableName(item)} size="small" variant="outlined" color="primary" />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : "-"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">{item.participants}</TableCell>
                    <TableCell align="center">
                      <Typography fontWeight={600}>{item.total_price} {item.currency}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={paymentLabel(item.payment_status)} color={paymentColors[item.payment_status] || "default"} size="small" />
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={statusLabel(item.status)} color={statusColors[item.status] || "default"} size="small" />
                    </TableCell>
                    <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                      <IconButton color="info" component={Link} to={`/Booking/${item.id}`} size="small">
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <ConfirmBooking
                        bookingId={item.id}
                        disabled={item.status !== "pending"}
                        onConfirmed={() => {
                          setBookings((prev) => prev.map((b) => b.id === item.id ? { ...b, status: "confirmed" } : b));
                        }}
                      />
                      <CancelBooking
                        bookingId={item.id}
                        disabled={item.status !== "pending"}
                        onCancelled={() => {
                          setBookings((prev) => prev.map((b) => b.id === item.id ? { ...b, status: "cancelled" } : b));
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography color="text.secondary" sx={{ py: 3 }}>
                      {loading ? t("loading") : t("noBookingsFound")}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange} 
              color="primary" 
              shape="rounded"
            />
          </Box>
        )}
      </Card>
    </Box>
  );
}