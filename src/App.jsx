import { useMemo, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
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

function App() {
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


            </Route>
          </Routes>
        </div>
      </ColorModeContext.Provider>
    </ThemeProvider>
  );
}
export default App;

