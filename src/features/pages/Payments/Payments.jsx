import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../../api/refreshToken";

// MUI Components
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Tooltip,
} from "@mui/material";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PaymentIcon from "@mui/icons-material/Payment";
import RefreshIcon from "@mui/icons-material/Refresh";
import ReceiptIcon from "@mui/icons-material/Receipt";

export default function Payments() {
  const { t, i18n } = useTranslation();

  // =========================
  // الحالات
  // =========================
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // =========================
  // جلب البيانات عند فتح الصفحة
  // =========================
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await api.get("/bookings?limit=100");
        const data = response.data?.data || [];
        
        // تأكد أن data مصفوفة
        if (Array.isArray(data)) {
          setPayments(data);
        } else {
          setPayments([]);
        }
      } catch (error) {
        console.error("خطأ في جلب المدفوعات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // =========================
  // 🔄 دالة إعادة التحميل
  // =========================
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await api.get("/bookings?limit=100");
      const data = response.data?.data || [];
      if (Array.isArray(data)) {
        setPayments(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // 🔍 الفلترة والبحث
  // =========================
  const filteredPayments = [];

  // نمر على كل حجز واحد تلو الآخر
  for (let i = 0; i < payments.length; i++) {
    const payment = payments[i];

    // 1) استخراج اسم العميل
    let customerName = "";
    if (payment.User) {
      customerName = `${payment.User.first_name} ${payment.User.last_name}`;
    } else if (payment.user) {
      customerName = `${payment.user.first_name} ${payment.user.last_name}`;
    }

    // 2) تحويل للبحث النصي (حروف صغيرة)
    const searchLower = search.toLowerCase();
    const customerLower = customerName.toLowerCase();
    const bookingRefLower = (payment.booking_ref || "").toLLowerCase();

    // 3) التحقق من تطابق البحث
    const matchesSearch = 
      customerLower.includes(searchLower) || 
      bookingRefLower.includes(searchLower);

    // 4) استخراج حالة الدفع
    const paymentStatus = (payment.payment_status || "unpaid").toLowerCase();

    // 5) التحقق من تطابق الفلتر
    const matchesFilter = 
      statusFilter === "all" || 
      paymentStatus === statusFilter;

    // 6) إذا تحقق الشرطان، نضيفه للنتائج
    if (matchesSearch && matchesFilter) {
      filteredPayments.push(payment);
    }
  }

  // =========================
  // 🧮 حساب الإحصائيات (بـ for loop بسيط)
  // =========================
  let totalPayments = filteredPayments.length;
  let paidCount = 0;
  let unpaidCount = 0;
  let totalAmount = 0;

  for (let i = 0; i < filteredPayments.length; i++) {
    const p = filteredPayments[i];
    const status = (p.payment_status || "unpaid").toLowerCase();
    const amount = parseFloat(p.total_price || p.total_amount || 0);

    if (status === "paid") {
      paidCount++;
      totalAmount = totalAmount + amount;
    } else if (status === "unpaid") {
      unpaidCount++;
    }
  }

  // =========================
  // 🎨 دوال مساعدة بسيطة
  // =========================
  
  // تحديد لون الشارة حسب الحالة
  const getPaymentStatusColor = (status) => {
    if (status === "paid") return "success";      // أخضر
    if (status === "unpaid") return "warning";    // أصفر
    if (status === "refunded") return "info";     // أزرق
    if (status === "failed") return "error";      // أحمر
    return "default";
  };

  // نص الحالة بالعربية
  const getPaymentStatusLabel = (status) => {
    if (status === "paid") return t("paid") || "مدفوع";
    if (status === "unpaid") return t("unpaid") || "غير مدفوع";
    if (status === "refunded") return t("refunded") || "مسترد";
    if (status === "failed") return t("failed") || "فشل";
    return status;
  };

  // تنسيق التاريخ
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    
    const date = new Date(dateStr);
    const lang = i18n.language === "ar" ? "ar-SY" : "en-US";
    
    return date.toLocaleDateString(lang, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // =========================
  // 🎨 حالة التحميل
  // =========================
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  // =========================
  // 🎨 الواجهة الرئيسية
  // =========================
  return (
    <Box component="main" sx={{ p: 3, maxWidth: 1400, mx: "auto" }}>
      
      {/* ===== الهيدر ===== */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
            <PaymentIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h4" fontWeight="bold">
              {t("paymentsManagement") || "إدارة المدفوعات"}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {t("paymentsSubtitle") || "متابعة جميع عمليات الدفع والمعاملات المالية"}
          </Typography>
        </Box>

        <Tooltip title={t("refresh") || "تحديث"}>
          <IconButton onClick={handleRefresh} sx={{ bgcolor: "action.hover" }}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* ===== فلاتر البحث ===== */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          border: "1px solid #e5e7eb",
        }}
      >
        <Grid container spacing={2}>
          <Grid xs={12} md={8}>
            <TextField
              fullWidth
              size="small"
              placeholder={t("searchPayments") || "ابحث برقم المرجع أو اسم العميل..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: { "aria-label": t("searchPayments") || "ابحث برقم المرجع أو اسم العميل..." },
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
              }}
            />
          </Grid>

          <Grid xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>{t("filterByStatus") || "تصفية حسب الحالة"}</InputLabel>
              <Select
                value={statusFilter}
                label={t("filterByStatus") || "تصفية حسب الحالة"}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">{t("all") || "الكل"}</MenuItem>
                <MenuItem value="paid">{t("paid") || "مدفوع"}</MenuItem>
                <MenuItem value="unpaid">{t("unpaid") || "غير مدفوع"}</MenuItem>
                <MenuItem value="refunded">{t("refunded") || "مسترد"}</MenuItem>
                <MenuItem value="failed">{t("failed") || "فشل"}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* ===== جدول المدفوعات ===== */}
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 3, boxShadow: 2, border: "1px solid #e5e7eb" }}
      >
        <Table >
          <TableHead >
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" ,textAlign:"center"}}>
                {t("referenceNumber") || "الرقم المرجعي"}
              </TableCell>
              <TableCell sx={{ fontWeight: "bold",textAlign:"center"}}>
                {t("customer") || "العميل"}
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" , textAlign:"center"}}>
                {t("service") || "الخدمة"}
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" , textAlign:"center"}} align="right">
                {t("amount") || "المبلغ"}
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" , textAlign:"center" }}>
                {t("paymentStatus") || "حالة الدفع"}
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" , textAlign:"center"}}>
                {t("date") || "التاريخ"}
              </TableCell>
              <TableCell sx={{ fontWeight: "bold"  }} align="center">
                {t("actions") || "الإجراءات" }
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 7 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <ReceiptIcon sx={{ fontSize: 48, color: "text.disabled" }} />
                    <Typography color="text.secondary">
                      {t("noPaymentsFound") || "لا توجد مدفوعات مطابقة"}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              // عرض كل حجز في صف
              filteredPayments.map((payment) => {
                // استخراج البيانات بشكل واضح
                let customerFirstName = "";
                let customerLastName = "";
                let customerEmail = "";

                if (payment.User) {
                  customerFirstName = payment.User.first_name || "";
                  customerLastName = payment.User.last_name || "";
                  customerEmail = payment.User.email || "";
                } else if (payment.user) {
                  customerFirstName = payment.user.first_name || "";
                  customerLastName = payment.user.last_name || "";
                  customerEmail = payment.user.email || "";
                }

                // اسم العميل الكامل
                const fullName = customerFirstName && customerLastName
                  ? `${customerFirstName} ${customerLastName}`
                  : `User #${payment.user_id || "?"}`;

                // المبلغ والعملة
                const amount = parseFloat(payment.total_price || payment.total_amount || 0);
                const currency = payment.currency || "SYP";

                // حالة الدفع
                const paymentStatus = (payment.payment_status || "unpaid").toLowerCase();

                // التاريخ
                const createdAt = payment.created_at || payment.createdAt;

                // نوع الخدمة
                const serviceLabel = payment.bookable_type === "trip"
                  ? (t("trip") || "رحلة")
                  : (t("package") || "باقة");

                const serviceColor = payment.bookable_type === "trip" ? "primary" : "secondary";

                return (
                  <TableRow key={payment.id} hover>
                    {/* الرقم المرجعي */}
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold" sx={{ fontFamily: "monospace", textAlign:"center" }}>
                        {payment.booking_ref || `#${payment.id}`}
                      </Typography>
                    </TableCell>

                    {/* العميل */}
                    <TableCell>
                      <Typography  fontWeight="medium" sx={{ fontFamily: "emoji", textAlign:"center" }}>
                        {fullName}
                      </Typography>
                      <Typography  color="text.secondary" sx={{ fontFamily: "emoji", textAlign:"center" }}>
                        {customerEmail || "-"}
                      </Typography>
                    </TableCell>

                    {/* الخدمة */}
                    <TableCell sx={{  textAlign:"center" }}>
                      <Chip
                        label={serviceLabel}
                        size="small"
                        color={serviceColor}
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "emoji"}}>
                        #{payment.bookable_id}
                      </Typography>
                    </TableCell>

                    {/* المبلغ */}
                    <TableCell align="right" sx={{ textAlign:"center" }}>
                      <Typography  variant="body2" fontWeight="bold" color="success.main">
                        {amount.toLocaleString()} {currency}
                      </Typography>
                    </TableCell>

                    {/* حالة الدفع */}
                    <TableCell sx={{ textAlign:"center" }}>
                      <Chip
                        label={getPaymentStatusLabel(paymentStatus)}
                        color={getPaymentStatusColor(paymentStatus)}
                        size="small"
                        sx={{ fontWeight: "bold", minWidth: 80 }}
                      />
                    </TableCell>

                    {/* التاريخ */}
                    <TableCell sx={{ textAlign:"center" }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(createdAt)}
                      </Typography>
                    </TableCell>

                    {/* الإجراءات */}
                    <TableCell align="center" >
                      <Tooltip title={t("viewDetails") || "عرض التفاصيل"}>
                        <IconButton
                          color="primary"
                          size="small"
                          component={Link}
                          to={`/Payment/${payment.id}`}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ===== إحصائيات سريعة ===== */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          bgcolor: "#f9fafb",
          borderRadius: 2,
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            {t("totalPayments") || "إجمالي المدفوعات"}
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {totalPayments}
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            {t("paidPayments") || "المدفوعات الناجحة"}
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="success.main">
            {paidCount}
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            {t("pendingPayments") || "المدفوعات المعلقة"}
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="warning.main">
            {unpaidCount}
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            {t("totalAmount") || "المبلغ الإجمالي"}
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="primary.main">
            {totalAmount.toLocaleString()} SYP
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}