import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ConfirmBooking from "./ConfirmBooking";
import CancelBooking from "./Cancel_Booking";
import {
  Alert, Box, Button, Card, Chip, CircularProgress, Container,
  Divider, Paper, Stack, Typography, // ✅ تم إضافة Paper هنا
} from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import NotesIcon from "@mui/icons-material/Notes";
import PaymentsIcon from "@mui/icons-material/Payments";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import PrintIcon from "@mui/icons-material/Print";
import LaunchIcon from "@mui/icons-material/Launch";
import api from "../../../api/refreshToken";

export default function Booking() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // Get Booking
  // =====================================================
  const fetchBooking = useCallback(async () => {
    try {
      setError("");
      const res = await api.get(`/bookings/${bookingId}`);
       console.log(res)
   
      setBooking(res.data?.data || res.data);
    } catch (err) {
      setError(err.response?.data?.message || t("bookingFetchError"));
    } finally {
      setLoading(false);
    }
  }, [bookingId, t]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  // =====================================================
  // Helpers
  // =====================================================
  const status = {
    pending: ["warning", t("pending")],
    confirmed: ["success", t("confirmed")],
    cancelled: ["error", t("cancelled")],
  };

  const payment = {
    paid: ["success", t("paid")],
    unpaid: ["warning", t("unpaid")],
    failed: ["error", t("failed")],
  };

  const typeLabel = booking?.bookable_type === "trip" ? t("trip") : booking?.bookable_type === "package" ? t("package") : booking?.bookable_type;

  // 🌟 جلب اسم الرحلة أو الباقة الفعلي
  const getBookableName = () => {
    if (booking?.bookable_type === "trip" && booking?.Trip) {
      return isArabic ? booking.Trip.title_ar : booking.Trip.title_en;
    }
    if (booking?.bookable_type === "package" && booking?.Package) {
      return isArabic ? booking.Package.title_ar : booking.Package.title_en;
    }
    return `${typeLabel} #${booking.bookable_id}`;
  };

  // تواريخ آمنة (تدعم createdAt و created_at)
  const createdDate = booking?.createdAt || booking?.created_at;
  const cancelledDate = booking?.cancelledAt || booking?.cancelled_at;

  // =====================================================
  // Loading & Error States
  // =====================================================
  if (loading) {
    return (
      <Container sx={{ py: 8 }}>
        <Box sx={{ minHeight: 400, display: "grid", placeItems: "center" }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error && !booking) {
    return (
      <Container sx={{ py: 5 }}>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/Bookings")} sx={{ mt: 2 }}>
          {t("back")}
        </Button>
      </Container>
    );
  }

  if (!booking) {
    return (
      <Container sx={{ py: 5 }}>
        <Typography textAlign="center">{t("bookingNotFound")}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5, direction: isArabic ? "rtl" : "ltr" }}>
      
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, gap: 2, flexWrap: "wrap" }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/Bookings")}>
          {t("back")}
        </Button>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ConfirmationNumberIcon color="primary" />
            <Typography variant="h4" fontWeight="bold">
              {t("bookingDetails")}
            </Typography>
          </Box>
          <Chip label={status[booking.status]?.[1] || booking.status} color={status[booking.status]?.[0] || "default"} />
        </Box>

        {/* 🌟 زر الطباعة */}
        <Button variant="outlined" startIcon={<PrintIcon />} onClick={() => window.print()}>
          {t("printInvoice")}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Booking Information */}
      <Section icon={<ConfirmationNumberIcon color="primary" />} title={t("bookingInformation")}>
        <GridInfo>
          <Info title={t("bookingReference")} value={booking.booking_ref} />
          <Info title={t("bookingType")} value={getBookableName()} />
          <Info title={t("participants")} value={booking.participants} />
          <Info title={t("bookingDate")} value={createdDate ? new Date(createdDate).toLocaleDateString(isArabic ? "ar-SY" : "en-US") : "-"} />
        </GridInfo>
        
        {/* 🌟 زر الانتقال لتفاصيل الرحلة */}
        {booking.bookable_type === "trip" && booking.Trip && (
          <Box mt={2}>
            <Button component={Link} to={`/Trip/${booking.bookable_id}`} endIcon={<LaunchIcon />} size="small" variant="text">
              {t("viewTripDetails")}
            </Button>
          </Box>
        )}
      </Section>

      {/* Customer + Payment */}
      <GridInfo columns={2}>
        <Section icon={<PersonIcon color="primary" />} title={t("customerInformation")}>
          <Stack spacing={2}>
            <Info title={t("name")} value={`${booking.User?.first_name || ""} ${booking.User?.last_name || ""}`} />
            <Info title={t("email")} value={booking.User?.email} dir="ltr" />
            <Info title={t("phone")} value={booking.User?.phone} dir="ltr" />
          </Stack>
        </Section>

        <Section icon={<PaymentsIcon color="primary" />} title={t("paymentInformation")}>
          <GridInfo>
            <Info title={t("unitPrice")} value={`${booking.unit_price || '-'} ${booking.currency}`} dir="ltr" />
            <Info title={t("participants")} value={booking.participants} />
            <Info title={t("totalPrice")} value={`${booking.total_price} ${booking.currency}`} dir="ltr" />
            <Box>
              <Typography variant="body2" color="text.secondary" mb={1}>{t("paymentStatus")}</Typography>
              <Chip size="small" label={payment[booking.payment_status]?.[1] || booking.payment_status} color={payment[booking.payment_status]?.[0] || "default"} />
            </Box>
          </GridInfo>
        </Section>
      </GridInfo>

      {/* Passengers */}
      <Section icon={<PeopleIcon color="primary" />} title={t("passengerDetails")}>
        {booking.passenger_details?.length ? (
          <Stack spacing={2}>
            {booking.passenger_details.map((passenger, index) => (
              // ✅ تم استخدام Paper هنا
              <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                <GridInfo columns={3}>
                  <Info title={t("name")} value={passenger.name} />
                  <Info title={t("phone")} value={passenger.phone} dir="ltr" />
                  <Info title={t("idNumber")} value={passenger.id_number} dir="ltr" />
                </GridInfo>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Typography color="text.secondary">{t("noPassengerDetails")}</Typography>
        )}
      </Section>

      {/* Notes */}
      <Section icon={<NotesIcon color="primary" />} title={t("notes")}>
        <Typography color="text.secondary">{booking.notes || t("noNotes")}</Typography>
      </Section>

      {/* Cancellation */}
      {booking.cancellation_reason && (
        <Section icon={<CancelIcon color="error" />} title={t("cancellationInformation")}>
          <Typography color="error.main" fontWeight="bold">{booking.cancellation_reason}</Typography>
          {cancelledDate && (
            <Typography variant="body2" color="text.secondary" mt={1}>
              {t("cancelledAt")}: {new Date(cancelledDate).toLocaleString(isArabic ? "ar-SY" : "en-US")}
            </Typography>
          )}
        </Section>
      )}

      {/* Actions */}
      <Section title={t("bookingActions")}>
        <Box display="flex" gap={3} sx={{ flexWrap: "wrap", alignItems: "center" }}>
          <Box   sx={{display:"flex" , alignItems:"center"}}  gap={1}>
            <ConfirmBooking
              bookingId={bookingId}
              disabled={booking.status !== "pending"}
              onConfirmed={(updatedBooking) => {
                setBooking(updatedBooking || { ...booking, status: "confirmed" });
              }}
            />
            <Typography>{booking.status === "confirmed" ? t("confirmed") : t("confirmBooking")}</Typography>
          </Box>

          <Box  sx={{display:"flex", alignItems:"center"}} gap={1}>
            <CancelBooking
              bookingId={bookingId}
              disabled={booking.status !== "pending"}
              onCancelled={(updatedBooking) => {
                setBooking(updatedBooking || { ...booking, status: "cancelled" });
              }}
            />
            <Typography>{booking.status === "cancelled" ? t("cancelled") : t("cancelBooking")}</Typography>
          </Box>
        </Box>
      </Section>
    </Container>
  );
}

// =====================================================
// Helper Components
// =====================================================

function Section({ icon, title, children }) {
  return (
    <Card sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: "0 4px 18px rgba(0,0,0,0.06)" }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} mb={2}>
        {icon}
        <Typography variant="h6" fontWeight="bold">{title}</Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      {children}
    </Card>
  );
}

function GridInfo({ children, columns = 4 }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: columns > 2 ? "repeat(2, 1fr)" : `repeat(${columns}, 1fr)`,
          md: `repeat(${columns}, 1fr)`,
        },
        gap: 3,
      }}
    >
      {children}
    </Box>
  );
}

function Info({ title, value, dir }) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary">{title}</Typography>
      <Typography fontWeight={600} dir={dir}>{value || "-"}</Typography>
    </Box>
  );
}