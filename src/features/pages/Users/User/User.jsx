import React, { useEffect, useState } from "react";
import api from "../../../../api/refreshToken"
import { useLocation } from "react-router-dom";
import EditUser from "./EditUser";
// =========================
// MUI COMPONENTS
// =========================
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  // Dialog,
  // DialogActions,
  // DialogContent,
  // DialogTitle,
  // TextField,
  Alert,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

// =========================
// ICONS
// =========================
import EditIcon from "@mui/icons-material/Edit";

// ======================================================================
// COMPONENT USER
// ======================================================================

export default function User() {

  // ======================================================================
  // STATES
  // ======================================================================

  // نخزن بيانات المستخدم الواحد
  const [user, setUser] = useState(null);

  // حالة التحميل أثناء جلب البيانات
  const [loading, setLoading] = useState(true);

  // تخزين الأخطاء
  const [error, setError] = useState("");

  // الثيم الحالي (Dark / Light)
  const theme = useTheme();

  // ======================================================================
  // DIALOG STATES
  // ======================================================================

  // فتح وإغلاق نافذة التعديل
  const [openEdit, setOpenEdit] = useState(false);

  // ======================================================================
  // GET USER ID FROM LOCATION
  // ======================================================================

  // نستقبل البيانات القادمة من الصفحة السابقة
  const location = useLocation();

  // userId القادم من navigate
  const userId = location.state?.UserId;

  // التوكن الخاص بالأدمن
 

  // ======================================================================
  // FETCH USER DATA
  // ======================================================================

  useEffect(() => {
    if (!userId ) {
      return;
    }

    // دالة جلب بيانات المستخدم
    const fetchUser = async () => {
      try {
        // إرسال GET REQUEST
        const response = await api.get(
          `/admin/users/${userId}`
        );

        if (!response.data?.data) {
          throw new Error("User not found.");
        }

        // تخزين بيانات المستخدم
        setUser(response.data.data);
      } catch (err) {

        console.error("Fetch Error:", err);

        // تخزين رسالة الخطأ
        setError(
          err?.response?.data?.message ||
          err.message ||
          "Error Fetching User"
        );

      } finally {

        // إيقاف التحميل
        setLoading(false);
      }
    };

    // تنفيذ الدالة
    fetchUser();

  }, [userId]);

  // ======================================================================
  // OPEN EDIT DIALOG  // دالة تحديث المستخدم بعد نجاح التعديل
  // ======================================================================
  
  const handleEditClick = () => {
    if (!user) {
      return;
    }

    // فتح نافذة التعديل
    setOpenEdit(true);
  };

  // ======================================================================
  // HANDLE UPDATED USER DATA FROM EDIT DIALOG
  // ======================================================================
  const handleUserUpdated = (updatedUser) => {
    if (!updatedUser) {
      return;
    }

    setUser(updatedUser);
    setOpenEdit(false);
  };

  if (!userId) {
    return (
      <Box sx={{ p: 5 }}>
        <Alert severity="error">User ID is missing.</Alert>
      </Box>
    );
  }


  // ======================================================================
  // LOADING SCREEN
  // ======================================================================

  if (loading) {

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 10,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ======================================================================
  // ERROR SCREEN
  // ======================================================================

  if (error) {

    return (
      <Box sx={{ p: 5 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    );
  }

  // ======================================================================
  // MAIN RETURN
  // ======================================================================

  return (
    <>

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

    

      {/* ========================= */}
      {/* MAIN CONTENT */}
      {/* ========================= */}

      <Box
        component="main"
        sx={{
          width: "100%",
        }}
      >

        {/* ========================= */}
        {/* PAGE TITLE */}
        {/* ========================= */}

        <Typography
          variant="h4"
          sx={{
            p: 2,
          }}
        >
          User Management
        </Typography>

        {/* ========================= */}
        {/* TABLE */}
        {/* ========================= */}

        <TableContainer
          component={Paper}
          sx={{
    backgroundColor:
      theme.palette.mode === "dark"
        ? "#13171a"
        : "#fff",

    borderRadius: 3,
    boxShadow: 3,
  }}
        >

          <Table>

            {/* ========================= */}
            {/* TABLE HEADER */}
            {/* ========================= */}

            <TableHead >
              <TableRow>

                <TableCell>ID</TableCell>

                <TableCell>
                  First Name
                </TableCell>

                <TableCell>
                  Last Name
                </TableCell>

                <TableCell>Email</TableCell>

                <TableCell>Role</TableCell>

                <TableCell>Phone</TableCell>

                <TableCell>Status</TableCell>

                <TableCell align="center">
                  Update User
                </TableCell>

              </TableRow>
            </TableHead>

            {/* ========================= */}
            {/* TABLE BODY */}
            {/* ========================= */}

            <TableBody>

              <TableRow key={user.id}>

                <TableCell>
                  {user.id}
                </TableCell>

                <TableCell>
                  {user.first_name}
                </TableCell>

                <TableCell>
                  {user.last_name}
                </TableCell>

                <TableCell>
                  {user.email}
                </TableCell>

                <TableCell>
                  {user.role}
                </TableCell>

                <TableCell>
                  {user.phone}
                </TableCell>

                <TableCell>
                  {user.is_active
                    ? "Active"
                    : "Inactive"}
                </TableCell>

                {/* ========================= */}
                {/* EDIT BUTTON */}
                {/* ========================= */}

                <TableCell align="center">

                  <EditIcon
                    color="primary"
                    sx={{
                      cursor: "pointer",
                    }}
                    // //////////////////////////////////////////////////////////////////////////////////
                    onClick={handleEditClick}
                  />

                </TableCell>

              </TableRow>

            </TableBody>

          </Table>

        </TableContainer>

        {/* ====================================================================== */}
        {/* EDIT DIALOG */}
        {/* ====================================================================== */}

       
        <EditUser
            key={`${openEdit}-${user?.id ?? "new"}`}
            open={openEdit}
            handleClose={() => setOpenEdit(false)}
            user={user}
            userId={userId}
            onUserUpdated={handleUserUpdated}
        />

      </Box>
    </>
  );
}