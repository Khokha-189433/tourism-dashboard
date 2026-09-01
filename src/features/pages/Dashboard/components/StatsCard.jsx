import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import CountUp from "../../../../components/CountUp/CountUp";

/**
 *  مكون بطاقة إحصائية - قابل لإعادة الاستخدام
 * 
 * Props:
 * - title: عنوان البطاقة (مثال: "المستخدمين")
 * - value: القيمة (مثال: 1234)
 * - icon: الأيقونة
 * - color: اللون الأساسي
 * - trend: نسبة التغيير (مثال: 12.5)
 * - trendUp: هل الاتجاه صاعد؟ (true/false)
 */
export default function StatsCard({ 
  title, 
  value, 
  icon, 
  color = "#3b82f6",
  trend = 0,
  trendUp = true,
  delay = 0 
}) {
  return (
    <Paper
      elevation={0}
      className="anim-fade-up hover-lift"   // ✨ الحركة + تأثير الماوس
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: "1px solid #eff4fc",
        animationDelay: `${delay}s`,       // ✨ التأخير المخصص
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight="medium">
            {title}
          </Typography>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ mt: 1, 
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: `${color}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: color, }}
            
          >
            {value}
          </Typography>

          {/* 📈 مؤشر التغيير */}
          {trend !== 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}>
              {trendUp ? (
                <TrendingUpIcon fontSize="small" sx={{ fontSize: 16, color: "#10b981" }} />
              ) : (
                <TrendingDownIcon fontSize="small" variant="caption" color="#10b981" fontWeight="bold" />
              )}
              <Typography
                color="text.secondary"
                variant="caption"
                sx={{ color: trendUp ? "success.main" : "error.main", fontWeight: "bold" }}
              >
                {trend}% {trendUp ? "ارتفاع" : "انخفاض"}
              </Typography>
            </Box>
          )}
        </Box>

        {/* 🎨 الأيقونة في دائرة */}
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            bgcolor: color,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );
}