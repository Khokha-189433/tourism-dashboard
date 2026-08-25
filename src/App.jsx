import { useMemo, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
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
            <Route element={<Header />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="Users" element={<Users />} />
              <Route path="/User" element={<User />} />
              {/* Routes for Trips */}
              <Route path="/Trips" element={<Trips />} />
              <Route path="/Trip/:tripId" element={<Trip />} />
              <Route path="/CreateTrip" element={<CreateTrip />} />
              <Route path="/EditTrip/:tripId" element={<EditTrip />} />
              {/* Routes for Hotels */}
              <Route path="/Hotels" element={<Hotels />} />
              <Route path="/Hotel/:hotelId" element={<Hotel />} />
              <Route path="/CreateHotel" element={<CreateHotel />} />
              <Route path="/EditHotel/:hotelId" element={<EditHotel />} />
               {/* Routes for Destinations */}
               <Route path="/Destinations" element={<Destinations />} />
               <Route path="/Destination/:destinationId" element={<Destination />} />
               <Route path="/destinations/CreateDestinations"  element={<CreateDestinations />} />
               <Route path="/destinations/EditDestination/:destinationId"  element={<EditDestination />} />
               {/* Routes for Categories  */}
               <Route path="/Categories" element={<Categories />} />
               <Route path="/Category/:categoryId" element={<Category />} />
               <Route path="/Categories/CreateCategory"  element={<CreateCategory />} />
               <Route path="/Categories/EditCategory/:categoryId" element={<EditCategory />} />
                {/* Routes for Transports  */}
               <Route path="/Transports" element={<Transports />} />
               <Route path="/Transport/:transportId" element={<Transport />} />
               <Route path="/Transports/CreateTransport" element={<CreateTransport />} />
               <Route path="/Transports/EditTransport/:transportId" element={<EditTransport />} />
                {/* Routes for Packages  */} 
               <Route path="/Packages" element={<Packages />} />
               <Route path="/Package/:packageId" element={<Package />} />
               <Route path="/Packages/CreatePackage" element={<CreatePackage />} />
               <Route path="/Packages/EditPackage/:packageId" element={<EditPackage />} />
               <></>



               <Route  />   
            </Route>
          </Routes>
        </div>
      </ColorModeContext.Provider>
    </ThemeProvider>
  
</Box>
  );
}
export default App;

