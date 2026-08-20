// استيراد React والـ hooks اللازمة لإدارة الحالة وحساب القيم المشتقة.
import React, { useMemo, useState } from "react";

// hook يستخدم لإعادة المستخدم إلى صفحة تسجيل الدخول عند انتهاء الجلسة.
import { useNavigate } from "react-router-dom";

// مكونات Material UI المستخدمة لبناء بطاقة المعرض وقائمة الصور والأزرار.
import { Box, Card, Divider, IconButton, Typography } from "@mui/material";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import DeleteIcon from "@mui/icons-material/Delete";

// مكتبة عرض الصور بالحجم الكامل عند النقر على الصورة.
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// عميل API المشترك الذي يضيف Authorization token إلى الطلبات.
import api from "../../api/refreshToken";

// مكون رفع الصور المشترك، ويدعم صورة واحدة أو عدة صور حسب قيمة multiple.
import ImageUploader from "./ImageUploader";

// معرض عام يمكن استخدامه مع الفنادق والرحلات وأي مورد آخر.
// مسؤولياته: رفع الصور، عرضها، فتحها بالحجم الكامل، وحذفها.
export default function ImageGallery({
  // مصفوفة الصور القادمة من بيانات الفندق أو الرحلة.
  images = [],

  // اسم المورد في مسار API، مثل hotels أو trips.
  resourcePath,

  // رقم المورد الحالي، مثل hotelId أو tripId.
  resourceId,

  // مسار رفع مخصص عند اختلاف endpoint بين الموارد.
  // إذا لم يمرر، يتم إنشاء المسار تلقائيًا باستخدام resourcePath وresourceId.
  uploadPath,

  // مسار حذف مخصص عند اختلاف endpoint الحذف بين الموارد.
  deletePath,

  // اسم الحقل الذي يتوقعه backend داخل FormData.
  // الرحلات تستخدم غالبًا images، والفندق قد يستخدم image.
  fieldName = "images",

  // السماح باختيار عدة ملفات من نافذة اختيار الصور.
  multiple = true,

  // عدد الصور التي تظهر في المعرض فقط، دون حذف الصور من البيانات.
  // مثال: displayLimit={1} لعرض صورة واحدة في الفندق.
  displayLimit,

  // callback لإعادة جلب بيانات المورد بعد نجاح الرفع أو الحذف.
  onRefresh,

  // عنوان المعرض الظاهر للمستخدم.
  title = "معرض الصور",
}) {
  // حالة فتح نافذة تكبير الصورة.
  const [open, setOpen] = useState(false);

  // رقم الصورة الحالية داخل نافذة التكبير.
  const [index, setIndex] = useState(0);

  // أداة الانتقال إلى صفحة تسجيل الدخول عند انتهاء صلاحية التوكن.
  const navigate = useNavigate();

  // تقليل الصور المعروضة فقط حسب displayLimit.
  // لا يتم تعديل مصفوفة images الأصلية، لذلك تبقى كل البيانات متاحة للمكون.
  const visibleImages = useMemo(
    () => (displayLimit ? images.slice(0, displayLimit) : images),
    [images, displayLimit]
  );

  // تحويل بيانات الصورة إلى رابط صالح للعرض داخل المتصفح.
  // يدعم image_url وurl والرابط النصي المباشر.
  const getImageUrl = (image) => {
    const url = image?.image_url || image?.url || image;
    if (!url) return null;

    // الرابط الكامل أو الرابط النسبي الذي يبدأ بـ / لا يحتاج إلى تعديل.
    if (url.startsWith("http") || url.startsWith("/")) return url;

    // إذا أعاد backend اسم الملف فقط، نضيف مجلد الصور العام.
    return `/uploads/${url}`;
  };

  // تجهيز صيغة slides المطلوبة لمكتبة Lightbox.
  // يتم استبعاد الصور التي لا تملك رابطًا صالحًا حتى لا ينتج src فارغ.
  const slides = useMemo(
    () => visibleImages.map((image) => ({ src: getImageUrl(image) })).filter((slide) => slide.src),
    [visibleImages]
  );

  // حذف صورة من المورد الحالي ثم تحديث المعرض.
  const handleDeleteImage = async (image) => {
    // طلب تأكيد قبل تنفيذ الحذف حتى لا يتم حذف الصورة بالخطأ.
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذه الصورة؟")) return;

    // بعض APIs تعيد id وبعضها قد يعيد _id، لذلك ندعم الشكلين.
    const imageId = image.id || image._id;

    // استخدام مسار الحذف المخصص إذا تم تمريره، مثل مسار الفندق.
    // وإلا يتم استخدام مسار الصور العام مع معرف الصورة أو رابطها.
    const url = deletePath
      || (imageId
        ? `/${resourcePath}/${resourceId}/images/${imageId}`
        : `/${resourcePath}/${resourceId}/images?url=${encodeURIComponent(
            image.image_url || image.url
          )}`);

    try {
      // إرسال طلب الحذف إلى backend.
      await api.delete(url);

      // إظهار نتيجة العملية ثم إعادة جلب البيانات من الخادم.
      alert("تم حذف الصورة");
      onRefresh?.();
    } catch (error) {
      // تسجيل تفاصيل الخطأ للمساعدة في معرفة سبب فشل الحذف.
      console.error("خطأ في حذف الصورة:", error.response?.data || error);
      alert("حدث خطأ أثناء حذف الصورة، يرجى المحاولة مرة أخرى.");

      // عند انتهاء الجلسة نحذف التوكنات ونعيد المستخدم لتسجيل الدخول.
      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/");
      }
    }
  };

  // بناء واجهة المعرض: عنوان، زر رفع، قائمة صور، ونافذة تكبير.
  return (
    <Card sx={{ borderRadius: 5, boxShadow: 10, p: 2 }}>
      {/* عنوان القسم الخاص بمعرض الصور. */}
      <Typography variant="h4" fontWeight="bold" sx={{ margin: 2, color: "#7cb8d8" }}>
        <Divider>{title}</Divider>
      </Typography>

      {/* مكون رفع الصور، ويستخدم المسار واسم الحقل الخاصين بالمورد الحالي. */}
      <ImageUploader
        uploadUrl={uploadPath || `/${resourcePath}/${resourceId}/images`}
        fieldName={fieldName}
        multiple={multiple}
        onUploaded={onRefresh}
        onUnauthorized={() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          alert("انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.");
          navigate("/");
        }}
      />

      {/* شبكة الصور الظاهرة للمستخدم. */}
      <ImageList variant="masonry" cols={3} gap={12} sx={{ maxHeight: 600, p: 2 }}>
        {visibleImages.map((image, imageIndex) => {
          // تحويل بيانات الصورة إلى رابط قبل إنشاء عنصر img.
          const imageUrl = getImageUrl(image);

          // تجاهل أي صورة لا تملك رابطًا صالحًا لتجنب src فارغ.
          if (!imageUrl) return null;

          return (
            // كل عنصر يمثل صورة واحدة مع زر حذف فوقها.
            <ImageListItem key={image.id || image._id || imageIndex} sx={{ position: "relative" }}>
              {/* زر حذف الصورة الحالية. */}
              <IconButton
                color="error"
                size="small"
                aria-label="حذف الصورة"
                onClick={() => handleDeleteImage(image)}
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  zIndex: 3,
                  width: 36,
                  height: 36,
                  color: "#fff",
                  backgroundColor: "#d32f2f",
                  boxShadow: 3,
                  "&:hover": { backgroundColor: "#9a0007" },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>

              {/* الصورة التي يمكن النقر عليها لفتحها بالحجم الكامل. */}
              <Box
                component="img"
                src={imageUrl}
                alt={`${title}-${imageIndex + 1}`}
                onError={(event) => {
                  // إخفاء الصورة عند فشل تحميل رابطها بدل عرض عنصر مكسور.
                  event.currentTarget.style.display = "none";
                }}
                onClick={() => {
                  // حفظ رقم الصورة ثم فتح Lightbox عليها.
                  setIndex(imageIndex);
                  setOpen(true);
                }}
                sx={{
                  display: "block",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: 3,
                  cursor: "pointer",
                }}
              />
            </ImageListItem>
          );
        })}
      </ImageList>

      {/* نافذة عرض الصورة بالحجم الكامل والتنقل بين الصور المتاحة. */}
      <Lightbox open={open} close={() => setOpen(false)} slides={slides} index={index} />
    </Card>
  );
}
