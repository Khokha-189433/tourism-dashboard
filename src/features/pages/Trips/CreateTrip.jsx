import React, { useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import axios from "axios";

const CreateTrip = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title_ar: "",
    title_en: "",

    description_ar: "",
    description_en: "",

    short_description_ar: "",
    short_description_en: "",

    // category_id: "",
    // destination_id: "",

    price: "",
    discount_price: "",

    currency: "USD",

    duration_days: "",

    max_participants: "",

    status: "published",

    is_featured: false,
  });


  // تغيير القيم
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // إرسال البيانات
  const handleSubmit = async () => {
    try {
      setLoading(true);

      // التحقق من الحقول المطلوبة
      if (!formData.title_ar || !formData.title_en) {
        alert("يرجى ملء العنوان");
        setLoading(false);
        return;
      }

      if (!formData.short_description_ar || !formData.short_description_en) {
        alert("يرجى إدخال الوصف القصير بالعربية والإنجليزية");
        setLoading(false);
        return;
      }

      if (!formData.price) {
        alert("يرجى إدخال السعر");
        setLoading(false);
        return;
      }

      if (!formData.currency) {
        alert("يرجى اختيار العملة");
        setLoading(false);
        return;
      }

      if (!formData.duration_days) {
        alert("يرجى إدخال مدة الرحلة");
        setLoading(false);
        return;
      }

      if (!formData.max_participants) {
        alert("يرجى إدخال الحد الأقصى للمشاركين");
        setLoading(false);
        return;
      }

      // الحصول على التوكن من التخزين المحلي
      const adminToken = localStorage.getItem("adminToken");

      if (!adminToken) {
        alert("لم يتم العثور على التوكن. يرجى تسجيل الدخول مرة أخرى");
        setLoading(false);
        return;
      }

      const payload = {
        ...formData,
        price: Number(formData.price),
        discount_price: formData.discount_price ? Number(formData.discount_price) : null,
        duration_days: Number(formData.duration_days),
        max_participants: Number(formData.max_participants),
        is_featured: Boolean(formData.is_featured),
      };

      console.log("إرسال البيانات:", payload);

      const response = await axios.post(
        "/api/trips",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      console.log("response.data:", response.data);

      alert("تم إنشاء الرحلة بنجاح");
      
      // إعادة تعيين النموذج
      setFormData({
        title_ar: "",
        title_en: "",
        description_ar: "",
        description_en: "",
        short_description_ar: "",
        short_description_en: "",
        price: "",
        discount_price: "",
        currency: "USD",
        duration_days: "",
        max_participants: "",
        status: "published",
        is_featured: false,
      });
    } catch (error) {
      console.error("خطأ مفصل:", error.response?.data || error.message);
      
      const backendErrors = error.response?.data?.errors;
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          (backendErrors ? backendErrors.map((e) => e.message).join(', ') : null) ||
                          error.message || 
                          "حدث خطأ غير متوقع";
      
      alert(`خطأ: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 5,
      }}
    >
      <Card
        sx={{
          maxWidth: 1200,
          mx: "auto",
          borderRadius: 4,
        }}
      >
        <CardContent>

          {/* العنوان */}
          <Typography variant="h4" fontWeight="bold" mb={4}>
            إنشاء رحلة جديدة
          </Typography>

          <Grid container spacing={3}>
            {/* عنوان عربي */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="عنوان الرحلة بالعربي"
                name="title_ar"
                value={formData.title_ar}
                onChange={handleChange}
              />
            </Grid>

            {/* عنوان إنجليزي */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Trip Title English"
                name="title_en"
                value={formData.title_en}
                onChange={handleChange}
              />
            </Grid>

            {/* وصف قصير عربي */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="الوصف القصير بالعربي"
                name="short_description_ar"
                value={formData.short_description_ar}
                onChange={handleChange}
              />
            </Grid>

            {/* وصف قصير إنجليزي */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Short Description English"
                name="short_description_en"
                value={formData.short_description_en}
                onChange={handleChange}
              />
            </Grid>

            {/* وصف عربي */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="الوصف بالعربي"
                name="description_ar"
                value={formData.description_ar}
                onChange={handleChange}
              />
            </Grid>

            {/* وصف إنجليزي */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description English"
                name="description_en"
                value={formData.description_en}
                onChange={handleChange}
              />
            </Grid>

            {/* السعر */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="السعر"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </Grid>

            {/* سعر الخصم */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="سعر الخصم"
                name="discount_price"
                value={formData.discount_price}
                onChange={handleChange}
              />
            </Grid>

            {/* العملة */}
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="العملة"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
              >
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="SYP">SYP</MenuItem>
              </TextField>
            </Grid>

            {/* مدة الرحلة */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="مدة الرحلة بالأيام"
                name="duration_days"
                value={formData.duration_days}
                onChange={handleChange}
              />
            </Grid>

            {/* عدد المشاركين */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="أقصى عدد مشاركين"
                name="max_participants"
                value={formData.max_participants}
                onChange={handleChange}
              />
            </Grid>

            {/* تاريخ البداية */}
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="تاريخ البداية"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid> */}

            {/* تاريخ النهاية */}
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="تاريخ النهاية"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid> */}
             
                {/* status */}
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value="published">published</MenuItem>
                <MenuItem value="draft">draft</MenuItem>
              </TextField>
            </Grid>

             
            {/* الرحلة المميزة */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.is_featured}
                    name="is_featured"
                    onChange={handleChange}
                  />
                }
                label="رحلة مميزة"
              />
            </Grid>

            {/* زر الحفظ */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={loading}
                sx={{
                  borderRadius: 3,
                  px: 5,
                  py: 1.5,
                }}
              >
                {loading ? "جاري الحفظ..." : "إنشاء الرحلة"}
              </Button>
            </Grid>

          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateTrip;
