import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../../api/refreshToken";

// MUI Components
import {
  Box, Typography, Button, Paper, Grid, TextField,
  ToggleButtonGroup, ToggleButton, CircularProgress, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip,
} from "@mui/material";

// Icons
import AssessmentIcon from "@mui/icons-material/Assessment";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PaidIcon from "@mui/icons-material/Paid";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

// Charts
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell,
} from "recharts";

// ♻️ مكونات موجودة مسبقاً (بدون تكرار)
import StatsCard from "../Dashboard/components/StatsCard";
import CardHeader from "../Dashboard/components/CardHeader";

export default function Reports() {
  const { t, i18n } = useTranslation();

  // =========================
  // الحالات
  // =========================
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // الفلاتر
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [groupBy, setGroupBy] = useState("month");

  // =========================
  // جلب البيانات
  // =========================
 useEffect(() => {
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/bookings"); // ← بدون limit
      const data = res.data?.data || [];
      if (Array.isArray(data)) {
        setBookings(data);
      }
    } catch (err) {
      console.error("Reports Error:", err);
      setError(t("reportsLoadError") || "فشل تحميل بيانات التقارير");
    } finally {
      setLoading(false);
    }
  };
  fetchBookings();
}, [t]);
  // =========================
  // 1️⃣ الفلترة حسب الفترة الزمنية (for loop بسيط)
  // =========================
  const filteredBookings = [];

  for (let i = 0; i < bookings.length; i++) {
    const b = bookings[i];
    const dateStr = b.createdAt 
    if (!dateStr) continue;

    const date = new Date(dateStr);

    // إذا كان تاريخ الحجز قبل "من" → نتجاهله
    if (fromDate) {
      const from = new Date(fromDate);
      if (date < from) continue;
    }

    // إذا كان تاريخ الحجز بعد "إلى" → نتجاهله
    if (toDate) {
      const to = new Date(toDate);
      to.setHours(23, 59, 59);
      if (date > to) continue;
    }

    filteredBookings.push(b);
  }

  // =========================
  // 2️⃣ الملخص المالي
  // =========================
  let totalRevenue = 0;
  let paidCount = 0;
  let totalValue = 0;

  for (let i = 0; i < filteredBookings.length; i++) {
    const b = filteredBookings[i];
    const amount = parseFloat(b.total_price || b.total_amount || 0);
    const status = (b.payment_status || "unpaid").toLowerCase();

    totalValue = totalValue + amount;

    if (status === "paid") {
      totalRevenue = totalRevenue + amount;
      paidCount = paidCount + 1;
    }
  }

  // متوسط قيمة الطلب
  let averageOrder = 0;
  if (filteredBookings.length > 0) {
    averageOrder = Math.round(totalValue / filteredBookings.length);
  }

  // =========================
  // 3️⃣ بيانات الرسم البياني (حسب التجميع)
  // =========================
  const monthNames =
    i18n.language === "ar"
      ? ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const chartData = [];

  for (let i = 0; i < filteredBookings.length; i++) {
    const b = filteredBookings[i];
    const dateStr = b.createdAt || b.created_at;
    if (!dateStr) continue;

    const date = new Date(dateStr);
    const amount = parseFloat(b.total_price || b.total_amount || 0);
    const status = (b.payment_status || "unpaid").toLowerCase();

    // بناء المفتاح والعنوان حسب نوع التجميع
    let key = "";
    let label = "";

    if (groupBy === "month") {
      const m = String(date.getMonth() + 1).padStart(2, "0");
      key = date.getFullYear() + "-" + m;
      label = monthNames[date.getMonth()];
    } else {
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      key = date.getFullYear() + "-" + m + "-" + d;
      label = date.getDate() + "/" + (date.getMonth() + 1);
    }

    // البحث عن المجموعة في المصفوفة
    let group = null;
    for (let j = 0; j < chartData.length; j++) {
      if (chartData[j].key === key) {
        group = chartData[j];
        break;
      }
    }

    // إذا لم توجد → ننشئ مجموعة جديدة
    if (!group) {
      group = { key: key, label: label, revenue: 0, bookings: 0 };
      chartData.push(group);
    }

    group.bookings = group.bookings + 1;
    if (status === "paid") {
      group.revenue = group.revenue + amount;
    }
  }

  // ترتيب المجموعات حسب التاريخ
  chartData.sort(function (a, b) {
    if (a.key < b.key) return -1;
    if (a.key > b.key) return 1;
    return 0;
  });

  // =========================
  // 4️⃣ توزيع الحجوزات (رحلات / باقات)
  // =========================
  let tripsCount = 0;
  let packagesCount = 0;

  for (let i = 0; i < filteredBookings.length; i++) {
    if (filteredBookings[i].bookable_type === "trip") {
      tripsCount = tripsCount + 1;
    } else {
      packagesCount = packagesCount + 1;
    }
  }

  const serviceData = [];
  if (tripsCount > 0) serviceData.push({ name: t("trip") || "رحلة", value: tripsCount, color: "#3b82f6" });
  if (packagesCount > 0) serviceData.push({ name: t("package") || "باقة", value: packagesCount, color: "#8b5cf6" });

  // =========================
  // 5️⃣ تصدير CSV (يدعم العربية في Excel)
  // =========================
  const exportCSV = () => {
    let csv = "Reference,Customer,Amount,Currency,Status,Date\n";

    for (let i = 0; i < filteredBookings.length; i++) {
      const b = filteredBookings[i];
      const customer = b.User || b.user || {};
      const name = (customer.first_name || "") + " " + (customer.last_name || "");
      const amount = parseFloat(b.total_price || b.total_amount || 0);
      const dateStr = b.createdAt || b.created_at || "";

      csv += b.booking_ref + "," + name + "," + amount + "," + (b.currency || "SYP") + "," + (b.payment_status || "unpaid") + "," + dateStr + "\n";
    }

    // \uFEFF = يجعل العربية تظهر بشكل صحيح في Excel
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "payments-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  // =========================
  // 🎨 حالة التحميل
  // =========================
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  // =========================
  // 🎨 الواجهة الرئيسية
  // =========================
  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: "auto" }} className="anim-fade">
      
      {/* ===== الهيدر ===== */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <AssessmentIcon color="primary" sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {t("reportsTitle") || "التقارير"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("reportsSubtitle") || "تحليلات مفصلة للإيرادات والحجوزات"}
            </Typography>
          </Box>
        </Box>

        {/* أزرار التصدير */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportCSV} sx={{ textTransform: "none" }}>
            {t("exportCSV") || "تصدير CSV"}
          </Button>
          <Button variant="contained" startIcon={<PrintIcon />} onClick={() => window.print()} sx={{ textTransform: "none" }}>
            {t("printReport") || "طباعة"}
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* ===== الفلاتر ===== */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: "1px solid #e5e7eb" }} className="anim-fade-up">
        <Grid container spacing={2}   sx={{alignItems:"center"}} >
          <Grid xs={12} sm={4} md={3}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label={t("fromDate") || "من تاريخ"}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>

          <Grid xs={12} sm={4} md={3}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label={t("toDate") || "إلى تاريخ"}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>

          <Grid xs={12} sm={4} md={3}>
            <ToggleButtonGroup
              value={groupBy}
              exclusive
              size="small"
              fullWidth
              onChange={(e, newValue) => {
                if (newValue) setGroupBy(newValue);
              }}
            >
              <ToggleButton value="month">{t("monthly") || "شهري"}</ToggleButton>
              <ToggleButton value="day">{t("daily") || "يومي"}</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Paper>

      {/* ===== بطاقات الملخص ===== */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} sm={6} md={3}>
          <StatsCard
            title={t("revenueInPeriod") || "إيرادات الفترة"}
            value={totalRevenue}
            icon={<AttachMoneyIcon fontSize="large" />}
            color="#10b981"
            delay={0}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatsCard
            title={t("bookingsInPeriod") || "حجوزات الفترة"}
            value={filteredBookings.length}
            icon={<ConfirmationNumberIcon fontSize="large" />}
            color="#3b82f6"
            delay={0.1}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatsCard
            title={t("paidInPeriod") || "مدفوعات ناجحة"}
            value={paidCount}
            icon={<PaidIcon fontSize="large" />}
            color="#8b5cf6"
            delay={0.2}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatsCard
            title={t("averageOrder") || "متوسط قيمة الطلب"}
            value={averageOrder}
            icon={<TrendingUpIcon fontSize="large" />}
            color="#f59e0b"
            delay={0.3}
          />
        </Grid>
      </Grid>

      {/* ===== الرسوم البيانية ===== */}
      <Grid container spacing={3} sx={{ mb: 4  }}>
        {/* 📈 رسم الإيرادات */}
        <Grid xs={12} md={7}>
          <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #e5e7eb", overflow: "hidden" , width: "100%"
          }} className="anim-fade-up">
            <CardHeader
              icon={<AttachMoneyIcon fontSize="small" />}
              color="#10b981"
              title={t("revenueChartTitle") || "الإيرادات حسب الفترة"}
            />
            <Box sx={{ p: 2 , width: "100%" , display: "flex", alignItems: "center", justifyContent: "center" }}>
              {chartData.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 8, textAlign: "center" }}>
                  {t("noReportData") || "لا توجد بيانات للفترة المحددة"}
                </Typography>
              ) : (
                <ResponsiveContainer width="600" height={280}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="label" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="#10b98130" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* 🍩 توزيع الخدمات */}
        <Grid xs={12} md={5}>
          <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #e5e7eb", overflow: "hidden" }} className="anim-fade-up">
            <CardHeader
              icon={<ConfirmationNumberIcon fontSize="small" />}
              color="#3b82f6"
              title={t("servicesDistribution") || "توزيع الحجوزات حسب الخدمة"}
            />
            <Box sx={{ p: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" , gap: 6 }}>
              {serviceData.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 8, width: "100%", textAlign: "center" }}>
                  {t("noReportData") || "لا توجد بيانات للفترة المحددة"}
                </Typography>
              ) : (
                <>
                  <ResponsiveContainer width="59%" height={220}>
                    <PieChart>
                      <Pie data={serviceData} dataKey="value" innerRadius={50} outerRadius={80}  >
                        {serviceData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <Box sx={{ flex: 1 }}>
                    {serviceData.map((item, i) => (
                      <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: item.color }} />
                        <Typography variant="body2">{item.name}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ ml: "auto" }}>
                          {item.value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* ===== جدول حجوزات الفترة ===== */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #e5e7eb", overflow: "hidden" }} className="anim-fade-up">
        <CardHeader
          icon={<AssessmentIcon fontSize="small" />}
          color="#f59e0b"
          title={`${t("periodBookings") || "حجوزات الفترة"} (${filteredBookings.length})`}
        />
        <TableContainer sx={{ maxHeight: 500  }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow >
                <TableCell sx={{ bgcolor:"#c9cacb85", fontWeight: "bold" , width: "25%" , textAlign: "center" , height: 40 }}>{t("referenceNumber") || "الرقم المرجعي"}</TableCell>
                <TableCell sx={{bgcolor:"#c9cacb85",  fontWeight: "bold" , width: "25%" , textAlign: "center" , height: 40}} align="right">{t("amount") || "المبلغ"}</TableCell>
                <TableCell sx={{ bgcolor:"#c9cacb85", fontWeight: "bold" , width: "25%" , textAlign: "center" , height: 40 }}>{t("paymentStatus") || "حالة الدفع"}</TableCell>
                <TableCell sx={{ bgcolor:"#c9cacb85", fontWeight: "bold" , width: "25%" , textAlign: "center" , height: 40 }}>{t("date") || "التاريخ"}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">
                      {t("noReportData") || "لا توجد بيانات للفترة المحددة"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.slice(0, 20).map((b) => {
                  const amount = parseFloat(b.total_price || b.total_amount || 0);
                  const status = (b.payment_status || "unpaid").toLowerCase();
                  const dateStr = b.createdAt || b.created_at;

                  return (
                    <TableRow key={b.id} hover>
                      <TableCell sx={{ fontFamily: "monospace", fontWeight: "bold" ,width: "25%" , textAlign: "center" , height: 40 }}>
                        {b.booking_ref || `#${b.id}`}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold", color: "#059669" ,width: "25%" , textAlign: "center" , height: 40 }}>
                        {amount.toLocaleString()} {b.currency || "SYP"}
                      </TableCell>
                      <TableCell sx={{ width: "25%" , textAlign: "center" , height: 40 }}>
                        <Chip
                          label={status === "paid" ? (t("paid") || "مدفوع") : (t("unpaid") || "غير مدفوع")}
                          color={status === "paid" ? "success" : "warning"}
                          size="small"
                          sx={{ fontWeight: "bold" }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary" , width: "25%" , textAlign: "center" , height: 40 }}>
                        {dateStr ? new Date(dateStr).toLocaleDateString(i18n.language === "ar" ? "ar-SY" : "en-US") : "-"}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}