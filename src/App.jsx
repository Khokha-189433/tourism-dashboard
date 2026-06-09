import { Routes, Route } from "react-router-dom";
import Login from "./features/pages/Login/Login";
import Dashboard from "./features/pages/Dashboard/dashboard";
import Header from "./components/layout/Header";
import Users from "./features/pages/Users/users";
import User from "./features/pages/Users/user";
import './features/Style/AppCss.css';
import Sidebar from "./components/layout/Sidebar"
import { styled } from "@mui/material";


/////////////////////////////////////////////////////
  const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))
/////////////////////////////////////////////////////
function App() {
  return (
       
     <div className="App">
       
        
     
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Users" element={<Users />} />
        <Route path="/User" element={<User />} />
      </Routes>
    </div>
       
         
      
  
  );
}
export default App;

