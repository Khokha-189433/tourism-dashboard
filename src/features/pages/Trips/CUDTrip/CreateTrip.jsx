import React, { useState, useEffect } from "react";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import api from "../../../../api/refreshToken";
import { useTranslation } from "react-i18next";

const CreateTrip = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  // ✅ حالات القوائم المنسدلة (Dropdowns)
  const [categories, setCategories] = useState([]);
  const [destinations, setDestinations] = useState([]);

  // ✅ حالة البرنامج اليومي (الأيام)
  const [programs, setPrograms] = useState([]);

  // ✅ حالة التنبيهات
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ✅ البيانات الأساسية للرحلة
  const [formData, setFormData] = useState({
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    short_description_ar: "",
    short_description_en: "",

    category_id: "",
    destination_id: "",

    price: "",
    discount_price: "",
    currency: "SYP",

    duration_days: "",
    max_participants: "",

    start_date: "",
    end_date: "",

    departure_location_ar: "",
    departure_location_en: "",

    included_services_ar: "",
    included_services_en: "",
    excluded_services_ar: "",
    excluded_services_en: "",

    cancellation_policy_ar: "",
    cancellation_policy_en: "",

    status: "draft",
    is_featured: false,
  });

  // ============================================================
  // 🚀 جلب التصنيفات والوجهات عند تحميل الصفحة
  // ============================================================
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [catRes, destRes] = await Promise.all([
          api.get("/categories"),
          api.get("/destinations"),
        ]);
        setCategories(catRes.data?.data || catRes.data || []);
        setDestinations(destRes.data?.data || destRes.data || []);
      } catch (error) {
        console.error("خطأ في جلب القوائم:", error);
      }
    };
    fetchDropdowns();
  }, []);

  // ============================================================
  // 📝 معالجة تغيير الحقول الأساسية
  // ============================================================
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ============================================================
  // 📅 دوال إدارة البرنامج اليومي (Programs)
  // ============================================================
  const addDay = () => {
    setPrograms([
      ...programs,
      {
        day_number: programs.length + 1,
        title_ar: "",
        title_en: "",
        description_ar: "",
        description_en: "",
        meals_included: {
          breakfast: false,
          lunch: false,
          dinner: false,
        },
      },
    ]);
  };

  const removeDay = (index) => {
    const updated = programs
      .filter((_, i) => i !== index)
      .map((p, i) => ({ ...p, day_number: i + 1 })); // إعادة ترقيم الأيام
    setPrograms(updated);
  };

  const handleProgramChange = (index, field, value) => {
    const updated = [...programs];
    updated[index][field] = value;
    setPrograms(updated);
  };

  const handleMealChange = (index, meal) => {
    const updated = [...programs];
    updated[index].meals_included[meal] = !updated[index].meals_included[meal];
    setPrograms(updated);
  };

  // ============================================================
  // ✅ دالة التحقق من البيانات
  // ============================================================
  const validateForm = () => {
    if (!formData.title_ar || !formData.title_en) {
      setSnackbar({
        open: true,
        message: "العنوان باللغتين مطلوب",
        severity: "error",
      });
      return false;
    }

    if (!formData.category_id || !formData.destination_id) {
      setSnackbar({
        open: true,
        message: "يجب اختيار التصنيف والوجهة",
        severity: "error",
      });
      return false;
    }

    if (!formData.price) {
      setSnackbar({
        open: true,
        message: "السعر مطلوب",
        severity: "error",
      });
      return false;
    }

    if (!formData.duration_days || !formData.max_participants) {
      setSnackbar({
        open: true,
        message: "المدة وعدد المشاركين مطلوبان",
        severity: "error",
      });
      return false;
    }

    if (!formData.start_date || !formData.end_date) {
      setSnackbar({
        open: true,
        message: "تاريخا البدء والانتهاء مطلوبان",
        severity: "error",
      });
      return false;
    }

    if (new Date(formData.end_date) <= new Date(formData.start_date)) {
      setSnackbar({
        open: true,
        message: "تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء",
        severity: "error",
      });
      return false;
    }

    if (programs.length === 0) {
      setSnackbar({
        open: true,
        message: "يجب إضافة يوم واحد على الأقل في البرنامج",
        severity: "error",
      });
      return false;
    }

    // التحقق من أن كل يوم له عنوان
    const hasEmptyDay = programs.some(
      (p) => !p.title_ar || !p.title_en
    );
    if (hasEmptyDay) {
      setSnackbar({
        open: true,
        message: "يجب إدخال عنوان كل يوم باللغتين",
        severity: "error",
      });
      return false;
    }

    return true;
  };

  // ============================================================
  // 🚀 إرسال البيانات إلى الـ API
  // ============================================================
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        ...formData,
        category_id: Number(formData.category_id),
        destination_id: Number(formData.destination_id),
        price: Number(formData.price),
        discount_price: formData.discount_price
          ? Number(formData.discount_price)
          : null,
        duration_days: Number(formData.duration_days),
        max_participants: Number(formData.max_participants),
        is_featured: Boolean(formData.is_featured),
        programs: programs, // ← البرنامج اليومي
      };

      console.log("📤 Payload:", payload);

      await api.post("/trips", payload, {
        headers: { "Content-Type": "application/json" },
      });

      setSnackbar({
        open: true,
        message: "✅ تم إنشاء الرحلة بنجاح",
        severity: "success",
      });

      // الانتقال بعد ثانيتين لإظهار رسالة النجاح
      setTimeout(() => {
        navigate("/Trips", {
          state: { message: "تم إنشاء الرحلة بنجاح", severity: "success" },
        });
      }, 1500);
    } catch (error) {
      console.error("❌ خطأ مفصل:", error.response?.data || error.message);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message || "حدث خطأ أثناء إنشاء الرحلة",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", p: 5 }}>
      {/* الهيدر */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/trips")}
        >
          {t("back")}
        </Button>

        <Box sx={{ textAlign: "right" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 1,
            }}
          >
            <TripOriginIcon sx={{ color: "#6ea3dc", fontSize: 30 }} />
            <Typography variant="h4" fontWeight="bold">
              {t("addTrip")}
            </Typography>
          </Box>
          <Typography color="text.secondary">{t("addNewTrip")}</Typography>
        </Box>
      </Box>

      <Card sx={{ maxWidth: 1200, mx: "auto", borderRadius: 4 }}>
        <CardContent>
          <Typography
            mb={4}
            sx={{ margin: 4, fontSize: 27, color: "#4286ae" }}
          >
            {t("createNewTrip")}
          </Typography>

          <Grid container spacing={3}>
            {/* ========== العنوان باللغتين ========== */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label={t("tripTitleArabic")}
                name="title_ar"
                value={formData.title_ar}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label={t("tripTitleEnglish")}
                name="title_en"
                value={formData.title_en}
                onChange={handleChange}
              />
            </Grid>

            {/* ========== الوصف القصير ========== */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label={t("shortDescriptionArabic")}
                name="short_description_ar"
                value={formData.short_description_ar}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label={t("shortDescriptionEnglish")}
                name="short_description_en"
                value={formData.short_description_en}
                onChange={handleChange}
              />
            </Grid>

            {/* ========== الوصف الطويل ========== */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label={t("descriptionArabic")}
                name="description_ar"
                value={formData.description_ar}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label={t("descriptionEnglish")}
                name="description_en"
                value={formData.description_en}
                onChange={handleChange}
              />
            </Grid>

            {/* ========== التصنيف والوجهة ========== */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>{t("category")}</InputLabel>
                <Select
                  name="category_id"
                  value={formData.category_id}
                  label={t("category")}
                  onChange={handleChange}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name_ar} / {cat.name_en}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>{t("destination")}</InputLabel>
                <Select
                  name="destination_id"
                  value={formData.destination_id}
                  label={t("destination")}
                  onChange={handleChange}
                >
                  {destinations.map((dest) => (
                    <MenuItem key={dest.id} value={dest.id}>
                      {dest.name_ar} / {dest.name_en}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* ========== السعر والخصم والعملة ========== */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                type="number"
                label={t("price")}
                name="price"
                value={formData.price}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label={t("discountPrice")}
                name="discount_price"
                value={formData.discount_price}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label={t("currency")}
                name="currency"
                value={formData.currency}
                onChange={handleChange}
              >
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="SYP">SYP</MenuItem>
              </TextField>
            </Grid>

            {/* ========== المدة وعدد المشاركين ========== */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="number"
                label={t("tripDuration")}
                name="duration_days"
                value={formData.duration_days}
                onChange={handleChange}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="number"
                label={t("maxParticipants")}
                name="max_participants"
                value={formData.max_participants}
                onChange={handleChange}
                inputProps={{ min: 1 }}
              />
            </Grid>

            {/* ========== التواريخ ========== */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="date"
                label={t("startDate")}
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="date"
                label={t("endDate")}
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* ========== نقطة الانطلاق ========== */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("departureLocationAr")}
                name="departure_location_ar"
                value={formData.departure_location_ar}
                onChange={handleChange}
                placeholder="مثال: دمشق - ساحة الأمويين"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("departureLocationEn")}
                name="departure_location_en"
                value={formData.departure_location_en}
                onChange={handleChange}
                placeholder="Ex: Damascus - Umayyad Square"
              />
            </Grid>

            {/* ========== الخدمات المشمولة ========== */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t("includedServicesAr")}
                name="included_services_ar"
                value={formData.included_services_ar}
                onChange={handleChange}
                placeholder="مثال: النقل، الإقامة، الوجبات"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t("includedServicesEn")}
                name="included_services_en"
                value={formData.included_services_en}
                onChange={handleChange}
                placeholder="Ex: Transport, Accommodation, Meals"
              />
            </Grid>

            {/* ========== الخدمات غير المشمولة ========== */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t("excludedServicesAr")}
                name="excluded_services_ar"
                value={formData.excluded_services_ar}
                onChange={handleChange}
                placeholder="مثال: المشتريات الشخصية"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t("excludedServicesEn")}
                name="excluded_services_en"
                value={formData.excluded_services_en}
                onChange={handleChange}
                placeholder="Ex: Personal purchases"
              />
            </Grid>

            {/* ========== سياسة الإلغاء ========== */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label={t("cancellationPolicyAr")}
                name="cancellation_policy_ar"
                value={formData.cancellation_policy_ar}
                onChange={handleChange}
                placeholder="مثال: إلغاء مجاني قبل 7 أيام"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label={t("cancellationPolicyEn")}
                name="cancellation_policy_en"
                value={formData.cancellation_policy_en}
                onChange={handleChange}
                placeholder="Ex: Free cancellation 7 days before"
              />
            </Grid>

            {/* ========== الحالة والمميزة ========== */}
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label={t("status")}
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value="published">{t("published")}</MenuItem>
                <MenuItem value="draft">{t("draft")}</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={8} sx={{ display: "flex", alignItems: "center" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.is_featured}
                    name="is_featured"
                    onChange={handleChange}
                  />
                }
                label={t("featuredTrip")}
              />
            </Grid>

            {/* ============================================================ */}
            {/* 🌟 القسم الأهم: البرنامج اليومي (Programs) */}
            {/* ============================================================ */}
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 3,
                  border: "2px dashed #4286ae",
                  borderRadius: 3,
                  mt: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" color="#4286ae" fontWeight="bold">
                    📅 {t("dailyProgram")} ({programs.length} {t("days")})
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={addDay}
                    sx={{ borderRadius: 3 }}
                  >
                    {t("addDay")}
                  </Button>
                </Box>

                {programs.length === 0 && (
                  <Alert severity="info">
                    اضغط على زر "إضافة يوم" لبدء بناء برنامج الرحلة
                  </Alert>
                )}

                {programs.map((program, index) => (
                  <Card
                    key={index}
                    sx={{ mb: 2, p: 2, border: "1px solid #e0e0e0" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                        bgcolor: "#4286ae",
                        color: "white",
                        p: 1,
                        borderRadius: 2,
                      }}
                    >
                      <Typography fontWeight="bold">
                        اليوم {program.day_number}
                      </Typography>
                      <IconButton
                        color="inherit"
                        onClick={() => removeDay(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          required
                          size="small"
                          label="عنوان اليوم (عربي)"
                          value={program.title_ar}
                          onChange={(e) =>
                            handleProgramChange(
                              index,
                              "title_ar",
                              e.target.value
                            )
                          }
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          required
                          size="small"
                          label="Day Title (English)"
                          value={program.title_en}
                          onChange={(e) =>
                            handleProgramChange(
                              index,
                              "title_en",
                              e.target.value
                            )
                          }
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          size="small"
                          label="وصف اليوم (عربي)"
                          value={program.description_ar}
                          onChange={(e) =>
                            handleProgramChange(
                              index,
                              "description_ar",
                              e.target.value
                            )
                          }
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          size="small"
                          label="Day Description (English)"
                          value={program.description_en}
                          onChange={(e) =>
                            handleProgramChange(
                              index,
                              "description_en",
                              e.target.value
                            )
                          }
                        />
                      </Grid>

                      {/* الوجبات */}
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom>
                          🍽️ الوجبات المشمولة:
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={program.meals_included.breakfast}
                                onChange={() =>
                                  handleMealChange(index, "breakfast")
                                }
                              />
                            }
                            label="🌅 فطور"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={program.meals_included.lunch}
                                onChange={() =>
                                  handleMealChange(index, "lunch")
                                }
                              />
                            }
                            label="☀️ غداء"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={program.meals_included.dinner}
                                onChange={() =>
                                  handleMealChange(index, "dinner")
                                }
                              />
                            }
                            label="🌙 عشاء"
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                ))}
              </Box>
            </Grid>

            {/* ========== زر الحفظ ========== */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={loading}
                sx={{ borderRadius: 3, px: 5, py: 1.5 }}
              >
                {loading ? t("saving") : t("createTrip")}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ✅ Snackbar للتنبيهات */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateTrip;