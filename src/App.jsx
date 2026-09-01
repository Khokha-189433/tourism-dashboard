import { useMemo, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import {  Navigate } from "react-router-dom";
////////////////////////////////////////////////////
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";
////////////////////////////////////////////////////
import CssBaseline from '@mui/material/CssBaseline';
import Login from "./features/Login/Login";
import Dashboard from "./features/pages/Dashboard/dashboard";
import Users from "./features/pages/Users/users";
import Header from "./components/layout/Header";
import './features/Style/AppCss.css';
import ColorModeContext from './contexts/ColorModeContext';
import User from "./features/pages/Users/User/User";
///////////////////////////////////////
import Trips from "./features/pages/Trips/Trips";
import CreateTrip from "./features/pages/Trips/CUDTrip/CreateTrip"
import EditTrip from "./features/pages/Trips/CUDTrip/EditTrip"
import Trip from "./features/pages/Trips/Trip";
//////////////////////////////////////
import Hotels from "./features/pages/Hotels/Hotels";
import Hotel from "./features/pages/Hotels/Hotel";
import CreateHotel from "./features/pages/Hotels/CUD_Hotels/CreateHotel";
import EditHotel from "./features/pages/Hotels/CUD_Hotels/EditHotel";
/////////////////////////////////////
import Destinations from "./features/pages/Destinations/Destinations"
import Destination from "./features/pages/Destinations/Destination"
import CreateDestinations from "./features/pages/Destinations/CUD_Destinations/CreateDestinations";
import EditDestination from "./features/pages/Destinations/CUD_Destinations/EditDestination";
////////////////////////////////////
import Categories from "./features/pages/Categories/Categories";
import Category from "./features/pages/Categories/Category";
import CreateCategory from "./features/pages/Categories/CUD_Categories/CreateCategory";
import EditCategory from "./features/pages/Categories/CUD_Categories/EditCategory";
//////////////////////////////////
import Transports from "./features/pages/Transports/Transports";
import Transport from "./features/pages/Transports/Transport";
import CreateTransport from "./features/pages/Transports/CUD_Transport/CreateTransport";
import EditTransport from "./features/pages/Transports/CUD_Transport/EditTransport";
/////////////////////////////////
import Packages from "./features/pages/Packages/Packages";
import Package from "./features/pages/Packages/Package";
import CreatePackage from "./features/pages/Packages/CUD_Packages/CraetePackages";
import EditPackage from "./features/pages/Packages/CUD_Packages/EditePackages";
/////////////////////////////////
import Bookings from "./features/pages/Bookings/Bookings";
import Booking from "./features/pages/Bookings/Booking";
////////////////////////////////
import Reviews from "./features/pages/Reviews/Reviews";
///////////////////////////////
import Articles from "./features/pages/Articles/Articles"
import Article from "./features/pages/Articles/Article"
import CreateArticle from "./features/pages/Articles/CUD_Articles/CreateArticle";
import EditArticle from "./features/pages/Articles/CUD_Articles/EditArticle";
/////////////////////////////
import Payments from "./features/pages/Payments/Payments";
import Payment from "./features/pages/Payments/Payment";
////////////////////////////
import Reports from "./features/pages/Reports/Reports";
///////////////////////////
import AuditLogs from "./features/pages/AuditLogs/AuditLogs";
function App() {
  //////////Translate////////////
    const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;

    document.documentElement.dir =
      i18n.language === "ar"
        ? "rtl"
        : "ltr";
  }, [i18n.language]);

  ///////////////////////
  const [mode, setMode] = useState('light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <Box
  sx={{
    transition:
      "all 2.35s ease-in-out",
  }}
>
      <ThemeProvider theme={theme}>
      <ColorModeContext.Provider value={{ toggleColorMode }}>
        <CssBaseline />
        <div className="App">
                  <Routes>
            
            <Route path="/" element={<Login />} />
            <Route path="/Trip/:tripId" element={<Trip />} />

            {/*   الصفحات المحمية (تستخدم Header كـ Layout) */}
            <Route element={<Header />}>
              
              {/*  لوحة التحكم (مدير + موظف) */}
              <Route path="dashboard" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Dashboard />
                </ProtectedRoute>
              } />

              {/*  المستخدمين (مدير فقط) */}
              <Route path="/Users" element={
                <ProtectedRoute allowedRoles={["admin"]}><Users /></ProtectedRoute>
              } />
              <Route path="/User/:UserId" element={
                <ProtectedRoute allowedRoles={["admin"]}><User /></ProtectedRoute>
              } />
            
              {/*  الرحلات (مدير فقط) */}
              <Route path="/Trips" element={
                <ProtectedRoute allowedRoles={["admin"]}><Trips /></ProtectedRoute>
              } />
              <Route path="/Trips/CreateTrip" element={
                <ProtectedRoute allowedRoles={["admin"]}><CreateTrip /></ProtectedRoute>
              } />
              <Route path="/EditTrip/:tripId" element={
                <ProtectedRoute allowedRoles={["admin"]}><EditTrip /></ProtectedRoute>
              } />

              {/* لفنادق (مدير فقط) */}
              <Route path="/Hotels" element={
                <ProtectedRoute allowedRoles={["admin"]}><Hotels /></ProtectedRoute>
              } />
              <Route path="/Hotel/:hotelId" element={
                <ProtectedRoute allowedRoles={["admin"]}><Hotel /></ProtectedRoute>
              } />
              <Route path="/CreateHotel" element={
                <ProtectedRoute allowedRoles={["admin"]}><CreateHotel /></ProtectedRoute>
              } />
              <Route path="/EditHotel/:hotelId" element={
                <ProtectedRoute allowedRoles={["admin"]}><EditHotel /></ProtectedRoute>
              } />

              {/*  الوجهات (مدير فقط) */}
              <Route path="/Destinations" element={
                <ProtectedRoute allowedRoles={["admin"]}><Destinations /></ProtectedRoute>
              } />
              <Route path="/Destination/:destinationId" element={
                <ProtectedRoute allowedRoles={["admin"]}><Destination /></ProtectedRoute>
              } />
              <Route path="/destinations/CreateDestinations" element={
                <ProtectedRoute allowedRoles={["admin"]}><CreateDestinations /></ProtectedRoute>
              } />
              <Route path="/destinations/EditDestination/:destinationId" element={
                <ProtectedRoute allowedRoles={["admin"]}><EditDestination /></ProtectedRoute>
              } />

              {/*  التصنيفات (مدير فقط) */}
              <Route path="/Categories" element={
                <ProtectedRoute allowedRoles={["admin"]}><Categories /></ProtectedRoute>
              } />
              <Route path="/Category/:categoryId" element={
                <ProtectedRoute allowedRoles={["admin"]}><Category /></ProtectedRoute>
              } />
              <Route path="/Categories/CreateCategory" element={
                <ProtectedRoute allowedRoles={["admin"]}><CreateCategory /></ProtectedRoute>
              } />
              <Route path="/Categories/EditCategory/:categoryId" element={
                <ProtectedRoute allowedRoles={["admin"]}><EditCategory /></ProtectedRoute>
              } />

              {/*  النقل (مدير فقط) */}
              <Route path="/Transports" element={
                <ProtectedRoute allowedRoles={["admin"]}><Transports /></ProtectedRoute>
              } />
              <Route path="/Transport/:transportId" element={
                <ProtectedRoute allowedRoles={["admin"]}><Transport /></ProtectedRoute>
              } />
              <Route path="/Transports/CreateTransport" element={
                <ProtectedRoute allowedRoles={["admin"]}><CreateTransport /></ProtectedRoute>
              } />
              <Route path="/Transports/EditTransport/:transportId" element={
                <ProtectedRoute allowedRoles={["admin"]}><EditTransport /></ProtectedRoute>
              } />


              {/*  الباقات (مدير فقط) */}
              <Route path="/Packages" element={
                <ProtectedRoute allowedRoles={["admin"]}><Packages /></ProtectedRoute>
              } />
              <Route path="/Package/:packageId" element={
                <ProtectedRoute allowedRoles={["admin"]}><Package /></ProtectedRoute>
              } />
              <Route path="/Packages/CreatePackage" element={
                <ProtectedRoute allowedRoles={["admin"]}><CreatePackage /></ProtectedRoute>
              } />
              <Route path="/Packages/EditPackage/:packageId" element={
                <ProtectedRoute allowedRoles={["admin"]}><EditPackage /></ProtectedRoute>
              } />
                

              {/*  الحجوزات (مدير + موظف) */}
              <Route path="/Bookings" element={
                <ProtectedRoute allowedRoles={["admin", "employee"]}><Bookings /></ProtectedRoute>
              } />
              <Route path="/Booking/:bookingId" element={
                <ProtectedRoute allowedRoles={["admin", "employee"]}><Booking /></ProtectedRoute>
              } />

              {/* (مدير + موظف  (التقييمات  */}
                <Route path="/Reviews" element={
                <ProtectedRoute allowedRoles={["admin", "employee"]}><Reviews /></ProtectedRoute>
              } />
               

               {/*  ( المقالات  ( مدير فقط */}
                  <Route path="/Articles" element={
                <ProtectedRoute allowedRoles={["admin", "employee"]}><Articles /></ProtectedRoute>
              } />
                 <Route path="/Article/:articleId" element={
                <ProtectedRoute allowedRoles={["admin", "employee"]}><Article /></ProtectedRoute>
              } />
              <Route path="/Articles/CreateArticle" element={
                <ProtectedRoute allowedRoles={["admin", "employee"]}><CreateArticle /></ProtectedRoute>
              } />
              <Route path="/Articles/EditArticle/:articleId" element={
                <ProtectedRoute allowedRoles={["admin" , "employee"]}><EditArticle /></ProtectedRoute>
              } />
               {/*  (الدفع   (المدير فقط  */}
               <Route path="/Payments" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Payments />
              </ProtectedRoute>
              } />

              <Route path="/Payment/:PaymentId" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Payment /> {/* سنبنيه في الخطوة التالية */}
              </ProtectedRoute>
              } />
                 "   التقارير المالية  (المدير فقط ) "
              <Route path="/Reports" element={
              <ProtectedRoute allowedRoles={["admin", "employee"]}>
                <Reports />
              </ProtectedRoute>
              } />
              {/*    */}
              <Route path="/AuditLogs" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AuditLogs />
                </ProtectedRoute>
                 } />
  



            </Route>

            {/*  3. المسار الافتراضي (404) - يمنع المسارات العشوائية */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </ColorModeContext.Provider>
    </ThemeProvider>
  
</Box>
  );
}
export default App;

