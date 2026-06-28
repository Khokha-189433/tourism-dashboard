import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


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
import api from "../../../../api/refreshToken";



export default function TripGallery ({
  trip,
  TripId,
  getTrip,
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const slides = trip?.images?.map((image) => ({
    src: getImageUrl(image),
  })) || [];

  
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
    

      const formData = new FormData();
      formData.append("images", file);

      await api.post(
        `/trips/${TripId}/images`,
        formData,
      );

      alert("تم رفع الصورة");

      // إعادة تحميل بيانات الرحلة
      getTrip();
    } catch (error) {
      console.error(error.response?.data || error);
      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken");
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

   

    const imageId = image.id || image._id;

    const url = imageId
      ? `/trips/${TripId}/images/${imageId}`
      : `/trips/${TripId}/images?url=${encodeURIComponent(image.image_url)}`;

    try {
      await api.delete(url);

      alert("تم حذف الصورة");
      getTrip();
    } catch (error) {
      console.error(error.response?.data || error);
      alert("حدث خطأ أثناء حذف الصورة، يرجى المحاولة مرة أخرى.");
      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken");
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
          variant="h4"
          fontWeight="bold"
          sx={{margin:4 , color:"#7cb8d8" , fontFamily:"math" ,}}
        >
            <Divider>  معرض الصور </Divider>
        
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

