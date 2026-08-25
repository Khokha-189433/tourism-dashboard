// ==========================
// استيراد React ومكتبات MUI
// ==========================
import React from "react";
import { styled, useTheme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

// أيقونات MUI
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import LocalAirportRoundedIcon from "@mui/icons-material/LocalAirportRounded";
import LocalHotelRoundedIcon from "@mui/icons-material/LocalHotelRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CategoryIcon from '@mui/icons-material/Category';
import CommuteIcon from '@mui/icons-material/Commute';
import Inventory2Icon from '@mui/icons-material/Inventory2';


// React Router للتنقل بين الصفحات
import { useNavigate, useLocation } from "react-router-dom";

// لون جاهز من MUI
import { grey } from "@mui/material/colors";

// زر تسجيل الخروج
import LogOut from "../../features/LogOut/LogOut";

// مكتبة الترجمة
import { useTranslation } from "react-i18next";

// ===================================
// عرض القائمة الجانبية عند فتحها
// ===================================
const drawerWidth = 240;

// ===================================
// تنسيق Drawer عند الفتح
// ===================================
const openedMixin = (theme) => ({
  width: drawerWidth,

  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),

  overflowX: "hidden",
});

// ===================================
// تنسيق Drawer عند الإغلاق
// ===================================
const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),

  overflowX: "hidden",

  // عرض صغير لإظهار الأيقونات فقط
  width: `calc(${theme.spacing(2)} + 1px)`,

  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(7.6)} + 1px)`,
  },
});

// ===================================
// إنشاء Drawer مخصص باستخدام styled
// ===================================
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",

  // تغيير التنسيق حسب قيمة open
  variants: [
    {
      props: ({ open }) => open,

      style: {
        ...openedMixin(theme),

        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },

    {
      props: ({ open }) => !open,

      style: {
        ...closedMixin(theme),

        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

// ===================================
// رأس القائمة الجانبية
// يحتوي زر الإغلاق
// ===================================
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",

  padding: theme.spacing(0, 1),

  ...theme.mixins.toolbar,
}));

// ===================================
// المكون الرئيسي للـ Sidebar
// ===================================
function Sidebar({ open, handleDrawerClose }) {

  // دالة الترجمة
  const { t } = useTranslation();

  // الثيم الحالي
  const theme = useTheme();

  // التنقل بين الصفحات
  const navigate = useNavigate();

  // معرفة الصفحة الحالية
  const location = useLocation();

  // ===================================
  // عناصر القائمة الجانبية
  // كل عنصر يحتوي:
  // اسم - أيقونة - رابط
  // ===================================
  const menuItems = [
    {
      text: t("dashboard"),
      Icon: <InboxIcon />,
      path: "/dashboard",
    },

    {
      text: t("users"),
      Icon: <PeopleAltIcon />,
      path: "/Users",
    },

    {
      text: t("trips"),
      Icon: <LocalAirportRoundedIcon />,
      path: "/trips",
    },

    {
      text: t("hotels"),
      Icon: <LocalHotelRoundedIcon />,
      path: "/Hotels",
    },

    {
      text: t("destinations"),
      Icon: <LocationOnOutlinedIcon />,
      path: "/Destinations",
    },
     {
      text: t("Categories"),
      Icon: <CategoryIcon />,
      path: "/Categories",
    } ,
    {
      text: t("Transports"),
      Icon: <CommuteIcon />,
      path: "/Transports",
    },
    {
      text: t("Packages"),
      Icon: <Inventory2Icon />,
      path: "/Packages",
    }
  ];

  return (
    <>
      {/* القائمة الجانبية الدائمة */}
      <Drawer variant="permanent" open={open}>

        {/* رأس القائمة */}
        <DrawerHeader>

          {/* زر الإغلاق */}
          <IconButton onClick={handleDrawerClose}>

            {/* يتغير السهم حسب اتجاه اللغة */}
            {theme.direction === "rtl"
              ? <ChevronRightIcon />
              : <ChevronLeftIcon />}
          </IconButton>

        </DrawerHeader>

        <Divider />

        {/* قائمة الصفحات */}
        <List>

          {menuItems.map((item) => (

            <ListItem
              key={item.path}
              disablePadding
            >

              <ListItemButton

                // الانتقال للصفحة عند الضغط
                onClick={() => navigate(item.path)}

                sx={{
                  justifyContent:
                    open ? "center" : "inherit",

                  // تلوين الصفحة الحالية
                  bgcolor:
                    location.pathname === item.path
                      ? theme.palette.mode === "dark"
                        ? grey[600]
                        : grey[300]
                      : null,
                }}
              >

                {/* الأيقونة */}
                <ListItemIcon
                  sx={{
                    color: "rgba(136,189,224,.95)",
                  }}
                >
                  {item.Icon}
                </ListItemIcon>

                {/* اسم الصفحة */}
                <ListItemText

                  primary={item.text}

                  sx={[
                    {
                      color: "rgb(132,173,201)",
                    },

                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />

              </ListItemButton>

            </ListItem>

          ))}

        </List>

        {/* يدفع زر تسجيل الخروج إلى الأسفل */}
        <Box sx={{ flexGrow: 1 }} />

        <Divider />

        {/* زر تسجيل الخروج */}
        <List>
          <LogOut />
        </List>

      </Drawer>
    </>
  );
}

export default Sidebar;