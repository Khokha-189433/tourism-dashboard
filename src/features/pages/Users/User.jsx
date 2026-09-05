import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../../api/refreshToken";
import EditUser from "./CUD_user/EditUser";

// =========================
// MUI COMPONENTS
// =========================
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Typography,
  Avatar,
} from "@mui/material";

// =========================
// ICONS
// =========================
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

// ======================================================================
// MAIN COMPONENT: User Details
// ======================================================================
export default function User() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // 🎯 الحصول على ID من الرابط (مثال: /User/3)
  const { UserId } = useParams();

  // =========================
  // STATES
  // =========================
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openEdit, setOpenEdit] = useState(false);

  // =========================
  // FETCH USER DATA
  // =========================
  useEffect(() => {
    if (!UserId) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/admin/users/${UserId}`);
        setUser(response.data?.data || null);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err?.response?.data?.message || err.message || "فشل جلب بيانات المستخدم");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [UserId]);

  // =========================
  // HANDLE EDIT
  // =========================
  const handleUserUpdated = (updatedUser) => {
    setUser(updatedUser);
    setOpenEdit(false);
  };

  // =========================
  // HELPER FUNCTIONS
  // =========================
  const getRoleColor = (role) => {
    if (role === "admin") return "error";
    if (role === "employee") return "info";
    return "default";
  };

  const getStatusColor = (isActive) => (isActive ? "success" : "error");

  const getStatusIcon = (isActive) =>
    isActive ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />;

  // =========================
  // RENDER STATES
  // =========================
  if (!UserId) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography color="error">معرف المستخدم مفقود من الرابط.</Typography>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container sx={{ py: 6 }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !user) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography color="error">{error || "المستخدم غير موجود"}</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/Users")} sx={{ mt: 2 }}>
          {t("back")}
        </Button>
      </Container>
    );
  }

  // =========================
  // MAIN UI
  // =========================
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      
      {/* ===== Header ===== */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/Users")}>
          {t("back")}
        </Button>

        <Typography variant="h4" fontWeight="bold">
          {t("userDetails")}
        </Typography>
      </Box>

      {/* ===== Profile Card ===== */}
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        
        {/* ===== Cover / Header Section ===== */}
        <Box
          sx={{
            bgcolor: "#22668edf",
            p: 3,
            display: "flex",
            alignItems: "center",
            gap: 3,
            color: "white",
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "background.paper",
              color: "primary.main",
              fontSize: 32,
              fontWeight: "bold",
            }}
          >
            {user.first_name?.charAt(0)}
            {user.last_name?.charAt(0)}
          </Avatar>

          <Box>
            <Typography variant="h5" fontWeight="bold">
              {user.first_name} {user.last_name}
            </Typography>

            <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }} dir="ltr">
              {user.email}
            </Typography>

            <Box sx={{ display: "flex", gap: 1, mt: 1.5, flexWrap: "wrap" }}>
              <Chip
                label={t(user.role) || user.role}
                color={getRoleColor(user.role)}
                size="small"
                icon={<BadgeIcon />}
              />
              <Chip
                label={user.is_active ? t("active") : t("inactive")}
                color={getStatusColor(user.is_active)}
                size="small"
                icon={getStatusIcon(user.is_active)}
              />
            </Box>
          </Box>
        </Box>

        {/* ===== Details Section ===== */}
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 3,
            }}
          >
            <InfoCard
              title={t("firstName") || "الاسم الكامل"}
              value={`${user.first_name} ${user.last_name}`}
              icon={<PersonIcon fontSize="small" />}
            />

            <InfoCard
              title={t("email") || "البريد الإلكتروني"}
              value={user.email}
              icon={<EmailIcon fontSize="small" />}
              dir="ltr"
            />

            <InfoCard
              title={t("phone") || "رقم الهاتف"}
              value={user.phone || "-"}
              icon={<PhoneIcon fontSize="small" />}
              dir="ltr"
            />

            <InfoCard
              title={t("role") || "الدور"}
              value={t(user.role) || user.role}
              icon={<BadgeIcon fontSize="small" />}
            />

         

            <InfoCard
              title={t("accountStatus") || "حالة الحساب"}
              value={user.is_active ? (t("active") || "نشط") : (t("inactive") || "معطل")}
              icon={<CheckCircleIcon fontSize="small" color={user.is_active ? "success" : "error"} />}
            />
          </Box>

          {/* ===== Action Buttons ===== */}
          <Divider sx={{ my: 4 }} />

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setOpenEdit(true)}
              sx={{ borderRadius: 3, px: 4 }}
            >
              {t("edit")}
            </Button>

            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/Users")}
              sx={{ borderRadius: 3, px: 4 }}
            >
              {t("back")}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* ===== Edit Dialog ===== */}
      <EditUser
        key={`edit-${user.id}`}
        open={openEdit}
        handleClose={() => setOpenEdit(false)}
        user={user}
        onUserUpdated={handleUserUpdated}
      />
    </Container>
  );
}

// ======================================================================
// HELPER COMPONENT: InfoCard
// ======================================================================
function InfoCard({ title, value, icon, dir = "rtl" }) {
  return (
    <Box
      sx={{
        p: 2.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        bgcolor: "background.default",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        },
      }}
    >
      {/* Title with Icon */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        {icon && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "primary.main",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        )}
        <Typography variant="body2" color="text.secondary" fontWeight="medium">
          {title}
        </Typography>
      </Box>

      {/* Value */}
      <Typography variant="h6" fontWeight="bold" dir={dir} sx={{ wordBreak: "break-word" }}>
        {value || "-"}
      </Typography>
    </Box>
  );
}