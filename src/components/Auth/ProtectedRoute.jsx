import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Box, Typography, Button } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
 // ظيفته الأساسية : هي حماية الصفحات حسب حالة تسجيل الدخول وRole المستخدم
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, hasRole } = useAuth();
  const location = useLocation();  // يحدد ان وين 


    if (loading) {
         return null;
      }
      if (!user) {   // اذا مو مسجل دخول لسا وجهه ل صفحة تسجيل الدخول 
      return <Navigate to="/" state={{ from: location }} replace />;  //state={{ from: location }}   وديه للصفحة يلي اله صلاحية يوصللها بعد تسجيل الدخول
      }

  // 2️⃣ مسجل لكن ليس مسموحاً له → صفحة 403
  if (allowedRoles && !hasRole(allowedRoles)) {  // !hasRole(allowedRoles)  ليس لديه صلاحية 
    return (
      <Box sx={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
      }}>
        <LockIcon sx={{ fontSize: 80, color: "error.main" }} />
        <Typography variant="h4" fontWeight="bold">403</Typography>
        <Typography color="text.secondary">
          ليس لديك صلاحية للوصول إلى هذه الصفحة  403
        </Typography>
        <Button variant="contained" onClick={() => window.history.back()}>   //ارجع إلى الصفحة السابقة في المتصفح.
          العودة
        </Button>
      </Box>
    );
  }

  // 3️⃣ مسموح → عرض الصفحة
  return children;   // اذا كان المستخدم Admin  وديه ل صفحة ال الداشبورد
}

    //       AuthContext
    //           │
    //     يعطي المعلومات
    //           ↓
    //  ┌──────────────────┐
    //  │ user             │
    //  │ loading          │
    //  │ hasRole()        │
    //  └────────┬─────────┘
    //           │
    //           ↓
    //    ProtectedRoute
    //           │
    //    ┌──────┼───────┐
    //    ↓      ↓       ↓
    // loading  user    role
    //    │      │       │
    //    ↓      ↓       ↓
    //  انتظر   Login    403
    //                 أو
    //                الصفحة

// user.role = "employee"
//         ↓
// allowedRoles = ["admin"]   ثاببت 
//         ↓
// hasRole(["admin"]) = false     قاربن بين الادمن والموظف طلعوا ما بسااوا بعص 
//         ↓
// 403
/////////////////////////

// user.role = "admin"
//         ↓
// allowedRoles = ["admin"]
//         ↓
// hasRole(["admin"]) = true
//         ↓
// return children
//         ↓
// Dashboard