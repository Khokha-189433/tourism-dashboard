import { useMemo, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from "./features/pages/Login/Login";
import Dashboard from "./features/pages/Dashboard/dashboard";
import Users from "./features/pages/Users/users";
import Header from "./components/layout/Header";
import './features/Style/AppCss.css';
import ColorModeContext from './contexts/ColorModeContext';
import User from "./features/pages/Users/User";
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


            </Route>
          </Routes>
        </div>
      </ColorModeContext.Provider>
    </ThemeProvider>
  );
}
export default App;

