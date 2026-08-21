import React, { useState , useEffect } from "react";
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
import HotelIcon from '@mui/icons-material/Hotel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
import api from "../../../../api/refreshToken";
import { useTranslation } from "react-i18next";

// مكون إنشاء فندق جديد وإرسال بياناته إلى الخادم.
export default function CreateHotel() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();

  // حالة التحميل لتعطيل زر الإرسال أثناء تنفيذ الطلب.
  const [loading, setLoading] = useState(false);

  // قائمة الوجهات التي يتم جلبها من الخادم لعرضها في القائمة المنسدلة.
  const [ destinations , setDestinations ] = useState([]);

  // الحالة التي تحتوي على جميع بيانات الفندق التي يدخلها المستخدم.
  const [hotelData, setHotelData] = useState({

    name_ar: "",
    name_en: "",
    description_ar: "",
    description_en: "",

    address_ar: "",
    address_en: "",

    destination_id: "",

    stars: 5,

    price_per_night: "",

    currency: "SYP",

    contact_phone: "",

    contact_email: "",

    total_rooms: "",

    available_rooms: "",

    amenities: [],
  });
  // جلب الوجهات عند فتح صفحة إنشاء الفندق.
  useEffect(() => {
  const fetchDestinations = async () => {
    try {
      // طلب قائمة الوجهات من الخادم.
      const response = await api.get("/destinations");

      // حفظ البيانات سواء أعادها الخادم داخل data أو أعادها مباشرة.
      setDestinations(response.data.data || response.data);
    } catch (error) {
      // تسجيل الخطأ في حال فشل تحميل الوجهات.
      console.error("خطأ في جلب الوجهات:", error);
    }
  };

  // تنفيذ جلب الوجهات مرة واحدة عند تحميل المكون.
  fetchDestinations();
}, []);


  // تحديث قيمة أي حقل في النموذج عند تغييره.
  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;

    // الحقول العادية تعتمد على value، ومربعات الاختيار تعتمد على checked.
    // يتم حصر عدد النجوم بين 0 و5 حتى لا تدخل قيمة غير مسموحة.
    setHotelData({
      ...hotelData,
      [name]: type === "checkbox"
        ? checked
        : name === "stars"
          ? Math.min(5, Math.max(0, Number(value)))
          : value,
    });
  };

  // إضافة الخدمة إلى القائمة أو حذفها إذا كانت محددة مسبقًا.
  const handleAmenityChange = (amenity) => {
    // قراءة قائمة الخدمات الحالية والتحقق من وجود الخدمة المطلوبة.
    const amenities = hotelData.amenities;
    const hasAmenity = amenities.includes(amenity);

    if (hasAmenity) {
      // حذف الخدمة من القائمة عند إلغاء تحديدها.
      const newAmenities = amenities.filter((item) => item !== amenity);
      setHotelData({
        ...hotelData,
        amenities: newAmenities,
      });
      return;
    }

    // إضافة الخدمة إلى القائمة عند تحديدها.
    const newAmenities = [...amenities, amenity];
    setHotelData({
      ...hotelData,
      amenities: newAmenities,
    });
  };

  // التحقق من البيانات وتجهيزها ثم إرسالها إلى API إنشاء الفنادق.
  const handleSubmit = async (e) => {
    // منع المتصفح من إعادة تحميل الصفحة عند إرسال النموذج.
    e.preventDefault();

    try {
      // منع إرسال الطلب إذا لم يسجل المستخدم الدخول أو لم يعد التوكن محفوظًا.
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert(t("sessionExpired"));
        navigate("/");
        return;
      }

      // إظهار حالة التحميل أثناء تنفيذ الطلب.
      setLoading(true);

      // التحقق من أسماء الفندق بالعربية والإنجليزية.
      if (!hotelData.name_ar || !hotelData.name_en) {
        alert(t("requiredHotelName"));
        setLoading(false);
        return;
      }
      // التحقق من وجود الوصف باللغتين.
      if (!hotelData.description_ar || !hotelData.description_en) {
        alert(t("requiredHotelDescription"));
        setLoading(false);
        return;
      }
      // التحقق من إدخال سعر الليلة.
      if (!hotelData.price_per_night) {
        alert(t("requiredPricePerNight"));
        setLoading(false);
        return;
      }
      // التحقق من اختيار العملة.
      if (!hotelData.currency) {
        alert(t("requiredCurrency"));
        setLoading(false);
        return;
      }
      // التحقق من إدخال رقم الهاتف.
      if (!hotelData.contact_phone) {
        alert(t("requiredPhone"));
        setLoading(false);
        return;
      }
      // التحقق من إدخال البريد الإلكتروني.
      if (!hotelData.contact_email) {
        alert(t("requiredEmail"));
        setLoading(false);
        return;
      }
      // التحقق من إدخال العدد الإجمالي للغرف.
      if (!hotelData.total_rooms) {
        alert(t("requiredTotalRooms"));
        setLoading(false);
        return;
      }
      // التحقق من إدخال عدد الغرف المتاحة.
      if (!hotelData.available_rooms) {
        alert(t("requiredAvailableRooms"));
        setLoading(false);
        return;
      }
      // التأكد من أن الوجهة موجودة وأن رقمها صالح.
      if (!hotelData.destination_id || Number(hotelData.destination_id) <= 0) {
        alert(t("requiredDestination"));
        setLoading(false);
        return;
      }
      // التأكد من أن تقييم الفندق لا يتجاوز خمس نجوم.
      if (Number(hotelData.stars) < 0 || Number(hotelData.stars) > 5) {
        alert(t("starsRange"));
        setLoading(false);
        return;
      }

      // إنشاء payload يحتوي على حقول الفندق وتحويل القيم الرقمية إلى أرقام.
      const payload = {
            name_ar: hotelData.name_ar,
            name_en: hotelData.name_en,
            description_ar: hotelData.description_ar,
            description_en: hotelData.description_en,
            address_ar: hotelData.address_ar,
            address_en: hotelData.address_en,
            destination_id: Number(hotelData.destination_id),
            stars: Number(hotelData.stars),
            price_per_night: Number(hotelData.price_per_night),
            currency: hotelData.currency,
            contact_phone: hotelData.contact_phone,
            contact_email: hotelData.contact_email,
            total_rooms: Number(hotelData.total_rooms),
            available_rooms: Number(hotelData.available_rooms),
            amenities: hotelData.amenities,
   };

      // طباعة البيانات للمراجعة أثناء التطوير قبل إرسالها.
      console.log("إرسال البيانات:", payload);

      // إرسال بيانات الفندق إلى endpoint الخاص بإنشاء الفنادق.
      const response = await api.post(
        "/hotels",
        payload,
        {
          headers:{
            "Content-Type": "application/json",
          },
        }
      );

      // طباعة استجابة الخادم للتأكد من نجاح العملية أثناء التطوير.
      console.log("response.data:", response.data);

      // الانتقال إلى قائمة الفنادق مع تمرير رسالة نجاح.
      navigate("/Hotels", {
        state: {
          message: t("hotelCreated"),
          severity: "success",
        },
      });
    } catch (error) {
      // عرض تفاصيل أخطاء التحقق أو أخطاء الخادم في console.
      console.log("Validation Errors:", error.response?.data?.errors);
      console.log("Full Error:", error.response?.data);

    
    } finally {
      // إنهاء حالة التحميل سواء نجح الطلب أو فشل.
      setLoading(false);
    }
  };


  // واجهة النموذج التي تجمع معلومات الفندق وتعرض عناصر الإدخال.
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "90%",
        margin: "30px auto",
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
          onClick={() => navigate("/Hotels")}
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
            <HotelIcon
              sx={{
                 color: "#6ea3dc",
                fontSize: 30,
              }}
            />

            <Typography variant="h4" fontWeight="bold">
              {t("addHotel")}
            </Typography>
          </Box>

          <Typography color="text.secondary">
              {t("addNewHotel")}
          </Typography>
        </Box>
      </Box>

      {/* بطاقة المعلومات الأساسية: الأسماء والأوصاف والعناوين. */}
      <Card sx={{ mb: 3 }}>

<CardContent sx={{margin:1}}>

{/* عنوان قسم المعلومات الأساسية للفندق. */}
<Typography  mb={2} sx={{margin:4 , fontSize:27 , color:"#4286ae"}} >
  {t("hotelInformation")}
</Typography>

{/* حقول أسماء الفندق والأوصاف والعناوين بالعربية والإنجليزية. */}
<Grid container spacing={2}>

<Grid  xs={12} md={6}>
<TextField
fullWidth
label={t("hotelNameArabic")}
name="name_ar"
value={hotelData.name_ar}
onChange={handleInputChange}
/>
</Grid>

<Grid  xs={12} md={6}>
<TextField
fullWidth
label={t("hotelNameEnglish")}
name="name_en"
value={hotelData.name_en}
onChange={handleInputChange}
/>
</Grid>

<Grid  xs={12}>
<TextField
fullWidth
multiline
rows={3}
label={t("descriptionArabic")}
name="description_ar"
value={hotelData.description_ar}
onChange={handleInputChange}
/>
</Grid>

<Grid  xs={12}>
<TextField
fullWidth
multiline
rows={3}
label={t("descriptionEnglish")}
name="description_en"
value={hotelData.description_en}
onChange={handleInputChange}
/>
</Grid>

<Grid  xs={12} md={6}>
<TextField
fullWidth
label={t("addressArabic")}
name="address_ar"
value={hotelData.address_ar}
onChange={handleInputChange}
/>
</Grid>

<Grid  xs={12} md={6}>
<TextField
fullWidth
label={t("addressEnglish")}
name="address_en"
value={hotelData.address_en}
onChange={handleInputChange}
 placeholder={t("hotelAddressPlaceholder")}
/>
</Grid>

</Grid>

</CardContent>

</Card>
{/* \\\\\\\\\ */}
<Card sx={{ mb: 3 }}>

<CardContent>

{/* عنوان قسم تفاصيل الفندق. */}
<Typography  mb={2}   sx={{margin:4 , fontSize:27 , color:"#4286ae"}} >
 {t("hotelDetails")}
</Typography>

{/* حقول الوجهة وعدد النجوم وسعر الليلة والعملة. */}
<Grid container spacing={2}>

<Grid xs={12} md={6}>
  <TextField
    fullWidth
    select
    label={t("destination")}
    name="destination_id"
    value={hotelData.destination_id}
    onChange={handleInputChange}
    placeholder={t("destinationPlaceholder")}
  >
    <MenuItem value="">{t("selectDestination")}</MenuItem>

    {destinations.map((destination) => (
      <MenuItem key={destination.id} value={destination.id}>
        {i18n.language === "ar"
          ? destination.name_ar || destination.name_en
          : destination.name_en || destination.name_ar}
      </MenuItem>
    ))}
  </TextField>
</Grid>

<Grid  xs={12} md={6}>
<TextField
fullWidth
label={t("stars")}
name="stars"
type="number"
slotProps={{
  htmlInput: {
    min: 0,
    max: 5,
    step: 1,
  },
}}

value={hotelData.stars}
onChange={handleInputChange}
/>
</Grid>

<Grid  xs={12} md={6}>
<TextField
fullWidth
label={t("pricePerNight")}
name="price_per_night"
type="number"
value={hotelData.price_per_night}
onChange={handleInputChange}
/>
</Grid>

<Grid  xs={12} md={6}>
<TextField
  fullWidth
  select
  label={t("currency")}
  name="currency"
  value={hotelData.currency}
  onChange={handleInputChange}
>
  <MenuItem value="USD">USD</MenuItem>
  <MenuItem value="SYP">SYP</MenuItem>
</TextField>
</Grid>

</Grid>

</CardContent>

</Card>

{/* \\\\\\\\\\\ */}
<Card sx={{ mb: 3 }}>

  <CardContent>

    {/* عنوان قسم معلومات التواصل. */}
    <Typography  mb={2}  sx={{margin:4 , fontSize:27 , color:"#4286ae"}} >
      {t("contactInformation")}
    </Typography>

    {/* حقلا رقم الهاتف والبريد الإلكتروني. */}
    <Grid container spacing={2}>

      <Grid  xs={12} md={6}>
        <TextField
          fullWidth
          label={t("phone")}
          name="contact_phone"
          value={hotelData.contact_phone}
          onChange={handleInputChange}
        />
      </Grid>

      <Grid  xs={12} md={6}>
        <TextField
          fullWidth
          label={t("email")}
          name="contact_email"
          value={hotelData.contact_email}
          onChange={handleInputChange}
        />
      </Grid>

    </Grid>

  </CardContent>

</Card>

{/* \\\\\\\\\\\*/}
<Card sx={{ mb: 3 }}>

  <CardContent>

    {/* عنوان قسم الغرف. */}
    <Typography  mb={2} sx={{margin:4 , fontSize:27 , color:"#4286ae"}} >
      {t("rooms")}
    </Typography>

    {/* إدخال عدد الغرف الكلي وعدد الغرف المتاحة. */}
    <Grid container spacing={2}>

      <Grid  xs={12} md={6}>
        <TextField
          fullWidth
          label={t("totalRooms")}
          name="total_rooms"
          type="number"
          value={hotelData.total_rooms}
          onChange={handleInputChange}
        />
      </Grid>

      <Grid  xs={12} md={6}>
        <TextField
          fullWidth
          label={t("availableRooms")}
          name="available_rooms"
          type="number"
          value={hotelData.available_rooms}
          onChange={handleInputChange}
        />
      </Grid>

    </Grid>

  </CardContent>

</Card>
{/* \\\\\\\\\\\ */}
<Card sx={{ mb: 3 }}>

  <CardContent>

    {/* عنوان قسم الخدمات المتوفرة في الفندق. */}
    <Typography  mb={2}  sx={{margin:4 , fontSize:27 , color:"#4286ae"}}>
      {t("availableServices")}
    </Typography>

    {/* كل مربع اختيار يضيف خدمة أو يحذفها من قائمة amenities. */}
    <Grid container>

      <Grid  xs={6} md={3}>
        <FormControlLabel
          control={
            <Checkbox
              checked={hotelData.amenities.includes("wifi")}
              onChange={() => handleAmenityChange("wifi")}
            />
          }
          label={t("wifi")}
        />
      </Grid>

      <Grid  xs={6} md={3}>
        <FormControlLabel
          control={
            <Checkbox
              checked={hotelData.amenities.includes("pool")}
              onChange={() => handleAmenityChange("pool")}
            />
          }
          label={t("pool")}
        />
      </Grid>

      <Grid  xs={6} md={3}>
        <FormControlLabel
          control={
            <Checkbox
              checked={hotelData.amenities.includes("spa")}
              onChange={() => handleAmenityChange("spa")}
            />
          }
          label={t("spa")}
        />
      </Grid>

      <Grid  xs={6} md={3}>
        <FormControlLabel
          control={
            <Checkbox
              checked={hotelData.amenities.includes("restaurant")}
              onChange={() => handleAmenityChange("restaurant")}
            />
          }
          label={t("restaurant")}
        />
      </Grid>

      <Grid  xs={6} md={3}>
        <FormControlLabel
          control={
            <Checkbox
              checked={hotelData.amenities.includes("parking")}
              onChange={() => handleAmenityChange("parking")}
            />
          }
          label={t("parking")}
        />
      </Grid>

    </Grid>

  </CardContent>

</Card>
{/* \\\\\\\\\\\\ */}
{/* منطقة إرسال النموذج وتعطيل الزر أثناء التحميل. */}
<Box
  sx={{
    display: "flex",
    justifyContent: "center",
    mb: 5,

  }}
>
  <Button
    type="submit"
    variant="contained"
    size="large"
    disabled={loading}
    sx={{
      px: 3.2,
      
      py: 1.5,
      borderRadius: 2,
      fontSize: 16,
     
    }}
  >
    {loading ? t("creatingHotel") : t("createHotel")}
  </Button>
   <Button
      variant="outlined"
      onClick={() => navigate("/Hotels")}
      disabled={loading}
      sx={{
        borderRadius: 3,
        px: 3.2,
        py: 1.3,
        textTransform: "none",
        marginLeft:5
      }}
    >
      {t("cancel")}
 </Button>
</Box>
{/* \\\\\\\\\\\\ */}
</Box>
  );
}