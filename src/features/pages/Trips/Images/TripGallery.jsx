import React from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

import {
  Upload,
} from "@mui/icons-material";




export default function TripGallery ({
  trip,
  TripId,
  adminToken,
  getTrip,
}) {

const navigate = useNavigate();
 
  // دالة لمعالجة رابط الصورة: تتحقق ما إذا كانت URL كاملة أو نسبية
  // هذا يدعم حالتي البيانات:
  // 1. URL كاملة: https://example.com/image.jpg
  // 2. URL نسبية: /uploads/image.jpg أو uploads/image.jpg
  // const getImageUrl = (image) => {
  //   if (!image.image_url) return '';
  //   // إذا كانت URL كاملة (تبدأ بـ http)، استخدمها مباشرة
  //   if (image.image_url.startsWith('http')) {
  //     return image.image_url;
  //   }
  
  //   return image.image_url.startsWith('/') ? image.image_url : `/uploads/${image.image_url}`;
  // };
  
  // دالة  لإرجاع رابط الصورة
function getImageUrl(image) {
  if (!image || !image.image_url) return ""; // إذا لا توجد صورة، إرجاع نص فارغ

  const url = image.image_url;

  // إذا كان الرابط كاملًا (يبدأ بـ http) أعده كما هو
  if (url.startsWith("http")) return url;

  // إذا كان الرابط يبدأ بشرطة مائلة، اعتبره رابطًا نسبيًا صالحًا
  if (url.startsWith("/")) return url;

  // خلاف ذلك أضف بادئة المجلد الذي يخزن الصور
  return "/uploads/" + url;
}

  // رفع صورة
  const handleUploadImage = async (e) => {

    const file = e.target.files[0];

    if (!file)
      {
      return ;
      } 

    try {
      if (!adminToken) {
        alert("يرجى تسجيل الدخول مرة أخرى");
        localStorage.removeItem("adminToken");
        navigate("/");
        return;
      }

      const formData = new FormData();
      formData.append("images", file);

      await axios.post(
        `/api/trips/${TripId}/images`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      alert("تم رفع الصورة");

      // إعادة تحميل بيانات الرحلة
      getTrip();
    } catch (error) {
      console.error(error.response?.data || error);
      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        alert(
          error.response?.data?.message === "Token expired"
            ? "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى."
            : "غير مصرح لك. يرجى تسجيل الدخول."
        );
        navigate("/");
        return;
      }
     
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 5,
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          fontWeight="bold"
          mb={3}
        >
          معرض الصور
        </Typography>

        {/* الصور */}
        <Grid container spacing={2} mb={3}>


          {trip?.images?.map((image, index) => (
            <Grid item xs={6} key={index}>
              <Box
                component="img"
                // استخدام دالة getImageUrl لضمان الحصول على رابط صورة صحيح
                src={getImageUrl(image)}
                alt={`trip-image-${index}`}
                // معالج الخطأ: إذا فشل تحميل الصورة، عرّض صورة بديلة
                // هذا يحسن تجربة المستخدم بدلاً من عرض صورة معطلة
                onError={(e) => {
                  console.error(`Failed to load image: ${e.target.src}`);
                  e.target.src = 'https://via.placeholder.com/300?text=صورة';
                }}
                sx={{
                  width: "100%",
                  height: 140,
                  objectFit: "cover",
                  borderRadius: 3,
                }}
              />

            </Grid>
          ))}

        </Grid>

        {/* زر رفع صورة */}
        <Button
          fullWidth
          variant="contained"
          component="label"
          startIcon={<Upload />}
          sx={{
            py: 1.5,
            borderRadius: 3,
          }}
        >
          إضافة صورة

          <input
            hidden
            type="file"
            onChange={handleUploadImage}
          />

        </Button>

      </CardContent>
    </Card>
  );

  
}

