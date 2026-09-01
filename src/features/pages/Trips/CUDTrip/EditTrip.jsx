import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../../../api/refreshToken";

// MUI Imports
import {
  Alert, Box, Button, Card, CardContent, Checkbox, CircularProgress,
  FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem,
  Select, Snackbar, TextField, Typography, Divider
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";

export default function EditTrip() {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [programs, setPrograms] = useState([]);
  
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [formData, setFormData] = useState({
    title_ar: "", title_en: "",
    description_ar: "", description_en: "",
    short_description_ar: "", short_description_en: "",
    category_id: "", destination_id: "",
    price: "", discount_price: "", currency: "SYP",
    duration_days: "", max_participants: "",
    start_date: "", end_date: "",
    departure_location_ar: "", departure_location_en: "",
    included_services_ar: "", included_services_en: "",
    excluded_services_ar: "", excluded_services_en: "",
    cancellation_policy_ar: "", cancellation_policy_en: "",
    status: "draft", is_featured: false,
  });

  // 1. جلب القوائم المنسدلة (التصنيفات والوجهات) - يعمل مرة واحدة فقط عند فتح الصفحة
  useEffect(() => {
    let isActive = true; // متغير لمنع تحديث الحالة إذا غادر المستخدم الصفحة

    const loadDropdowns = async () => {
      try {
        const [catRes, destRes] = await Promise.all([
          api.get("/categories"),
          api.get("/destinations")
        ]);
        if (isActive) {
          setCategories(catRes.data?.data || catRes.data || []);
          setDestinations(destRes.data?.data || destRes.data || []);
        }
      } catch (err) {
        if (isActive) console.error("Error fetching dropdowns:", err);
      }
    };

    loadDropdowns();

    // Cleanup Function
    return () => {
      isActive = false; 
    };
  }, []); // مصفوفة فارغة = يعمل مرة واحدة فقط

  // 2. جلب بيانات الرحلة الحالية - يعمل عند تحميل الصفحة أو عند تغيير tripId
  useEffect(() => {
    if (!tripId) return;
    let isActive = true;

    const loadTrip = async () => {
      try {
        if (isActive) setLoading(true);
        
        const response = await api.get(`/trips/${tripId}`);
        const trip = response.data?.data || response.data;

        const formatDate = (dateStr) => (dateStr ? dateStr.split("T")[0] : "");

        if (isActive) {
          setFormData({
            title_ar: trip.title_ar || "", title_en: trip.title_en || "",
            description_ar: trip.description_ar || "", description_en: trip.description_en || "",
            short_description_ar: trip.short_description_ar || "", short_description_en: trip.short_description_en || "",
            category_id: trip.category_id || "", destination_id: trip.destination_id || "",
            price: trip.price || "", discount_price: trip.discount_price || "", currency: trip.currency || "SYP",
            duration_days: trip.duration_days || "", max_participants: trip.max_participants || "",
            start_date: formatDate(trip.start_date), end_date: formatDate(trip.end_date),
            departure_location_ar: trip.departure_location_ar || "", departure_location_en: trip.departure_location_en || "",
            included_services_ar: trip.included_services_ar || "", included_services_en: trip.included_services_en || "",
            excluded_services_ar: trip.excluded_services_ar || "", excluded_services_en: trip.excluded_services_en || "",
            cancellation_policy_ar: trip.cancellation_policy_ar || "", cancellation_policy_en: trip.cancellation_policy_en || "",
            status: trip.status || "draft", is_featured: trip.is_featured || false,
          });

          if (trip.programs && Array.isArray(trip.programs)) {
            setPrograms(
              trip.programs.map((p) => ({
                id: p.id,
                day_number: p.day_number,
                title_ar: p.title_ar || "",
                title_en: p.title_en || "",
                description_ar: p.description_ar || "",
                description_en: p.description_en || "",
                meals_included: p.meals_included || { breakfast: false, lunch: false, dinner: false },
              }))
            );
          }
        }
      } catch (err) {
        if (isActive) {
          console.error("Error fetching trip:", err);
          setSnackbar({ open: true, message: t("errorFetchingTrip"), severity: "error" });
        }
      } finally {
        if (isActive) setLoading(false);
      }
    };

    loadTrip();

    // Cleanup Function
    return () => {
      isActive = false;
    };
  }, [tripId, t]); // يعمل عند تغيير tripId أو لغة الترجمة t

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // دوال إدارة البرنامج اليومي
  const addDay = () => {
    setPrograms(prev => [...prev, {
      day_number: prev.length + 1, title_ar: "", title_en: "",
      description_ar: "", description_en: "",
      meals_included: { breakfast: false, lunch: false, dinner: false }
    }]);
  };

  const removeDay = (index) => {
    setPrograms(prev => prev.filter((_, i) => i !== index).map((p, i) => ({ ...p, day_number: i + 1 })));
  };

  const handleProgramChange = (index, field, value) => {
    setPrograms(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
  };

  const handleMealChange = (index, meal) => {
    setPrograms(prev => prev.map((p, i) => i === index ? {
      ...p, meals_included: { ...p.meals_included, [meal]: !p.meals_included[meal] }
    } : p));
  };

  // 3. إرسال التعديلات (PUT Request)
  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload = {
        ...formData,
        category_id: Number(formData.category_id),
        destination_id: Number(formData.destination_id),
        price: Number(formData.price),
        discount_price: formData.discount_price ? Number(formData.discount_price) : null,
        duration_days: Number(formData.duration_days),
        max_participants: Number(formData.max_participants),
        is_featured: Boolean(formData.is_featured),
        programs: programs,
      };

      await api.put(`/trips/${tripId}`, payload);
    } catch (err) {
      console.error("Update error:", err);
      setSnackbar({ open: true, message: err.response?.data?.message || t("errorUpdatingTrip"), severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", p: { xs: 2, md: 5 } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/Trips")}>{t("back")}</Button>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EditIcon sx={{ color: "#6ea3dc", fontSize: 30 }} />
          <Typography variant="h4" fontWeight="bold">{t("editTrip")}</Typography>
        </Box>
      </Box>

      <Card sx={{ maxWidth: 1200, mx: "auto", borderRadius: 4 }}>
        <CardContent>
          <Typography mb={4} sx={{ fontSize: 24, color: "#4286ae", fontWeight: 'bold' }}>
            {t("updateTripDetails")}
          </Typography>

          <Grid container spacing={3}>
            {/* العنوان */}
            <Grid  xs={12} md={6}>
              <TextField fullWidth required label={t("tripTitleArabic")} name="title_ar" value={formData.title_ar} onChange={handleChange} />
            </Grid>
            <Grid  xs={12} md={6}>
              <TextField fullWidth required label={t("tripTitleEnglish")} name="title_en" value={formData.title_en} onChange={handleChange} />
            </Grid>

            {/* الوصف القصير */}
            <Grid  xs={12} md={6}>
              <TextField fullWidth multiline rows={2} label={t("shortDescriptionArabic")} name="short_description_ar" value={formData.short_description_ar} onChange={handleChange} />
            </Grid>
            <Grid  xs={12} md={6}>
              <TextField fullWidth multiline rows={2} label={t("shortDescriptionEnglish")} name="short_description_en" value={formData.short_description_en} onChange={handleChange} />
            </Grid>

            {/* التصنيف والوجهة */}
            <Grid  xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>{t("category")}</InputLabel>
                <Select name="category_id" value={formData.category_id} label={t("category")} onChange={handleChange}>
                  {categories.map((cat) => (<MenuItem key={cat.id} value={cat.id}>{cat.name_ar} / {cat.name_en}</MenuItem>))}
                </Select>
              </FormControl>
            </Grid>
            <Grid  xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>{t("destination")}</InputLabel>
                <Select name="destination_id" value={formData.destination_id} label={t("destination")} onChange={handleChange}>
                  {destinations.map((dest) => (<MenuItem key={dest.id} value={dest.id}>{dest.name_ar} / {dest.name_en}</MenuItem>))}
                </Select>
              </FormControl>
            </Grid>

            {/* السعر والعملة */}
            <Grid  xs={12} md={4}>
              <TextField fullWidth required type="number" label={t("price")} name="price" value={formData.price} onChange={handleChange} />
            </Grid>
            <Grid  xs={12} md={4}>
              <TextField fullWidth type="number" label={t("discountPrice")} name="discount_price" value={formData.discount_price} onChange={handleChange} />
            </Grid>
            <Grid  xs={12} md={4}>
              <TextField select fullWidth label={t("currency")} name="currency" value={formData.currency} onChange={handleChange}>
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="SYP">SYP</MenuItem>
              </TextField>
            </Grid>

            {/* التواريخ والسعة */}
            <Grid  xs={12} md={4}>
              <TextField fullWidth required type="date" label={t("startDate")} name="start_date" value={formData.start_date} onChange={handleChange}  slotProps={{inputLabel: { shrink: true } }} />
            </Grid>
            <Grid  xs={12} md={4}>
              <TextField fullWidth required type="date" label={t("endDate")} name="end_date" value={formData.end_date} onChange={handleChange}  slotProps={{inputLabel: { shrink: true } }} />
            </Grid>
            <Grid  xs={12} md={4}>
              <TextField fullWidth required type="number" label={t("maxParticipants")} name="max_participants" value={formData.max_participants} onChange={handleChange} />
            </Grid>

            {/* الحالة والمميزة */}
            <Grid  xs={12} md={4}>
              <TextField select fullWidth label={t("status")} name="status" value={formData.status} onChange={handleChange}>
                <MenuItem value="published">{t("published")}</MenuItem>
                <MenuItem value="draft">{t("draft")}</MenuItem>
              </TextField>
            </Grid>
            <Grid  xs={12} md={8} sx={{ display: "flex", alignItems: "center" }}>
              <FormControlLabel control={<Checkbox checked={formData.is_featured} name="is_featured" onChange={handleChange} />} label={t("featuredTrip")} />
            </Grid>

            {/* البرنامج اليومي */}
            <Grid  xs={12}>
              <Box sx={{ p: 3, border: "2px dashed #4286ae", borderRadius: 3, mt: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="h6" color="#4286ae" fontWeight="bold">📅 {t("dailyProgram")}</Typography>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={addDay}>{t("addDay")}</Button>
                </Box>

                {programs.map((program, index) => (
                  <Card key={index} sx={{ mb: 2, p: 2, border: "1px solid #e0e0e0" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", bgcolor: "#4286ae", color: "white", p: 1, borderRadius: 2, mb: 2 }}>
                      <Typography fontWeight="bold">{t("day")} {program.day_number}</Typography>
                      <IconButton color="inherit" onClick={() => removeDay(index)}><DeleteIcon /></IconButton>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid  xs={12} md={6}><TextField fullWidth size="small" label="عنوان اليوم (عربي)" value={program.title_ar} onChange={(e) => handleProgramChange(index, "title_ar", e.target.value)} /></Grid>
                      <Grid  xs={12} md={6}><TextField fullWidth size="small" label="Day Title (English)" value={program.title_en} onChange={(e) => handleProgramChange(index, "title_en", e.target.value)} /></Grid>
                      <Grid  xs={12}>
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <FormControlLabel control={<Checkbox checked={program.meals_included.breakfast} onChange={() => handleMealChange(index, "breakfast")} />} label="🌅 فطور" />
                          <FormControlLabel control={<Checkbox checked={program.meals_included.lunch} onChange={() => handleMealChange(index, "lunch")} />} label="☀️ غداء" />
                          <FormControlLabel control={<Checkbox checked={program.meals_included.dinner} onChange={() => handleMealChange(index, "dinner")} />} label="🌙 عشاء" />
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                ))}
              </Box>
            </Grid>

            {/* زر الحفظ */}
            <Grid  xs={12}>
              <Button variant="contained" size="large" onClick={handleSubmit} disabled={saving} startIcon={<SaveIcon />} sx={{ borderRadius: 3, px: 5, py: 1.5 }}>
                {saving ? t("saving") : t("updateTrip")}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}