import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import api from "../../../api/refreshToken";

import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress, Box, Button, Divider,
  TextField, MenuItem, Chip, Stack
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
export default function Users() {
  const theme = useTheme();
  const { t } = useTranslation();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🎯 حالة الفلتر (الافتراضي: عرض الكل)
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        // 🎯 بناء الرابط ديناميكياً بناءً على الفلتر
        const roleParam = roleFilter === "all" ? "" : `&role=${roleFilter}`;
        const response = await api.get(`/admin/users?page=1&limit=20${roleParam}`);

        setUsers(response.data?.data || response.data || []);
      } catch (fetchError) {
        console.error("Error fetching users:", fetchError);
        setError(fetchError?.response?.data?.message || fetchError.message || "فشل جلب البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [roleFilter]); // 🎯 يعيد جلب البيانات عند تغيير الفلتر

  // دالة مساعدة لتحديد لون شارة الحالة
  const getStatusColor = (isActive) => (isActive ? "success" : "error");
  const getStatusLabel = (isActive) => (isActive ? t("active") : t("inactive"));

  // دالة مساعدة لتحديد لون شارة الدور
  const getRoleColor = (role) => {
    if (role === "admin") return "error";
    if (role === "employee") return "info";
    return "default";
  };

  if (loading) {
    return (
      <Box   sx={{display:"flex", justifyContent:"center", alignItems:"center", minHeight:"50vh"}}  >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box   sx={{display:"flex", justifyContent:"center", alignItems:"center", minHeight:"50vh"}}  >
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ p: 3 }}>
      {/* ===== الهيدر والفلتر ===== */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {t("usersManagement")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {t("manageSystemUsers")}
          </Typography>
        </Box>

        {/* 🎯 قائمة تصفية حسب الدور */}
        <TextField
          select
          size="small"
          label={t("filterByRole")}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">{t("all")}</MenuItem>
          <MenuItem value="customer">{t("customer")}</MenuItem>
          <MenuItem value="employee">{t("employee")}</MenuItem>
          <MenuItem value="admin">{t("admin")}</MenuItem>
        </TextField>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* ===== الجدول ===== */}
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: theme.palette.mode === "dark" ? "#13171a" : "#fff",
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <Table aria-label="users table">
          <TableHead sx={{ bgcolor: "action.hover" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>{t("name")}</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>{t("email")}</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>{t("phone")}</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>{t("role")}</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>{t("status")}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>{t("actions")}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">{t("noUsersFound")}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{
                    "&:hover": { backgroundColor: theme.palette.action.hover },
                  }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <PersonIcon color="action" fontSize="small" />
                      <Typography fontWeight={600}>
                        {user.first_name} {user.last_name}
                      </Typography>
                    </Stack>
                  </TableCell>
                  
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || "-"}</TableCell>
                  
                  {/*  عرض الدور كـ Chip ملون */}
                  <TableCell>
                    <Chip 
                      label={t(user.role)} 
                      color={getRoleColor(user.role)} 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>

                  {/* عرض الحالة (نشط/غير نشط) كـ Chip */}
                  <TableCell>
                    <Chip 
                      label={getStatusLabel(user.is_active)} 
                      color={getStatusColor(user.is_active)} 
                      size="small"
                    />
                  </TableCell>

                  {/*  الأزرار */}
                  <TableCell align="center">
                <IconButton color="primary" component={Link} to={`/User/${user.id}`}>
                  <VisibilityIcon />
                </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}