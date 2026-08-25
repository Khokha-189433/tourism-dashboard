// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../../../api/refreshToken"

// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Container,
//   TextField,
//   Typography,
// } from "@mui/material";

// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import SaveIcon from "@mui/icons-material/Save";
// import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
// import { useTranslation } from "react-i18next";

// export default function CreateDestinations() {
//   const navigate = useNavigate();
//   const { t } = useTranslation();

//   const [formData, setFormData] = useState({
//     name_ar: "",
//     name_en: "",
//     country_ar: "",
//     country_en: "",
//     country_code: "",
//   });

//   const [loading, setLoading] = useState(false);

//   // تغيير قيم الحقول
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   // إرسال البيانات
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // التحقق من الحقول
//     if (
//       !formData.name_ar ||
//       !formData.name_en ||
//       !formData.country_ar ||
//       !formData.country_en ||
//       !formData.country_code
//     ) {
//       alert(t("requiredDestinationFields"));
//       return;
//     }

//     try {
//       setLoading(true);

//       await api.post("/destinations", formData);

//       alert(t("destinationCreated"));

//       // العودة إلى صفحة الوجهات
//       navigate("/Destinations");
//     } catch (error) {
//       console.error("Error creating destination:", error);

//       alert(t("destinationCreateError"));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container maxWidth="md" sx={{ py: 5 }}>
//       {/* العنوان */}
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           mb: 4,
//         }}
//       >
//         <Button
//           startIcon={<ArrowBackIcon />}
//           onClick={() => navigate("/Destinations")}
//         >
//           {t("back")}
//         </Button>

//         <Box sx={{ textAlign: "right" }}>
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "flex-end",
//               gap: 1,
//             }}
//           >
//             <FlightTakeoffIcon
//               sx={{
//                 color: "#6ea3dc",
//                 fontSize: 30,
//               }}
//             />

//             <Typography variant="h4" fontWeight="bold">
//               {t("addDestination")}
//             </Typography>
//           </Box>

//           <Typography color="text.secondary">
//             {t("addNewDestination")}
//           </Typography>
//         </Box>
//       </Box>

//       {/* الفورم */}
//       <Card
//         sx={{
//           borderRadius: 4,
//           boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
//         }}
//       >
//         <CardContent sx={{ p: 4 }}>
//           <Box
//             component="form"
//             onSubmit={handleSubmit}
//             dir="rtl"
//           >
//             {/* اسم الوجهة */}
//             <Typography
//               variant="h6"
//               fontWeight="bold"
//               sx={{margin:4 , fontSize:27 , color:"#4286ae"}}
//             >
//               {t("destinationInformation")}
//             </Typography>

//             <Box
//               sx={{
//                 display: "grid",
//                 gridTemplateColumns: {
//                   xs: "1fr",
//                   sm: "1fr 1fr",
//                 },
//                 gap: 2,
//               }}
//             >
//               <TextField
//                 label={t("destinationNameArabic")}
//                 name="name_ar"
//                 value={formData.name_ar}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//                 placeholder={t("cairoExample")}
//               />

//               <TextField
//                 label={t("destinationNameEnglish")}
//                 name="name_en"
//                 value={formData.name_en}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//                 placeholder={t("cairoExampleEnglish")}
//                 dir="ltr"
//               />

//               <TextField
//                 label={t("countryNameArabic")}
//                 name="country_ar"
//                 value={formData.country_ar}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//                 placeholder={t("egyptExample")}
//               />

//               <TextField
//                 label={t("countryNameEnglish")}
//                 name="country_en"
//                 value={formData.country_en}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//                 placeholder={t("egyptExampleEnglish")}
//                 dir="ltr"
//               />

//               <TextField
//                   label={t("countryCode")}
//                   name="country_code"
//                   value={formData.country_code}
//                   onChange={handleChange}
//                   fullWidth
//                   required
//                   placeholder={t("countryCodeExample")}
//                   dir="ltr"
//                   slotProps={{
//                     htmlInput: {
//                       maxLength: 3,
//                       style: {
//                         textTransform: "uppercase",
//                       },
//                     },
//                   }}
//                 />
//             </Box>

//             {/* الأزرار */}
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "flex-start",
//                 gap: 2,
//                 mt: 4,
//               }}
//             >
//               <Button
//                 type="submit"
//                 variant="contained"
//                 startIcon={<SaveIcon />}
//                 disabled={loading}
//                 sx={{
//                   borderRadius: 3,
//                   px: 4,
//                   py: 1.3,
//                   textTransform: "none",
//                 }}
//               >
//                 {loading ? t("saving") : t("saveDestination")}
//               </Button>

//               <Button
//                 variant="outlined"
//                 onClick={() => navigate("/destinations")}
//                 disabled={loading}
//                 sx={{
//                   borderRadius: 3,
//                   px: 4,
//                   py: 1.3,
//                   textTransform: "none",
//                 }}
//               >
//                 {t("cancel")}
//               </Button>
//             </Box>
//           </Box>
//         </CardContent>
//       </Card>
//     </Container>
//   );
// }



import React from "react";
import DestinationForm from "./DestinationForm";

export default function CreateDestination() {
  return (
    <DestinationForm mode="create" />
  );
}