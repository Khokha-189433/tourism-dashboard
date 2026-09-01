import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../../api/refreshToken";

// MUI Components
import {
  Box, Typography, Button, Paper, Chip,
  CircularProgress, Avatar, IconButton, Alert, Stack,
  Tabs, Tab, Divider,
} from "@mui/material";

// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PrintIcon from "@mui/icons-material/Print";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import FlightIcon from "@mui/icons-material/Flight";
import InventoryIcon from "@mui/icons-material/Inventory";
import PaymentIcon from "@mui/icons-material/Payment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import PeopleIcon from "@mui/icons-material/People";
import NotesIcon from "@mui/icons-material/Notes";
import GroupIcon from "@mui/icons-material/Group";

// المكونات
import InfoRow from "./Cards/InfoRow";

export default function Payment() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { PaymentId } = useParams();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  // إعدادات SamaPay
  const samaPayConfig = {
    merchantId: "99000721",
    merchantKitId: "mki-test",
    pspId: "PSP_001",
    mpiId: "mpi-test",
    mcc: "3505",
  };

  // جلب البيانات
  useEffect(() => {
    const fetchPayment = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/bookings/${PaymentId}`);
        const data = response.data?.data || response.data;
        setPayment(data);
      } catch (err) {
        console.error("Error:", err);
        setError(err?.response?.data?.message || "فشل جلب تفاصيل الدفع");
      } finally {
        setLoading(false);
      }
    };
    if (PaymentId) fetchPayment();
  }, [PaymentId]);

  // دوال مساعدة
  const getStatusLabel = (status) => {
    const map = {
      confirmed: t("confirmed") || "مؤكد",
      pending: t("pending") || "قيد الانتظار",
      cancelled: t("cancelled") || "ملغي",
      completed: t("completed") || "مكتمل",
      failed: t("failed") || "فشل",
    };
    return map[status?.toLowerCase()] || status;
  };

  const getPaymentStatusLabel = (status) => {
    const map = {
      paid: t("paid") || "مدفوع",
      unpaid: t("unpaid") || "غير مدفوع",
      refunded: t("refunded") || "مسترد",
      failed: t("failed") || "فشل",
    };
    return map[status?.toLowerCase()] || status || "-";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString(
      i18n.language === "ar" ? "ar-SY" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleTimeString(
      i18n.language === "ar" ? "ar-SY" : "en-US",
      { hour: "2-digit", minute: "2-digit" }
    );
  };

  const getDateField = (obj, snakeKey, camelKey) => {
    return obj?.[snakeKey] || obj?.[camelKey] || null;
  };

  // حالات التحميل والخطأ
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !payment) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || t("paymentNotFound") || "عملية الدفع غير موجودة"}
        </Alert>
        <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => navigate("/Payments")}>
          {t("back") || "رجوع"}
        </Button>
      </Box>
    );
  }

  // استخراج البيانات
  const customer = payment.User || payment.user || {};
  const amount = parseFloat(payment.total_price || payment.total_amount || 0);
  const currency = payment.currency || "SYP";
  const createdAt = getDateField(payment, "created_at", "createdAt");
  const updatedAt = getDateField(payment, "updated_at", "updatedAt");
  const confirmedAt = getDateField(payment, "confirmed_at", "confirmedAt");
  const hasPassengers = payment.passenger_details && payment.passenger_details.length > 0;

  return (
    <Box sx={{ p: 3, maxWidth: "94%", mx: "auto" }}>
      
      {/* ===== الهيدر ===== */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={() => navigate("/Payments")} sx={{ bgcolor: "action.hover" }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {t("paymentDetails") || "تفاصيل عملية الدفع"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "monospace" }}>
              {payment.booking_ref || `#${payment.id}`}
            </Typography>
          </Box>
        </Box>

        <Button variant="contained" startIcon={<PrintIcon />} onClick={() => window.print()} sx={{ textTransform: "none" }}>
          {t("downloadReceipt") || "تحميل الإيصال"}
        </Button>
      </Box>

      {/* ===== بطاقة Hero ===== */}
      <Paper
        elevation={0}
        sx={{
          p: 4, mb: 3, borderRadius: 4,
          background:
            payment.status === "confirmed"
              ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
              : payment.status === "pending"
              ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
              : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.1)" }} />

        <Box sx={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              {t("transactionAmount") || "مبلغ المعاملة"}
            </Typography>
            <Typography variant="h3" fontWeight="bold" sx={{ mt: 0.5 }}>
              {amount.toLocaleString()} {currency}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
              <Chip
                label={payment.bookable_type === "trip" ? t("trip") || "رحلة" : t("package") || "باقة"}
                size="small"
                sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white", fontWeight: "bold" }}
              />
              <Chip
                label={`#${payment.bookable_id}`}
                size="small"
                sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white", fontFamily: "monospace" }}
              />
            </Box>
          </Box>

          <Box sx={{ textAlign: "right" }}>
            <Stack direction="column" spacing={1}   sx={{ mt: 1 ,alignItems:"flex-end" }}>
              <Chip
                icon={<CheckCircleIcon />}
                label={getStatusLabel(payment.status)}
                sx={{ bgcolor: "rgba(255,255,255,0.25)", color: "white", fontWeight: "bold", "& .MuiChip-icon": { color: "white" } }}
              />
              {payment.payment_status && (
                <Chip
                  icon={<PaymentIcon />}
                  label={getPaymentStatusLabel(payment.payment_status)}
                  sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white", fontWeight: "bold", "& .MuiChip-icon": { color: "white" } }}
                />
              )}
            </Stack>
            <Typography variant="body2" sx={{ mt: 2, opacity: 0.9 }}>
              {formatDate(createdAt)}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {formatTime(createdAt)}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* ===== التبويبات (بديل البطاقات) ===== */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #e5e7eb", overflow: "hidden" }}>
        
        {/* شريط التبويبات */}
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: "1px solid #e5e7eb",
            bgcolor: "#f9fafb",
            "& .MuiTab-root": {
              fontWeight: "bold",
              fontSize: "0.9rem",
              minHeight: 56,
              textTransform: "none",
            },
            "& .Mui-selected": {
              color: "#3b82f6 !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#3b82f6",
              height: 3,
            },
          }}
        >
          <Tab icon={<PersonIcon />} iconPosition="start" label={t("customerAndService") || "العميل والخدمة"} />
          <Tab icon={<CreditCardIcon />} iconPosition="start" label={t("paymentInfo") || "معلومات الدفع"} />
          <Tab icon={<CalendarTodayIcon />} iconPosition="start" label={t("timingInfo") || "الوقت والملاحظات"} />
          {hasPassengers && (
            <Tab icon={<PeopleIcon />} iconPosition="start" label={`${t("passengers") || "المسافرين"} (${payment.passenger_details.length})`} />
          )}
        </Tabs>

        {/* محتوى التبويبات */}
        <Box sx={{ p: 3 }}>
          
          {/* ===== التبويب 1: العميل والخدمة ===== */}
          {activeTab === 0 && (
            <Box className="anim-fade">
              {/* عنوان فرعي */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <PersonIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  {t("customerInfo") || "معلومات العميل"}
                </Typography>
              </Box>

              <InfoRow icon={<PersonIcon fontSize="small" />} label={t("fullName") || "الاسم الكامل"} value={`${customer.first_name || "-"} ${customer.last_name || ""}`} />
              <InfoRow icon={<EmailIcon fontSize="small" />} label={t("email") || "البريد الإلكتروني"} value={customer.email || "-"} dir="ltr" />
              <InfoRow icon={<PhoneIcon fontSize="small" />} label={t("phone") || "رقم الهاتف"} value={customer.phone || "-"} dir="ltr" />
              <InfoRow icon={<InfoIcon fontSize="small" />} label={t("customerId") || "رقم العميل"} value={`#${customer.id || payment.user_id || "-"}`} dir="ltr" />

              <Divider sx={{ my: 3 }} />

              {/* عنوان فرعي */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                {payment.bookable_type === "trip" ? <FlightIcon color="primary" /> : <InventoryIcon color="primary" />}
                <Typography variant="h6" fontWeight="bold">
                  {t("serviceInfo") || "معلومات الخدمة"}
                </Typography>
              </Box>

              <InfoRow
                icon={payment.bookable_type === "trip" ? <FlightIcon fontSize="small" /> : <InventoryIcon fontSize="small" />}
                label={t("serviceType") || "نوع الخدمة"}
                value={payment.bookable_type === "trip" ? t("trip") || "رحلة" : t("package") || "باقة سياحية"}
              />
              <InfoRow icon={<InfoIcon fontSize="small" />} label={t("serviceId") || "رقم الخدمة"} value={`#${payment.bookable_id}`} dir="ltr" />
              <InfoRow icon={<PaymentIcon fontSize="small" />} label={t("bookingRef") || "رقم الحجز المرجعي"} value={payment.booking_ref || "-"} dir="ltr" highlight />
              <InfoRow icon={<GroupIcon fontSize="small" />} label={t("participants") || "عدد المشاركين"} value={payment.participants || 1} />
              <InfoRow icon={<PaymentIcon fontSize="small" />} label={t("unitPrice") || "سعر الوحدة"} value={`${parseFloat(payment.unit_price || 0).toLocaleString()} ${currency}`} dir="ltr" />
            </Box>
          )}

          {/* ===== التبويب 2: معلومات الدفع ===== */}
          {activeTab === 1 && (
            <Box className="anim-fade">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <CreditCardIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  {t("gatewayInfo") || "معلومات بوابة الدفع (SamaPay)"}
                </Typography>
              </Box>

              <InfoRow icon={<StorefrontIcon fontSize="small" />} label={t("merchantId") || "رقم التاجر"} value={samaPayConfig.merchantId} dir="ltr" />
              <InfoRow icon={<InfoIcon fontSize="small" />} label={t("merchantKitId") || "Merchant Kit ID"} value={samaPayConfig.merchantKitId} dir="ltr" />
              <InfoRow icon={<InfoIcon fontSize="small" />} label="PSP ID" value={samaPayConfig.pspId} dir="ltr" />
              <InfoRow icon={<InfoIcon fontSize="small" />} label="MPI ID" value={samaPayConfig.mpiId} dir="ltr" />
              <InfoRow icon={<InfoIcon fontSize="small" />} label="MCC Code" value={samaPayConfig.mcc} dir="ltr" />
              <InfoRow icon={<InfoIcon fontSize="small" />} label={t("currency") || "العملة"} value={currency} dir="ltr" highlight />

              <Divider sx={{ my: 3 }} />

              {/* ملخص مالي */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <PaymentIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  {t("financialSummary") || "الملخص المالي"}
                </Typography>
              </Box>

              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 2 }}>
                <Box sx={{ p: 2, bgcolor: "#f0fdf4", borderRadius: 2, textAlign: "center" }}>
                  <Typography variant="caption" color="text.secondary">{t("totalAmount") || "المبلغ الإجمالي"}</Typography>
                  <Typography variant="h5" fontWeight="bold" color="#10b981">{amount.toLocaleString()} {currency}</Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: "#eff6ff", borderRadius: 2, textAlign: "center" }}>
                  <Typography variant="caption" color="text.secondary">{t("unitPrice") || "سعر الوحدة"}</Typography>
                  <Typography variant="h5" fontWeight="bold" color="#3b82f6">{parseFloat(payment.unit_price || 0).toLocaleString()} {currency}</Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: "#fef3c7", borderRadius: 2, textAlign: "center" }}>
                  <Typography variant="caption" color="text.secondary">{t("participants") || "المشاركون"}</Typography>
                  <Typography variant="h5" fontWeight="bold" color="#f59e0b">{payment.participants || 1}</Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* ===== التبويب 3: الوقت والملاحظات ===== */}
          {activeTab === 2 && (
            <Box className="anim-fade">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <CalendarTodayIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  {t("timingInfo") || "معلومات الوقت"}
                </Typography>
              </Box>

              <InfoRow icon={<CalendarTodayIcon fontSize="small" />} label={t("createdAt") || "تاريخ الإنشاء"} value={formatDate(createdAt)} />
              <InfoRow icon={<AccessTimeIcon fontSize="small" />} label={t("time") || "الوقت"} value={formatTime(createdAt)} dir="ltr" />
              {confirmedAt && (
                <InfoRow icon={<CheckCircleIcon fontSize="small" />} label={t("confirmedAt") || "تاريخ التأكيد"} value={`${formatDate(confirmedAt)} ${formatTime(confirmedAt)}`} dir="ltr" highlight />
              )}
              {updatedAt && updatedAt !== createdAt && (
                <InfoRow icon={<AccessTimeIcon fontSize="small" />} label={t("lastUpdated") || "آخر تحديث"} value={`${formatDate(updatedAt)} ${formatTime(updatedAt)}`} dir="ltr" />
              )}

              {/* الملاحظات */}
              {payment.notes && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <NotesIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                      {t("notes") || "ملاحظات"}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, bgcolor: "#fef3c7", borderRadius: 2, border: "1px solid #fde68a" }}>
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                      {payment.notes}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          )}

          {/* ===== التبويب 4: المسافرين ===== */}
          {activeTab === 3 && hasPassengers && (
            <Box className="anim-fade">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <PeopleIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  {t("passengers") || "المسافرين"} ({payment.passenger_details.length})
                </Typography>
              </Box>

              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 2 }}>
                {payment.passenger_details.map((passenger, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid #e5e7eb",
                      bgcolor: "#f9fafb",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                      <Avatar sx={{ width: 40, height: 40, bgcolor: "#ec4899", fontWeight: "bold" }}>
                        {index + 1}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {passenger.first_name} {passenger.last_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t("passenger") || "مسافر"} #{index + 1}
                        </Typography>
                      </Box>
                    </Box>
                    {passenger.passport_number && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">🛂 {t("passport") || "جواز السفر"}:</Typography>
                        <Typography variant="body2" fontWeight="bold" dir="ltr">{passenger.passport_number}</Typography>
                      </Box>
                    )}
                    {passenger.national_id && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="caption" color="text.secondary">🆔 {t("nationalId") || "الرقم الوطني"}:</Typography>
                        <Typography variant="body2" fontWeight="bold" dir="ltr">{passenger.national_id}</Typography>
                      </Box>
                    )}
                  </Paper>
                ))}
              </Box>
            </Box>
          )}

        </Box>
      </Paper>

      {/* ===== أزرار الإجراءات ===== */}
      <Paper
        elevation={0}
        sx={{
          mt: 3, p: 3, borderRadius: 3, border: "1px solid #e5e7eb",
          display: "flex", justifyContent: "flex-end", gap: 2, flexWrap: "wrap",
        }}
      >
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate("/Payments")}>
          {t("backToList") || "العودة للقائمة"}
        </Button>

        {payment.status === "pending" && (
          <Button variant="contained" color="error" startIcon={<PaymentIcon />}>
            {t("cancelPayment") || "إلغاء الدفع"}
          </Button>
        )}

        {payment.status === "confirmed" && payment.payment_status === "paid" && (
          <Button variant="contained" color="warning" startIcon={<PaymentIcon />}>
            {t("refund") || "طلب استرداد"}
          </Button>
        )}
      </Paper>
    </Box>
  );
}