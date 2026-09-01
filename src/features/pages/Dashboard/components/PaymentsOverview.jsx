import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../../../api/refreshToken";

import { Box, Grid, Paper, Alert, Button, Typography } from "@mui/material";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import ReplayIcon from "@mui/icons-material/Replay";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell,
} from "recharts";

// ♻️ مكونات موجودة مسبقاً (بدون تكرار)
import StatsCard from "./StatsCard";
import CardHeader from "./CardHeader";

export default function PaymentsOverview() {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======================================================================
  // جلب الحجوزات (تحتوي على payment_status)
  // ======================================================================
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings?limit=100");
        const data = res.data?.data || [];
        if (Array.isArray(data)) {
          setBookings(data);
        }
      } catch (err) {
        console.error("PaymentsOverview Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // ======================================================================
  // 🧮 العدّادات (بـ for loop بسيطة)
  // ======================================================================
  let paidCount = 0;
  let unpaidCount = 0;
  let refundedCount = 0;
  let totalCollected = 0;

  for (let i = 0; i < bookings.length; i++) {
    const b = bookings[i];
    const status = (b.payment_status || "unpaid").toLowerCase();
    const amount = parseFloat(b.total_price || b.total_amount || 0);

    if (status === "paid") {
      paidCount = paidCount + 1;
      totalCollected = totalCollected + amount;
    } else if (status === "unpaid") {
      unpaidCount = unpaidCount + 1;
    } else if (status === "refunded") {
      refundedCount = refundedCount + 1;
    }
  }

  // ======================================================================
  // 📈 الإيرادات حسب الشهر (آخر 6 أشهر)
  // ======================================================================
  const monthlyRevenue = [];
  const now = new Date();

  // 1) إنشاء 6 أشهر فارغة
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthlyRevenue.push({
      year: d.getFullYear(),
      monthIndex: d.getMonth(),
      month: d.toLocaleDateString("en-US", { month: "short" }),
      revenue: 0,
    });
  }

  // 2) تعبئة المبالغ المدفوعة فقط
  for (let i = 0; i < bookings.length; i++) {
    const b = bookings[i];
    const status = (b.payment_status || "").toLowerCase();

    // نتجاهل أي حجز غير مدفوع
    if (status !== "paid") continue;

    const dateStr = b.createdAt || b.created_at;
    if (!dateStr) continue;

    const d = new Date(dateStr);
    const amount = parseFloat(b.total_price || b.total_amount || 0);

    // نبحث عن الشهر المطابق ونضيف المبلغ
    for (let j = 0; j < monthlyRevenue.length; j++) {
      const row = monthlyRevenue[j];
      if (row.year === d.getFullYear() && row.monthIndex === d.getMonth()) {
        row.revenue = row.revenue + amount;
        break;
      }
    }
  }

  // ======================================================================
  // 🍩 بيانات الرسم الدائري
  // ======================================================================
  const donutData = [];
  if (paidCount > 0) donutData.push({ name: t("paid") || "مدفوع", value: paidCount, color: "#10b981" });
  if (unpaidCount > 0) donutData.push({ name: t("unpaid") || "غير مدفوع", value: unpaidCount, color: "#f59e0b" });
  if (refundedCount > 0) donutData.push({ name: t("refunded") || "مسترد", value: refundedCount, color: "#ef4444" });

  if (loading) return null;

  // ======================================================================
  // 🎨 الواجهة
  // ======================================================================
  return (
    <Box>
      {/* ===== 1) البطاقات ===== */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid xs={12} sm={6} md={3}>
          <StatsCard
            title={t("totalCollected") || "إجمالي المحصّل"}
            value={totalCollected.toLocaleString()}
            icon={<AttachMoneyIcon fontSize="large" />}
            color="#10b981"
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatsCard
            title={t("paidCount") || "عمليات مدفوعة"}
            value={paidCount}
            icon={<CheckCircleIcon fontSize="large" />}
            color="#3b82f6"
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatsCard
            title={t("unpaidCount") || "غير مدفوعة"}
            value={unpaidCount}
            icon={<HourglassTopIcon fontSize="large" />}
            color="#f59e0b"
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatsCard
            title={t("refundedCount") || "عمليات مستردة"}
            value={refundedCount}
            icon={<ReplayIcon fontSize="large" />}
            color="#ef4444"
          />
        </Grid>
      </Grid>

      {/* ===== 2) تنبيه الأموال المعلّقة ===== */}
      {unpaidCount > 0 && (
        <Alert
          severity="warning"
          icon={<WarningAmberIcon />}
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button component={Link} to="/Payments" color="inherit" size="small">
              {t("viewAll") || "عرض الكل"}
            </Button>
          }
        >
          {t("unpaidAlert") || `يوجد ${unpaidCount} حجوزات لم تُدفع بعد وتحتاج متابعة`}
        </Alert>
      )}

      {/* ===== 3) الرسوم البيانية ===== */}
      <Grid container spacing={4}>
        {/* 📈 الإيرادات الشهرية */}
        <Grid xs={12} md={7}>
          <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #97989989", overflow: "hidden" ,width:700, height:370 , background:"#91999720" }}>
            <CardHeader
              icon={<AttachMoneyIcon fontSize="small" />}
              color="#10b981"
              title={t("revenueByMonth") || "الإيرادات حسب الشهر"}
            />
            <Box sx={{ p: 2 }}>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="#10b98130"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* 🍩 توزيع حالات الدفع */}
        <Grid xs={12} md={2}>
          <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #e5e7eb", overflow: "hidden" , width: 340 , height: 370 , background:"#91999720" }}>
            <CardHeader
              icon={<CheckCircleIcon fontSize="small" />}
              color="#8b5cf6"
              title={t("paymentStatusDistribution") || "توزيع حالات الدفع"}
            />
            <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
              {donutData.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 6, width: "100%", textAlign: "center" }}>
                  {t("noDataAvailable") || "لا توجد بيانات"}
                </Typography>
              ) : (
                <>
                  <ResponsiveContainer width="55%" height={220}>
                    <PieChart>
                      <Pie data={donutData} dataKey="value" innerRadius={50} outerRadius={80}>
                        {donutData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <Box sx={{ flex: 1 }}>
                    {donutData.map((item, i) => (
                      <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <Box sx={{ width: 14, height: 10, borderRadius: "50%", bgcolor: item.color }} />
                    <Typography variant="body2">{item.name}  :  {item.value}</Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}