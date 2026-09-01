// ==========================
// استيراد مكتبات React و MUI
// ==========================
import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import { Tooltip } from "@mui/material";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

// أيقونات MUI
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4OutlinedIcon from "@mui/icons-material/Brightness4Outlined";
import Brightness7OutlinedIcon from "@mui/icons-material/Brightness7Outlined";
import Person2Outlined from "@mui/icons-material/Person2Outlined";
import LanguageIcon from "@mui/icons-material/Language";
import BeenhereIcon from '@mui/icons-material/Beenhere';
// المكونات الخاصة بالمشروع
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

// Context المسؤول عن تبديل الوضع الليلي والفاتح
import ColorModeContext from "../../contexts/ColorModeContext";

// Hook المسؤول عن الترجمة
import { useTranslation } from "react-i18next";

// ===================================
// عرض القائمة الجانبية (Sidebar)
// ===================================
const drawerWidth = 240;

// ===================================
// مساحة فارغة تحت AppBar حتى لا يغطي المحتوى
// ===================================
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(0, 2),
  ...theme.mixins.toolbar,
}));

// ===================================
// تخصيص AppBar ليتحرك عند فتح Sidebar
// ===================================
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,

  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),

  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,

    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// ===================================
// المكون الرئيسي للهيدر
// ===================================
export default function Header() {

  // الحصول على دوال الترجمة واللغة الحالية
  const { i18n, t } = useTranslation();

  // ===================================
  // تغيير اللغة بين العربية والإنجليزية
  // ===================================
  const changeLanguage = () => {

    // إذا كانت اللغة عربية تصبح إنجليزية والعكس
    const newLang = i18n.language === "ar" ? "en" : "ar";

    // تغيير اللغة داخل i18next
    i18n.changeLanguage(newLang);

    // حفظ اللغة في المتصفح حتى تبقى بعد إعادة فتح الموقع
    localStorage.setItem("lang", newLang);
  };

  // ===================================
  // الحصول على الثيم الحالي (فاتح أو داكن)
  // ===================================
  const theme = useTheme();

  // الوصول إلى Context الخاص بتبديل الثيم
  const colorMode = React.useContext(ColorModeContext);

  // حالة فتح وإغلاق القائمة الجانبية
  const [open, setOpen] = React.useState(false);

  // فتح القائمة الجانبية
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  // إغلاق القائمة الجانبية
  const handleDrawerClose = () => {
    setOpen(false);
  };

  // ===================================
  // واجهة المستخدم
  // ===================================
  return (
    <>
      {/* إعادة ضبط التنسيق الافتراضي للمتصفح */}
      <CssBaseline />

      <Box sx={{ display: "flex" }}>

        {/* شريط التنقل العلوي */}
        <AppBar position="fixed" open={open}>

          <Toolbar>

            {/* زر فتح القائمة الجانبية */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                mr: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* عنوان الصفحة */}
            <Typography variant="h6">
              {t("welcome")}
            </Typography>

            {/* يدفع العناصر التالية إلى نهاية الهيدر */}
            <Box sx={{ flexGrow: 1 }} />

            {/* مجموعة الأزرار */}
            <Stack direction="row" spacing={1}   sx={{alignItems:"center"}}>

              {/* زر تغيير الوضع الليلي والفاتح */}
              <IconButton
                color="inherit"
                onClick={colorMode.toggleColorMode}
              >
                {theme.palette.mode === "light" ? (
                  <Brightness4OutlinedIcon />
                ) : (
                  <Brightness7OutlinedIcon />
                )}
              </IconButton>

              {/* أيقونة المستخدم */}
              <IconButton color="inherit">
                <Person2Outlined />
              </IconButton>

              {/* زر تغيير اللغة */}
              <Tooltip title={t("language")}>
                <IconButton
                  color="inherit"
                  onClick={changeLanguage}
                >
                  <LanguageIcon />
                </IconButton>
              </Tooltip>

            </Stack>

          </Toolbar>
        </AppBar>

        {/* القائمة الجانبية */}
        <Sidebar
          open={open}
          handleDrawerClose={handleDrawerClose}
        />

        {/* محتوى الصفحات */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
          }}
        >
          {/* مسافة تحت الهيدر */}
          <DrawerHeader />

          {/* الصفحة الحالية التي يعرضها React Router */}
          <Outlet />
        </Box>

      </Box>
    </>
  );
}