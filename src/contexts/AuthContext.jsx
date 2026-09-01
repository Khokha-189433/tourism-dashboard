import { createContext, useState, useEffect, useContext } from "react";
import api from "../api/refreshToken";

const AuthContext = createContext(); // لتحاوط كل المشروع بالبيانات الموجودة داخله
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // يخزن المستخدم الحالي
  const [loading, setLoading] = useState(true); // 

  // ============================================================
  // 1. التحقق من الجلسة عند بدء التطبيق
  // ============================================================
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken"); /// جبنا التوكين من ال local 

      if (token) {
        try {
          const res = await api.get("/auth/profile"); //جلب بيانات الملف الشخصي للمستخدم الحالي بعد تسجيل الدخول.
          const userData = res.data?.data || res.data;

          // البيانات القادمة تحتوي على role مباشرة!
          // مثال: { id: 1, first_name: "kh", role: "admin", ... }
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData)); //string الاوبجيكت الى  stringify بحول  // 
          //خذ بيانات المستخدم وحوّلها إلى نص JSON، ثم خزّنها في localStorage.     
        } catch (error) {
          console.error("Token expired or invalid:", error);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");   
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // ============================================================
  // 2. تسجيل الدخول
  // ============================================================
  const login = async (email, password) => {
    try {
      // أ. تسجيل الدخول
      const loginRes = await api.post("/auth/login", { email, password });
      const loginData = loginRes.data?.data || loginRes.data;

      localStorage.setItem("accessToken", loginData.access_token);
      if (loginData.refresh_token) {
        localStorage.setItem("refreshToken", loginData.refresh_token);
      }

      // ب جلب البروفايل (يحتوي على role!)
      const profileRes = await api.get("/auth/profile");
      const userData = profileRes.data?.data || profileRes.data;

      // ج. حفظ المستخدم
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      console.log("✅ Logged in as:", userData.role); // admin أو employee أو customer

      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "فشل تسجيل الدخول",
      };
    }
  };

  // ============================================================
  // 3. تسجيل الخروج
  // ============================================================
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  // ============================================================
  // 4. 🎯 دوال الصلاحيات (تعتمد على user.role)
  // ============================================================
  const isAdmin = user?.role === "admin";
  const isEmployee = user?.role === "employee";
  const isCustomer = user?.role === "customer";
  const isAuthenticated = !!user;

  // دالة للتحقق من عدة أدوار
  const hasRole = (roles = []) => roles.includes(user?.role);

  // الصفحة الرئيسية حسب الدور
  const getHomePage = () => {
    if (isAdmin) return "/dashboard";
    if (isEmployee) return "/Bookings";
    return "/";
  };

  return (
    <AuthContext.Provider
     value={{
        user,
        loading,
        login,
        logout,
        isAdmin,
        isEmployee,
        isCustomer,
        isAuthenticated,
        hasRole,
        getHomePage,
}}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// Login Page                        //            logout()
//     ↓                             //               ↓
// login(email, password)            //            POST /auth/logout
//     ↓                                              ↓
// POST /auth/login                  //             حذف accessToken
//     ↓                                              ↓
// Access Token                      //              حذف refreshToken
//     ↓                                              ↓
// حفظ Token                         //              حذف user
//     ↓                                              ↓
// GET /auth/profile                 //               setUser(null)
//     ↓                                               ↓
// الحصول على User                  //               المستخدم أصبح غير مسجل
//     ↓
// user.role                         //
//     ↓
// admin / employee / customer       //
