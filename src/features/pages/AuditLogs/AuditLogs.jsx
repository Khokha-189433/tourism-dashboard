import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../../api/refreshToken";

// MUI Components
import {
  Box, Typography, Paper, Grid, TextField,
  InputAdornment, CircularProgress, Alert, Chip,
  FormControl, InputLabel, Select, MenuItem,
  TablePagination, IconButton, Tooltip,
} from "@mui/material";

// Icons
import HistoryIcon from "@mui/icons-material/History";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentIcon from "@mui/icons-material/Payment";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

// ♻️ مكون موجود مسبقاً (بدون تكرار)
import CardHeader from "../Dashboard/components/CardHeader";

// ======================================================================
// 🔧 دوال مساعدة عامة (خارج المكون)
// ======================================================================

// ترجمة أسماء الكيانات
function getEntityLabel(entity, t) {
  if (!entity) return "-";

  const map = {
    User: t("entityUser") || "مستخدم",
    Trip: t("entityTrip") || "رحلة",
    Package: t("entityPackage") || "باقة",
    Hotel: t("entityHotel") || "فندق",
    Article: t("entityArticle") || "مقال",
    Booking: t("entityBooking") || "حجز",
    Payment: t("entityPayment") || "دفعة",
  };

  return map[entity] || entity;
}

// ترجمة أسماء الحقول
function getFieldLabel(field) {
  const map = {
    role: "الدور",
    is_active: "الحالة",
    email: "البريد",
    phone: "الهاتف",
    title: "العنوان",
    price: "السعر",
    status: "الحالة",
    description: "الوصف",
    first_name: "الاسم",
    last_name: "الكنية",
  };
  return map[field] || field;
}

// تنسيق القيم
function formatValue(value) {
  if (value === null || value === undefined) return "-";
  if (typeof value === "boolean") return value ? "نعم" : "لا";
  if (typeof value === "object") return JSON.stringify(value);
  if (String(value).length > 30) return String(value).substring(0, 30) + "...";
  return String(value);
}

// ======================================================================
// 🎯 المكون الرئيسي
// ======================================================================
export default function AuditLogs() {
  const { t, i18n } = useTranslation();

  // =========================
  // الحالات
  // =========================
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // الفلاتر
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");

  // ترقيم الصفحات
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // =========================
  // 🎯 جلب البيانات
  // =========================
  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(`/admin/audit-logs?page=${page + 1}&limit=${rowsPerPage}`);
      const data = res.data?.data || res.data || [];

      if (Array.isArray(data)) {
        setLogs(data);
        setTotalCount(data.length);
      } else if (data.items) {
        setLogs(data.items);
        setTotalCount(data.total || data.items.length);
      }
    } catch (err) {
      console.error("AuditLogs Error:", err);
      setError(t("auditLogsLoadError") || "فشل تحميل سجل النشاطات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, t]);

  // =========================
  // 🔧 دوال مساعدة
  // =========================
  const getUser = (log) => {
    return log.User || log.user || {};
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const lang = i18n.language === "ar" ? "ar-SY" : "en-US";
    return date.toLocaleString(lang, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // أيقونة النشاط
  const getActionIcon = (action) => {
    const actionUpper = (action || "").toUpperCase();

    if (actionUpper === "CREATE") return <PersonAddIcon fontSize="small" />;
    if (actionUpper === "UPDATE") return <EditIcon fontSize="small" />;
    if (actionUpper === "DELETE") return <DeleteIcon fontSize="small" />;
    if (actionUpper === "TOGGLE_STATUS") return <SettingsIcon fontSize="small" />;
    if (actionUpper === "LOGIN") return <LoginIcon fontSize="small" />;
    if (actionUpper === "LOGOUT") return <LogoutIcon fontSize="small" />;
    if (actionUpper.includes("BOOK")) return <ShoppingCartIcon fontSize="small" />;
    if (actionUpper.includes("PAYMENT")) return <PaymentIcon fontSize="small" />;

    return <HelpIcon fontSize="small" />;
  };

  // لون النشاط
  const getActionColor = (action) => {
    const actionUpper = (action || "").toUpperCase();

    if (actionUpper === "CREATE") return { bg: "#dbeafe", color: "#1e40af" };
    if (actionUpper === "UPDATE") return { bg: "#fef3c7", color: "#92400e" };
    if (actionUpper === "DELETE") return { bg: "#fee2e2", color: "#991b1b" };
    if (actionUpper === "TOGGLE_STATUS") return { bg: "#ede9fe", color: "#5b21b6" };
    if (actionUpper === "LOGIN") return { bg: "#d1fae5", color: "#065f46" };
    if (actionUpper === "LOGOUT") return { bg: "#f3f4f6", color: "#374151" };

    return { bg: "#f3f4f6", color: "#374151" };
  };

  // ترجمة النشاط
  const getActionLabel = (action) => {
    if (!action) return "-";

    const map = {
      CREATE: t("actionCreate") || "إنشاء",
      UPDATE: t("actionUpdate") || "تعديل",
      DELETE: t("actionDelete") || "حذف",
      TOGGLE_STATUS: t("actionToggleStatus") || "تغيير الحالة",
      LOGIN: t("actionLogin") || "تسجيل دخول",
      LOGOUT: t("actionLogout") || "تسجيل خروج",
    };

    return map[action.toUpperCase()] || action;
  };

  // فعل النشاط (لجملة طبيعية)
  const getActionVerb = (action) => {
    const actionUpper = (action || "").toUpperCase();

    const verbs = {
      CREATE: t("verbCreate") || "أنشأ",
      UPDATE: t("verbUpdate") || "عدّل",
      DELETE: t("verbDelete") || "حذف",
      TOGGLE_STATUS: t("verbToggle") || "غيّر حالة",
      LOGIN: t("verbLogin") || "سجّل دخول إلى",
      LOGOUT: t("verbLogout") || "سجّل خروج من",
    };

    return verbs[actionUpper] || action;
  };

  // =========================
  // 🔍 الفلترة (for loop بسيط)
  // =========================
  const filteredLogs = [];

  for (let i = 0; i < logs.length; i++) {
    const log = logs[i];
    const user = getUser(log);

    const userName = `${user.first_name || ""} ${user.last_name || ""}`.toLowerCase();
    const action = (log.action || "").toLowerCase();
    const entity = (log.entity || "").toLowerCase();
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      !searchTerm ||
      userName.includes(searchTerm) ||
      action.includes(searchTerm) ||
      entity.includes(searchTerm);

    const matchesAction =
      actionFilter === "all" ||
      action === actionFilter.toLowerCase();

    const matchesUser =
      userFilter === "all" ||
      String(log.user_id || user.id) === userFilter;

    if (matchesSearch && matchesAction && matchesUser) {
      filteredLogs.push(log);
    }
  }

  // =========================
  // 📋 المستخدمون الفريدون
  // =========================
  const uniqueUsers = [];
  const seenUserIds = {};

  for (let i = 0; i < logs.length; i++) {
    const user = getUser(logs[i]);
    const userId = logs[i].user_id || user.id;

    if (userId && !seenUserIds[userId]) {
      seenUserIds[userId] = true;
      uniqueUsers.push({
        id: userId,
        first_name: user.first_name || `User #${userId}`,
        last_name: user.last_name || "",
      });
    }
  }

  // =========================
  // 🔄 إعادة التحميل
  // =========================
  const handleRefresh = () => {
    fetchLogs();
  };

  // =========================
  // 🎨 حالة التحميل
  // =========================
  if (loading && logs.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  // =========================
  // 🎨 الواجهة الرئيسية
  // =========================
  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: "auto" }} className="anim-fade">
      
      {/* ===== الهيدر ===== */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <HistoryIcon color="primary" sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {t("auditLogsTitle") || "سجل النشاطات"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("auditLogsSubtitle") || "تتبع جميع العمليات التي يقوم بها المستخدمون"}
            </Typography>
          </Box>
        </Box>

        <Tooltip title={t("refresh") || "تحديث"}>
          <IconButton onClick={handleRefresh} sx={{ bgcolor: "action.hover" }}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* ===== الفلاتر ===== */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: "1px solid #e5e7eb" }} className="anim-fade-up">
        <Grid container spacing={2}>
          <Grid xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder={t("searchLogs") || "ابحث بالنشاط أو الكيان..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>{t("filterByAction") || "فلتر النشاط"}</InputLabel>
              <Select
                value={actionFilter}
                label={t("filterByAction") || "فلتر النشاط"}
                onChange={(e) => setActionFilter(e.target.value)}
              >
                <MenuItem value="all">{t("all") || "الكل"}</MenuItem>
                <MenuItem value="create">{t("actionCreate") || "إنشاء"}</MenuItem>
                <MenuItem value="update">{t("actionUpdate") || "تعديل"}</MenuItem>
                <MenuItem value="delete">{t("actionDelete") || "حذف"}</MenuItem>
                <MenuItem value="toggle_status">{t("actionToggleStatus") || "تغيير الحالة"}</MenuItem>
                <MenuItem value="login">{t("actionLogin") || "تسجيل دخول"}</MenuItem>
                <MenuItem value="logout">{t("actionLogout") || "تسجيل خروج"}</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>{t("filterByUser") || "فلتر المستخدم"}</InputLabel>
              <Select
                value={userFilter}
                label={t("filterByUser") || "فلتر المستخدم"}
                onChange={(e) => setUserFilter(e.target.value)}
              >
                <MenuItem value="all">{t("all") || "الكل"}</MenuItem>
                {uniqueUsers.map((user) => (
                  <MenuItem key={user.id} value={String(user.id)}>
                    {user.first_name} {user.last_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* ===== خط النشاطات الزمني (Timeline) ===== */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #e5e7eb", overflow: "hidden" }} className="anim-fade-up">
        <CardHeader
          icon={<HistoryIcon fontSize="small" />}
          color="#6b7280"
          title={`${t("auditLogsTitle") || "سجل النشاطات"} (${filteredLogs.length})`}
        />

        {/* حالة فارغة */}
        {filteredLogs.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <HistoryIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.primary" gutterBottom>
              {t("noLogsFound") || "لا توجد نشاطات مطابقة"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("tryDifferentFilters") || "جرّب تغيير الفلاتر أو البحث"}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ p: 3 }}>
            {filteredLogs.map((log, index) => {
              const user = getUser(log);
              const dateStr = log.createdAt || log.created_at || "";
              const action = log.action || "";
              const entity = log.entity || "";
              const entityId = log.entity_id || "";
              const newValues = log.new_values || null;
              const oldValues = log.old_values || null;
              const isLast = index === filteredLogs.length - 1;
              const user_agent = log.user_agent || null;

              return (
                <Box key={log.id} sx={{ display: "flex", gap: 2, position: "relative", pb: isLast ? 0 : 3 }}>
                  
                  {/* ===== الجانب الأيسر: الأيقونة + الخط ===== */}
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        bgcolor: getActionColor(action).bg,
                        color: getActionColor(action).color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "3px solid white",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        zIndex: 2,
                        flexShrink: 0,
                      }}
                    >
                      {getActionIcon(action)}
                    </Box>

                    {/* الخط الرأسي */}
                    {!isLast && (
                      <Box sx={{ width: 2, flex: 1, bgcolor: "#e5e7eb", mt: 0.5 }} />
                    )}
                  </Box>

                  {/* ===== الجانب الأيمن: المحتوى ===== */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    
                    {/* السطر الأول: المستخدم + الفعل + الكيان + الوقت */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 2,
                        mb: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0, flexWrap: "wrap" }}>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          sx={{ color: "#111827" }}
                        >
                          {user.first_name
                            ? `${user.first_name} ${user.last_name || ""}`
                            : `User #${log.user_id || "?"}`}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          {getActionVerb(action)}
                        </Typography>

                        <Chip
                          label={`${getEntityLabel(entity, t)} #${entityId}`}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: "#3b82f6",
                            color: "#3b82f6",
                            fontWeight: "bold",
                            fontSize: "0.75rem",
                            height: 24,
                          }}
                        />
                      </Box>

                      <Typography variant="caption" sx={{ whiteSpace: "nowrap", color: "#9ca3af" }}>
                        {formatDateTime(dateStr)}
                      </Typography>
                    </Box>

                    {/* البطاقة الرئيسية */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: "#f9fafb",
                        border: "1px solid #f3f4f6",
                        borderRadius: 2,
                        transition: "all 0.2s",
                        "&:hover": {
                          bgcolor: "#f3f4f6",
                          borderColor: "#e5e7eb",
                        },
                      }}
                    >
                      {/* التغييرات */}
                      <TimelineChanges
                        action={action}
                        oldValues={oldValues}
                        newValues={newValues}
                        entity={entity}
                      />

                      {/* تفاصيل إضافية */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mt: 1.5,
                          pt: 1.5,
                          borderTop: "1px dashed #e5e7eb",
                          flexWrap: "wrap",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight="bold">
                            IP:
                          </Typography>
                          <Typography variant="caption" dir="ltr" sx={{ fontFamily: "monospace", color: "text.secondary" }}>
                            {log.ip_address || "-"}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight="bold">
                            {t("userAgent") || "User Agent"}:
                          </Typography>
                          <Typography variant="caption" dir="ltr" sx={{ color: "text.secondary" }}>
                            {user_agent || "-"}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}

        {/* ترقيم الصفحات */}
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage={t("rowsPerPage") || "صفوف لكل صفحة:"}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} ${t("of") || "من"} ${count}`
          }
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>
    </Box>
  );
}

// ======================================================================
// 🎨 مكون فرعي: عرض التغييرات
// ======================================================================
function TimelineChanges({ action, oldValues, newValues, entity }) {
  const { t } = useTranslation();

  // حالة TOGGLE_STATUS
  if (action === "TOGGLE_STATUS") {
    const isActive = newValues?.is_active;
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="body2" color="text.primary" fontWeight="medium">
          {t("statusChangedTo") || "الحالة الجديدة:"}
        </Typography>
        <Chip
          icon={isActive ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : <CancelIcon sx={{ fontSize: 16 }} />}
          label={isActive ? (t("active") || "مفعّل") : (t("inactive") || "معطّل")}
          size="small"
          color={isActive ? "success" : "default"}
          sx={{ fontWeight: "bold" }}
        />
      </Box>
    );
  }

  // حالة CREATE
  if (action === "CREATE" && !oldValues) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
        ✨ {t("newEntityCreated") || `تم إنشاء ${getEntityLabel(entity, t)} جديد`}
      </Typography>
    );
  }

  // حالة DELETE
  if (action === "DELETE" && !newValues) {
    return (
      <Typography variant="body2" color="error.main" sx={{ fontStyle: "italic" }}>
        🗑️ {t("entityDeleted") || `تم حذف ${getEntityLabel(entity, t)}`}
      </Typography>
    );
  }

  // حالة UPDATE - عرض الحقول بشكل أنيق
  if (newValues && typeof newValues === "object") {
    const keys = Object.keys(newValues);

    if (keys.length === 0) {
      return <Typography variant="body2" color="text.secondary">-</Typography>;
    }

    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(auto-fit, minmax(200px, 1fr))" },
          gap: 1.5,
        }}
      >
        {keys.map((key) => (
          <Box
            key={key}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.25,
              p: 1,
              bgcolor: "white",
              borderRadius: 1,
              border: "1px solid #e5e7eb",
            }}
          >
            <Typography variant="caption" color="text.secondary" fontWeight="bold">
              {getFieldLabel(key)}
            </Typography>
            <Typography
              variant="body2"
              fontWeight="medium"
              title={formatValue(newValues[key])}
              sx={{
                color: "#111827",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {formatValue(newValues[key])}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }

  return <Typography variant="body2" color="text.secondary">-</Typography>;
}