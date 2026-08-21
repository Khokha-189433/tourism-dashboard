import React from 'react'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { ColorLens, LogoutOutlined } from '@mui/icons-material';
import ListItemText from '@mui/material/ListItemText';

import { Link, useNavigate} from 'react-router-dom';
import api from '../../api/refreshToken';
import { useTranslation } from 'react-i18next';


export default function LogOut() {
  const { t } = useTranslation();

  const navgiate = useNavigate();
  // دالة تسجيل الخروج: تحذف التوكن وتعيد التوجيه للصفحة الرئيسية
const  handleLogout = async ()=>
 {
  if(window.confirm(t("confirmLogout")))
  {
      try{
       const res = await api.post("/auth/logout" , {} 
       );
       console.log(res)
  }catch(err)
  {
    console.log(err)
  }finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navgiate("/");
  }

} }

  return (
    <>    
        <Box sx={{ flexGrow: 1 }} />
        <List>
        <ListItem disablePadding>
            <ListItemButton 
              onClick={handleLogout}
              sx={{
                justifyContent: open ? "center" : "inherit",
                color: "rgba(250, 239, 239, 0.945)",
                paddingLeft:"38px",
              }}
            >
              <ListItemIcon sx={{ color: "rgba(234, 87, 87, 0.945)" }}>
                <LogoutOutlined />
              </ListItemIcon>
              <ListItemText 
                primary={t("logout")}
                sx={{
                  color: "rgba(45, 146, 247, 0.412)",
                  opacity: open ? 1 : 0,
                  
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
    </>
  )
}
