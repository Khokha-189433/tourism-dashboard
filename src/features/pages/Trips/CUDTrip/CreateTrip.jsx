import React, { useState } from "react";
import TripOriginIcon from '@mui/icons-material/TripOrigin';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
///////////////////////////////////

/////////////////////////////////



import { useNavigate } from "react-router-dom";
import api from "../../../../api/refreshToken";
import { useTranslation } from "react-i18next";

const CreateTrip = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
    //    اذا كان العنصر من نوع type="checkbox" => استخدم checked، وإلا استخدم value في حالة العناصر الأخرى مثل النصوص والأرقام. 
    // تعتبر ال name هي المفتاح الذي يحدد أي حقل من formData سيتم تحديثه، بينما value أو checked هو القيمة الجديدة التي سيتم تعيينها لهذا الحقل.
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
        alert(t("requiredTitle"));
        setLoading(false);
        return;
      }

      if (!formData.short_description_ar || !formData.short_description_en) {
        alert(t("requiredShortDescription"));
        setLoading(false);
        return;
      }

      if (!formData.price) {
        alert(t("requiredPrice"));
        setLoading(false);
        return;
      }

      if (!formData.currency) {
        alert(t("requiredCurrency"));
        setLoading(false);
        return;
      }

      if (!formData.duration_days) {
        alert(t("requiredDuration"));
        setLoading(false);
        return;
      }

      if (!formData.max_participants) {
        alert(t("requiredParticipants"));
        setLoading(false);
        return;
      }

      //
     /// تجهيز البيانات للإرسال والتأكد من تحويل الأنواع بشكل صحيح 
      const payload = {
        ...formData,
        price: Number(formData.price),
        discount_price: formData.discount_price ? Number(formData.discount_price) : null,
        duration_days: Number(formData.duration_days),
        max_participants: Number(formData.max_participants),
        is_featured: Boolean(formData.is_featured),
      };

      console.log("إرسال البيانات:", payload);

      const response = await api.post(
        "/trips",
        payload,
        {
          headers: {
            "Content-Type": "application/json",

          },
        }
      );

      console.log("response.data:", response.data);

      

   ///هذا السطر ينقل المستخدم من صفحة إنشاء الرحلة إلى صفحة عرض الرحلات ويُمرّر معه رسالة نجاح.
      navigate("/Trips", {  // هذا ينقل التطبيق إلى المسار /Trips  //يستخدم react-router-dom، لذلك يحدث التنقل داخل التطبيق بدون إعادة تحميل الصفحة.
        state: {
          message: t("tripCreated"),
          severity: "success",
        },
      });
    } catch (error) {
      console.error("خطأ مفصل:", error.response?.data || error.message);
    
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
            <TripOriginIcon
              sx={{
                color: "#6ea3dc",
                fontSize: 30,
              }}
            />

            <Typography variant="h4" fontWeight="bold">
              {t("addTrip")}
            </Typography>
          </Box>

          <Typography color="text.secondary">
            {t("addNewTrip")}
          </Typography>
        </Box>
      </Box>











      <Card
        sx={{
          maxWidth: 1200,
          mx: "auto",
          borderRadius: 4,
        }}
      >
        <CardContent>

          {/* العنوان */}
          <Typography  mb={4} sx={{margin:4 , fontSize:27 , color:"#4286ae"}}>
            {t("createNewTrip")}
          </Typography>

          <Grid container spacing={3}>
            {/* عنوان عربي */}
            <Grid  xs={12} md={6}>
              <TextField
                fullWidth
                label={t("tripTitleArabic")}
                name="title_ar"
                value={formData.title_ar}
                onChange={handleChange}
              />
            </Grid>

            {/* عنوان إنجليزي */}
            <Grid  xs={12} md={6}>
              <TextField
                fullWidth
                label={t("tripTitleEnglish")}
                name="title_en"
                value={formData.title_en}
                onChange={handleChange}
              />
            </Grid>

            {/* وصف قصير عربي */}
            <Grid  xs={12}>
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

            {/* وصف قصير إنجليزي */}
            <Grid  xs={12}>
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

            {/* وصف عربي */}
            <Grid  xs={12}>
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

            {/* وصف إنجليزي */}
            <Grid  xs={12}>
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

            {/* السعر */}
            <Grid  xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label={t("price")}
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </Grid>

            {/* سعر الخصم */}
            <Grid  xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label={t("discountPrice")}
                name="discount_price"
                value={formData.discount_price}
                onChange={handleChange}
              />
            </Grid>

            {/* العملة */}
            <Grid  xs={12} md={4}>
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

            {/* مدة الرحلة */}
            <Grid  xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label={t("tripDuration")}
                name="duration_days"
                value={formData.duration_days}
                onChange={handleChange}
              />
            </Grid>

            {/* عدد المشاركين */}
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label={t("maxParticipants")}
                name="max_participants"
                value={formData.max_participants}
                onChange={handleChange}
              />
            </Grid>

             
                {/* status */}
            <Grid  xs={12} md={4}>
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

             
            {/* الرحلة المميزة */}
            <Grid  xs={12}>
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

            {/* زر الحفظ */}
            <Grid  xs={12}>
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
                {loading ? t("saving") : t("createTrip")}
              </Button>
            </Grid>

          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateTrip;
