import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import {
  Upload,
  Delete,
  
} from "@mui/icons-material";
///////////////////////////////
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";



export default function TripGallery ({
  trip,
  TripId,
  adminToken,
  getTrip,
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const slides = trip?.images?.map((image) => ({
    src: getImageUrl(image),
  })) || [];

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

  const handleDeleteImage = async (image) => {
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذه الصورة؟")) return;

    if (!adminToken) {
      alert("يرجى تسجيل الدخول مرة أخرى");
      localStorage.removeItem("adminToken");
      navigate("/");
      return;
    }

    const imageId = image.id || image._id;

    const url = imageId
      ? `/api/trips/${TripId}/images/${imageId}`
      : `/api/trips/${TripId}/images?url=${encodeURIComponent(image.image_url)}`;

    try {
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      alert("تم حذف الصورة");
      getTrip();
    } catch (error) {
      console.error(error.response?.data || error);
      alert("حدث خطأ أثناء حذف الصورة، يرجى المحاولة مرة أخرى.");
      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/");
      }
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 5,
        boxShadow:10 ,
      }}
    
    >
       <Typography
          variant="h5"
          fontWeight="bold"
          sx={{margin:2 }}
        >
          معرض الصور
        </Typography>
        <Divider />
           <Button
          variant="contained"
          component="label"
          startIcon={<Upload />}
          sx={{
            py: 1.5,
            borderRadius: 3,
            marginTop:1
          }}
        >
          إضافة صورة

          <input
            hidden
            type="file"
            onChange={handleUploadImage}
          />

        </Button>
       
        {/* الصور */}
  <Box  sx={{  padding:1 , borderRadius:10  , height:600 }}  >
     <ImageList sx={{  padding:4 , borderRadius:1  , height:600 }}  variant="masonry"
      cols={3}
      gap={12} >
    
          {trip?.images?.map((image, index) => (
             <ImageListItem key={index} sx={{ width: 250,  padding:0,  }}>
               <IconButton
                color="primary"
                 size="small"
                 onClick={() => handleDeleteImage(image)}
                 sx={{
                   position: "absolute",
                   background:"#2e4e6d44",
                   top: 9,
                   right: 8,
                   zIndex: 2  }}
               >
                 <Delete fontSize="small"    />
               </IconButton>
              <Box
                component="img"
                sx={{
                  boxShadow: 4,
                  display: "block",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: 4,
                  cursor: "pointer",
                  transition: "0.2s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
                // استخدام دالة getImageUrl لضمان الحصول على رابط صورة صحيح
                src={getImageUrl(image)}
                alt={`trip-image-${index}`}
                // معالج الخطأ: إذا فشل تحميل الصورة، عرّض صورة بديلة
                onError={(e) => {
                  console.error(`Failed to load image: ${e.target.src}`);
                  e.target.src = 'https://via.placeholder.com/300?text=صورة';
                }}
                onClick={() => {
                  setIndex(index);
                  setOpen(true);
                }}
              />
           </ImageListItem>
             
          ))}

     
     </ImageList>

          </Box>
          {/* ولتكبير لاستطيع فتح الصورة  */}
            <Lightbox
              open={open}
              close={() => setOpen(false)}
              slides={slides}
              index={index}
            />
           

    </Card>
  );

  
}

