
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Button,
  Divider 
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

////////////////////////////////

///////////////////////////////
export default function Users() {
  const theme = useTheme();
  // حالة تخزين قائمة المستخدمين
  const [users, setUsers] = useState([]);
  // حالة التحميل أثناء انتظار البيانات من السيرفر
  const [loading, setLoading] = useState(true);
  // حالة الخطأ في حال فشل جلب البيانات
  const [error, setError] = useState(null);

  useEffect(() => {
    // الحصول على التوكن من التخزين المحلي
    const adminToken = localStorage.getItem("adminToken");

    const fetchUsers = async () => {
      try {
        // طلب بيانات المستخدمين من API
        const response = await axios.get(
          "/api/admin/users?page=1&limit=10&role=customer",
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );

        console.log('Axios response.data:', response.data);
        // حفظ البيانات في حالة المستخدمين
        setUsers(response.data.data || []);
      } catch (fetchError) {
        console.error("Error fetching users:", fetchError?.response || fetchError);
        // حفظ رسالة الخطأ للعرض
        setError(fetchError?.response?.data?.message || fetchError.message || 'Fetch error');
      } finally {
        // إيقاف حالة التحميل بعد انتهاء الطلب
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // عرض مؤشر التحميل أثناء انتظار استجابة السيرفر
  if (loading) {
    return (
      <Box display="flex" justifycontent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  // عرض رسالة الخطأ إذا حدث خطأ أثناء جلب البيانات
  if (error) {
    return (
      <Box display="flex" justifycontent="center" mt={5}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // العرض الرئيسي لطاولة المستخدمين
  return (
    <Box component="main" sx={{}}>
      <Box
        display="flex"
        justifycontent="space-between"
        alignitems="center"
        mb={30}
        sx={{ marginBlockEnd:4}}
      >
        <Typography variant="h4" fontWeight="bold" sx={{paddingBlockEnd:1}} >
           All Users
        </Typography>
        <Divider />
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          backgroundColor:
            theme.palette.mode === "dark"
              ? "#13171a"
              : "#fff",
          justifycontent: "",
          borderRadius: 3,
          boxShadow: 3,
          marginTop:4 
        }}
      >
        <Table  sx={{ }} aria-label="users table">
          <TableHead sx={{}}>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>User</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                {/* عرض الاسم الأول لكل مستخدم */}
                <TableCell>{user.first_name}</TableCell>
                {/* عرض البريد الإلكتروني للمستخدم */}
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    component={Link}
                    to="/User"
                    state={{ UserId: user.id }}
                  >
                    Open
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}