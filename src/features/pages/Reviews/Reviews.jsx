import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../../api/refreshToken";

//  استيراد المكونات الثلاثة
import ApproveReview from "./CUD_Reviews/ApproveReview";
import RejectReview from "./CUD_Reviews/RejectReview";
import DeleteReview from "./CUD_Reviews/DeleteReview";

import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Rating, TextField,
  MenuItem, Select, FormControl, InputLabel, Stack, CircularProgress,
  InputAdornment
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

export default function Reviews() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  // ============================================================
  //  States
  // ============================================================
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");

  // ============================================================
  //  جلب التقييمات من الـ API
  // ============================================================


  useEffect(() => {
    const fetchReviews = async () => {
    setLoading(true);
    try {
    const url = filterStatus === "all"
    ? "/reviews?page=1&limit=50"
    : `/reviews?page=1&limit=50&status=${filterStatus}`;

    const res = await api.get(url);
    const data = res.data?.data || res.data?.reviews || res.data || [];
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("خطأ في جلب التقييمات:", error);
    } finally {
      setLoading(false);
    }
  };
    fetchReviews();
  }, [filterStatus]);

  // ============================================================
  //  البحث المحلي
  // ============================================================
  const filteredReviews = reviews.filter((review) => {
    if (!search.trim()) return true;

    const searchTerm = search.toLowerCase();
    const comment = review.comment?.toLowerCase() || "";
    const userName = review.User
      ? `${review.User.first_name} ${review.User.last_name}`.toLowerCase()
      : "";

    return comment.includes(searchTerm) || userName.includes(searchTerm);
  });

  // ============================================================
  //  دوال التحديث بعد نجاح العمليات
  // ============================================================

  //  بعد الموافقة أو الرفض: تحديث حالة التقييم في الجدول
  const handleStatusUpdate = (reviewId, newData) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId ? { ...review, ...newData } : review
      )
    );
  };

  //  بعد الحذف: إزالة التقييم من الجدول
  const handleDelete = (reviewId) => {
    setReviews((prev) => prev.filter((review) => review.id !== reviewId));
  };

  // ============================================================
  //  دالة مساعدة: لون الحالة
  // ============================================================
  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "success";
      case "rejected": return "error";
      case "pending": return "warning";
      default: return "default";
    }
  };

  // ============================================================
  //  دالة مساعدة: اسم الهدف (رحلة أم باقة)
  // ============================================================
  const getTargetName = (review) => {
    const type = review.reviewable_type === "trip" ? t("trip") : t("package");
    return `${type} #${review.reviewable_id}`;
  };

  // ============================================================
  // Render
  // ============================================================
  return (
    <Box sx={{ p: 3, direction: isArabic ? "rtl" : "ltr" }}>

      {/* ===== العنوان والفلتر ===== */}
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
          <Typography variant="h5" fontWeight="bold">
            {t("reviewsManagement")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {t("reviewsSubtitle")}
          </Typography>
        </Box>

        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>{t("filterByStatus")}</InputLabel>
          <Select
            value={filterStatus}
            label={t("filterByStatus")}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="all">{t("all")}</MenuItem>
            <MenuItem value="pending">{t("pending")}</MenuItem>
            <MenuItem value="approved">{t("approved")}</MenuItem>
            <MenuItem value="rejected">{t("rejected")}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* ===== البحث ===== */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchReviews")}
          slot={{
            input:{
                startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ), }  
          }}
        />
      </Box>

      {/* ===== الجدول ===== */}
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead sx={{ bgcolor: "action.hover" }}>
              <TableRow>
                <TableCell align="center"><strong>{t("customer")}</strong></TableCell>
                <TableCell align="center"><strong>{t("target")}</strong></TableCell>
                <TableCell align="center"><strong>{t("rating")}</strong></TableCell>
                <TableCell align="center"><strong>{t("comment")}</strong></TableCell>
                <TableCell align="center"><strong>{t("status")}</strong></TableCell>
                <TableCell align="center"><strong>{t("actions")}</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredReviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      {t("noReviewsFound")}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredReviews.map((review) => (
                  <TableRow key={review.id} hover>

                    {/* اسم العميل */}
                    <TableCell align="center">
                      {review.User
                        ? `${review.User.first_name} ${review.User.last_name}`
                        : `User #${review.user_id}`}
                    </TableCell>

                    {/* الهدف (رحلة/باقة) */}
                    <TableCell align="center">
                      <Chip
                        label={getTargetName(review)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>

                    {/* النجوم */}
                    <TableCell align="center">
                      <Rating value={review.rating} readOnly size="small" />
                    </TableCell>

                    {/* التعليق */}
                    <TableCell align="center" sx={{ maxWidth: 250 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {review.comment}
                      </Typography>

                      {/* عرض رد الإدارة إن وجد */}
                      {review.admin_reply && (
                        <Typography
                          variant="caption"
                          color="primary"
                          display="block"
                          sx={{ mt: 0.5 }}
                        >
                          💬 {review.admin_reply}
                        </Typography>
                      )}
                    </TableCell>

                    {/* الحالة */}
                    <TableCell align="center">
                      <Chip
                        label={t(review.status)}
                        color={getStatusColor(review.status)}
                        size="small"
                      />
                    </TableCell>

                    {/* ===== الأزرار (المكونات الثلاثة) ===== */}
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{justifyContent:"center", alignItems:"center"}}
                      >
                        {/*  زر الموافقة */}
                        <ApproveReview
                          review={review}
                          disabled={review.status === "approved"}
                          onApproved={handleStatusUpdate}
                        />

                        {/*  زر الرفض */}
                        <RejectReview
                          review={review}
                          disabled={review.status === "rejected"}
                          onRejected={handleStatusUpdate}
                        />

                        {/*  زر الحذف */}
                        <DeleteReview
                          review={review}
                          onDeleted={handleDelete}
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Box>
  );
}