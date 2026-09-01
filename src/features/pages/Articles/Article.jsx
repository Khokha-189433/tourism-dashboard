import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../../api/refreshToken";

// =========================
// MUI COMPONENTS
// =========================
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Paper,
  Stack,
} from "@mui/material";

// =========================
// ICONS
// =========================
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import ArticleIcon from "@mui/icons-material/Article";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PublishIcon from "@mui/icons-material/Publish";
import LanguageIcon from "@mui/icons-material/Language";


export default function Article() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0); // 0 = عربي، 1 = إنجليزي

  // ======================================================================
  // FETCH ARTICLE DATA
  // ======================================================================
  useEffect(() => {
    if (!articleId) return;

    const fetchArticle = async () => {
      try {
        const response = await api.get(`/articles/${articleId}`);
        console.log("response" , response )
        console.log("response" , response.data.data.image )

        setArticle(response.data?.data || response.data );
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  // ======================================================================
  // HELPER FUNCTIONS
  // ======================================================================
  const getAuthorName = (authorData) => {
    if (authorData?.first_name && authorData?.last_name) {
      return `${authorData.first_name} ${authorData.last_name}`;
    }
    if (typeof authorData === "string") return authorData;
    return t("admin") || "الإدارة";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString(isArabic ? "ar-SY" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // ======================================================================
  // LOADING & ERROR STATES
  // ======================================================================
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!article) {
    return (
      <Container sx={{ py: 6, textAlign: "center" }}>
        <ArticleIcon sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
        <Typography variant="h5" color="error" gutterBottom>
          {t("articleNotFound") || "المقال غير موجود"}
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/Articles")} variant="contained" sx={{ mt: 2 }}>
          {t("back") || "رجوع"}
        </Button>
      </Container>
    );
  }

  // ======================================================================
  // MAIN UI
  // ======================================================================
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      
      {/* ============================================ */}
      {/*  HERO SECTION (صورة الغلاف الكبيرة) */}
      {/* ============================================ */}
      <Box
        sx={{
          position: "relative",
          width: "90%",
          height: { xs: 300, md: 450 },
          overflow: "hidden",
         borderRadius:10,
         margin:9
        }}
      >
        {/* الصورة */}
        {article.image ? (
          <Box
            component="img"
            src={article.image}
            alt={isArabic ? article.title_ar : article.title_en}
            sx={{
              width: "90%",
              height: "90%",
              objectFit: "cover",
            }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArticleIcon sx={{ fontSize: 120, color: "white", opacity: 0.3 }} />
          </Box>
        )}

        {/*  Overlay Gradient (طبقة شفافة فوق الصورة) */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(to top, rgba(15, 14, 14, 0.979) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)",
          }}
        />

        {/*  شارة الحالة */}
        <Chip
          label={t(article.status)}
          color={article.status === "published" ? "success" : "warning"}
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            fontWeight: "bold",
            px: 1,
            fontSize: "0.875rem",
            boxShadow: 3,
          }}
        />

        {/*  زر الرجوع */}
        <Tooltip title={t("back")}>
          <IconButton
            onClick={() => navigate("/Articles")}
            sx={{
              position: "absolute",
              top: 20,
              left: 20,
              bgcolor: "rgba(255,255,255,0.9)",
              "&:hover": { bgcolor: "white" },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>

        {/*  زر التعديل */}
        <Tooltip title={t("edit")}>
          <IconButton
            component={Link}
            to={`/Articles/EditArticle/${article.id}`}
            sx={{
              position: "absolute",
              top: 20,
              left: 75,
              bgcolor: "rgba(255,255,255,0.9)",
              "&:hover": { bgcolor: "white" },
            }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>

        {/*  العنوان فوق الصورة */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            p: { xs: 3, md: 5 },
            color: "white",
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                mb: 2,
                textShadow: "2px 2px 4px rgba(172, 225, 248, 0.5)",
                fontSize: { xs: "1.75rem", md: "2.5rem"  , fontFamily:"sans-serif , "},
              }}
            >
              {isArabic ? article.title_ar : article.title_en}
            </Typography>
          </Container>
        </Box>
      </Box>

      {/* ============================================ */}
      {/*  CONTENT SECTION */}
      {/* ============================================ */}
      <Container maxWidth="md" sx={{ py: 5 , padding:14 }}>
        
        {/* بطاقات المعلومات الملونة */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr" },
            gap: 2,
            mb: 4,
            mt: -8, // رفع البطاقات فوق الصورة
            position: "relative",
            zIndex: 1,
          }}
        >
          <ColoredInfoCard
            icon={<PersonIcon />}
            title={t("author") || "الكاتب"}
            value={getAuthorName(article.author)}
            color="#3b82f6" // أزرق
          />

          <ColoredInfoCard
            icon={<CalendarTodayIcon />}
            title={t("publishDate") || "تاريخ النشر"}
            value={formatDate(article.createdAt)}
            color="#10b981" // أخضر
          />

          <ColoredInfoCard
            icon={<PublishIcon />}
            title={t("status") || "الحالة"}
            value={t(article.status)}
            color={article.status === "published" ? "#10b981" : "#f59e0b"}
          />

          <ColoredInfoCard
            icon={<LanguageIcon />}
            title={t("language") || "اللغة"}
            value={isArabic ? "العربية" : "English"}
            color="#8b5cf6" // بنفسجي
          />
        </Box>

        {/* ============================================ */}
        {/*  TABS (فصل المحتوى العربي والإنجليزي) */}
        {/* ============================================ */}
        <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 3 }}>
          
          {/* رؤوس التبويبات */}
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
            sx={{
              bgcolor: "primary.main",
              "& .MuiTab-root": {
                color: "rgba(255,255,255,0.7)",
                fontWeight: "bold",
                fontSize: "1rem",
                py: 2,
                "&.Mui-selected": {
                  color: "white",
                },
              },
              "& .MuiTabs-indicator": {
                bgcolor: "white",
                height: 3,
              },
            }}
          >
            <Tab icon={<LanguageIcon />} iconPosition="start" label={t("contentArabic") || "المحتوى بالعربية"} />
            <Tab icon={<LanguageIcon />} iconPosition="start" label={t("contentEnglish") || "المحتوى بالإنجليزية"} />
          </Tabs>

          {/* محتوى التبويب */}
          <Box sx={{ p: { xs: 3, md: 5 } }}>
            {activeTab === 0 ? (
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 2,
                  fontSize: "1.1rem",
                  whiteSpace: "pre-wrap",
                  textAlign: "justify",
                  color: "text.primary",
                }}
              >
                {article.content_ar || t("noContent") || "لا يوجد محتوى"}
              </Typography>
            ) : (
              <Typography
                variant="body1"
                dir="ltr"
                sx={{
                  lineHeight: 2,
                  fontSize: "1.1rem",
                  whiteSpace: "pre-wrap",
                  textAlign: "justify",
                  color: "text.primary",
                }}
              >
                {article.content_en || t("noContent") || "No content available"}
              </Typography>
            )}
          </Box>
        </Paper>

      </Container>
    </Box>
  );
}

// ======================================================================
// 🌈 HELPER COMPONENT: ColoredInfoCard (بطاقة معلومات ملونة)
// ======================================================================
function ColoredInfoCard({ icon, title, value, color }) {
  return (
    <Paper
      elevation={0}
      sx={{
        justifyItems:"center",
        p: 2.5,
        borderRadius: 3,
        bgcolor: `${color}15`, // لون شفاف (15% opacity)
        border: `2px solid ${color}30`,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 8px 20px ${color}30`,
          borderColor: color,
        },
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          bgcolor: color,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // mb: 1.5,
        }}
      >
        {icon}
      </Box>

      <Typography variant="caption" color="text.secondary" fontWeight="medium">
        {title}
      </Typography>

      <Typography
        variant="body1"
        fontWeight="bold"
        sx={{
          mt: 0.5,
          color: color,
          wordBreak: "break-word",
        }}
      >
        {value || "-"}
      </Typography>
    </Paper>
  );
}