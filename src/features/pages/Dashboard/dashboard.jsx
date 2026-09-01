import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../contexts/AuthContext";
import api from "../../../api/refreshToken";
import PaymentsOverview from "./components/PaymentsOverview";
import PaymentIcon from "@mui/icons-material/Payment";
// MUI Components
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Paper,
  Avatar,
  Divider,
  Alert,
} from "@mui/material";

// Icons
import PeopleIcon from "@mui/icons-material/People";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StarIcon from "@mui/icons-material/Star";
import FlightIcon from "@mui/icons-material/Flight";
import InventoryIcon from "@mui/icons-material/Inventory";
import ArticleIcon from "@mui/icons-material/Article";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

// Components
import StatsCard from "./components/StatsCard";
import CardHeader from "./components/CardHeader";
import RecentBookings from "./components/RecentBookings";
import RecentUsers from "./components/RecentUsers";

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);

  // 🎯 تاريخ اليوم لعرضه في قسم الترحيب
  const todayDate = new Date().toLocaleDateString(
    i18n.language === "ar" ? "ar-SY" : "en-US",
    { weekday: "long", day: "numeric", month: "long", year: "numeric" }
  );

  // ======================================================================
  // جلب البيانات
  // ======================================================================
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const dashboardResponse = await api.get("/admin/dashboard");
        const rawData = dashboardResponse.data?.data || dashboardResponse.data;
        setDashboardData(rawData);

        try {
          const usersResponse = await api.get("/admin/users?page=1&limit=5");
          setRecentUsers(usersResponse.data?.data || []);
        } catch (usersErr) {
          console.log("فشل جلب المستخدمين:", usersErr.message);
          setRecentUsers([]);
        }
      } catch (err) {
        console.error("خطأ:", err);
        console.log(error)
        setError(t("dashboardLoadError") || "فشل تحميل بيانات لوحة التحكم.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [t]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  const data = dashboardData || {};
  const statsData = data.stats || {};

  const formattedBookings = (data.recent_bookings || []).map((booking) => ({
    id: booking.id,
    customer: booking.user
      ? `${booking.user.first_name} ${booking.user.last_name}`
      : `${t("user") || "مستخدم"} #${booking.user_id}`,
    trip:
      booking.bookable_type === "trip"
        ? `${t("trip") || "رحلة"} #${booking.bookable_id}`
        : `${t("package") || "باقة"} #${booking.bookable_id}`,
    amount: booking.total_price || booking.total_amount || 0,
    status: booking.status || "pending",
    date: booking.created_at || booking.createdAt
      ? new Date(booking.created_at || booking.createdAt).toLocaleDateString(
          i18n.language === "ar" ? "ar-SY" : "en-US"
        )
      : "-",
  }));

  return (
    <Box sx={{ p: 3,  minHeight: "100vh" }}>
      
      {/* ============================================ */}
      {/* 🎯 قسم الترحيب */}
      {/* ============================================ */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 5,
          borderRadius: 4,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* زخارف الخلفية */}
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.1)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.1)",
          }}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            position: "relative",
            zIndex: 1,
            flexWrap: "wrap",
          }}
        >
          <Avatar
            sx={{
              width: 70,
              height: 70,
              bgcolor: "rgba(255,255,255,0.2)",
              fontSize: "2rem",
            }}
          >
            {user?.first_name?.charAt(0) || "A"}
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
              👋 {t("welcomeBack") || "مرحباً بعودتك"}، {user?.first_name}!
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {t("dashboardSubtitle") || "إليك نظرة عامة على نشاط النظام اليوم"}
            </Typography>
          </Box>

          {/*  تاريخ اليوم */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              gap: 1,
              bgcolor: "rgba(255,255,255,0.15)",
              px: 2,
              py: 1,
              borderRadius: 2,
            }}
          >
            <CalendarTodayIcon fontSize="small" />
            <Typography variant="body2" fontWeight="medium">
              {todayDate}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* ============================================ */}
      {/*  الإحصائيات الرئيسية */}
      {/* ============================================ */}
      <SectionTitle
        icon={<TrendingUpIcon fontSize="small" />}
        color="#3b82f6"
        title={t("mainStats") || "الإحصائيات الرئيسية"}
      />

      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid xs={12} sm={6} md={3}>
          <StatsCard
            title={t("totalUsers") || "إجمالي العملاء"}
            value={statsData.total_customers ?? 0}
            icon={<PeopleIcon fontSize="large" />}
            color="#3b82f6"
            delay={0}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <StatsCard
            title={t("totalBookings") || "إجمالي الحجوزات"}
            value={statsData.total_bookings ?? 0}
            icon={<ConfirmationNumberIcon fontSize="large" />}
            color="#10b981"
            delay={0.1}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <StatsCard
            title={t("totalRevenue") || "الإيرادات"}
            value={`$${Number(statsData.total_revenue ?? 0).toLocaleString()}`}
            icon={<AttachMoneyIcon fontSize="large" />}
            color="#f59e0b"
            delay={0.2}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <StatsCard
            title={t("pendingBookings") || "حجوزات قيد الانتظار"}
            value={statsData.pending_bookings ?? 0}
            icon={<StarIcon fontSize="large" />}
            color="#8b5cf6"
            delay={0.3}
          />
        </Grid>
      </Grid>

      {/* ============================================ */}
      {/*  إحصائيات الخدمات */}
      {/* ============================================ */}
      <SectionTitle
        icon={<InventoryIcon fontSize="small" />}
        color="#14b8a6"
        title={t("servicesStats") || "إحصائيات الخدمات"}
      />

      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid xs={12} sm={6} md={4}>
          <StatsCard
            title={t("totalTrips") || "إجمالي الرحلات"}
            value={statsData.total_trips ?? 0}
            icon={<FlightIcon fontSize="large" />}
            color="#06b6d4"
          />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <StatsCard
            title={t("totalPackages") || "إجمالي الباقات"}
            value={statsData.total_packages ?? 0}
            icon={<InventoryIcon fontSize="large" />}
            color="#14b8a6"
          />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <StatsCard
            title={t("pendingReviews") || "تقييمات قيد المراجعة"}
            value={statsData.pending_reviews ?? 0}
            icon={<ArticleIcon fontSize="large" />}
            color="#f97316"
          />
        </Grid>
      </Grid>

      {/* ============================================ */}
      {/* 📋 النشاطات الأخيرة */}
      {/* ============================================ */}
      <SectionTitle
        icon={<ConfirmationNumberIcon fontSize="small" />}
        color="#8b5cf6"
        title={t("recentActivities") || "النشاطات الأخيرة"}
      />

      <Grid container spacing={3}>
        <Grid xs={12} lg={5}>
          <RecentBookings bookings={formattedBookings} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <RecentUsers users={recentUsers} />
        </Grid>

        {/*  أكثر الرحلات حجزاً */}
        <Grid xs={12} md={6} lg={3}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e5e7eb",
              overflow: "hidden",
              height: "100%",
            }}
          >
            <CardHeader
              icon={<EmojiEventsIcon fontSize="small" />}
              color="#f59e0b"
              title={t("topTrips") || "أكثر الرحلات حجزاً"}
            />

            <Box sx={{ p: 2 }}>
              {data.top_trips && data.top_trips.length > 0 ? (
                data.top_trips.map((trip, index) => (
                  <Box key={trip.id}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        p: 1.5,
                        width:300,
                        borderRadius: 2,
                        bgcolor: index === 0 ? "#fffbeb4f" : "#5369807d",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateX(4px)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 38,
                          height: 38,
                          bgcolor: MEDAL_COLORS[index] || "#6b7280",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        {index + 1}
                      </Avatar>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight="bold" noWrap>
                          {trip.title_ar || trip.title_en}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1.5, mt: 0.25 }}>
                          <Typography variant="caption" color="text.secondary">
                            🎫 {trip.total_bookings ?? 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ⭐ {trip.average_rating || "0.0"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {index < data.top_trips.length - 1 && (
                      <Divider sx={{ my: 1 }} />
                    )}
                  </Box>
                ))
              ) : (
                <Box sx={{ textAlign: "center", py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t("noDataAvailable") || "لا توجد بيانات"}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/*  بعد قسم "إحصائيات الخدمات" */}
      <Grid spacing={3} sx={{padding:1 , marginTop:5 }}>
        <SectionTitle
        icon={<PaymentIcon fontSize="small" />}
        color="#10b981"
        title={t("paymentsOverview") || "نظرة عامة على المدفوعات"}
        />
        <PaymentsOverview />
    </Grid>
    </Box>
  );
}

// ======================================================================
// 🎨 ألوان الميداليات (ذهبي، فضي، برونزي)
// ======================================================================
const MEDAL_COLORS = ["#f59e0b", "#94a3b8", "#d97706"];

// ======================================================================
// 🎯 مكون محلي: عنوان قسم موحد
// ======================================================================
function SectionTitle({ icon, color, title }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: 2,
          color: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: `${color}1A`, // 10% opacity
        }}
      >
        {icon}
      </Box>
      <Typography variant="h6" fontWeight="bold">
        {title}
      </Typography>
      <Divider sx={{ flex: 1, borderColor: "#e5e7eb" }} />
    </Box>
  );
}