import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../../api/refreshToken"; // تأكد من مسار الـ API
import { useAuth } from "../../../contexts/AuthContext";
import DeleteArticles from "./CUD_Articles/DeleteArticles";
// =========================
// MUI COMPONENTS
// =========================
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Avatar,
} from "@mui/material";

// =========================
// ICONS
// =========================
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import ArticleIcon from "@mui/icons-material/Article";

export default function Articles() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { user } = useAuth();
  const isAdmin = user?.role === "admin"; // 🎯 التحقق من الدور
  // =========================
  // STATES
  // =========================
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await api.get("/articles"); // عدل المسار حسب الـ API الخاص بك
        const data = response.data?.data || response.data || [];
        console.log(data)
        setArticles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // =========================
  // CLIENT-SIDE SEARCH
  // =========================
  const filteredArticles = articles.filter((article) => {
    const searchTerm = search.toLowerCase();
    const title = isArabic ? article.title_ar : article.title_en;
    return title?.toLowerCase().includes(searchTerm);
  });

  // =========================
  // HELPER FUNCTIONS
  // =========================
  const getStatusColor = (status) => {
    return status === "published" ? "success" : "warning";
  };

  const getTitle = (article) => {
    return isArabic ? article.title_ar || article.title_en : article.title_en || article.title_ar;
  };

  // =========================
  // RENDER
  // =========================
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }
  // إزالة التصنيف المحذوف من القائمة مباشرة بعد نجاح طلب الحذف.
const handelDeleteAricles = (AriclesId) => {
  setArticles((prev) => prev.filter((Aricles) =>Aricles.id !== AriclesId));
};

  return (
    <Box component="main" sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      
      {/* ===== Header ===== */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {t("articlesManagement")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {t("articlesSubtitle")}
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/Articles/CreateArticle"
          sx={{ borderRadius: 2, px: 3 }}
        >
          {t("addArticle")}
        </Button>
      </Box>

      {/* ===== Search Bar ===== */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder={t("searchArticles")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input:{
                  startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            }  }}
         
        />
      </Box>

      {/* ===== Table ===== */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: "action.hover" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", width: "10%" }}>{t("coverImage")}</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "35%" }}>{t("title")}</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "20%" }}>{t("author")}</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "15%" }}>{t("status")}</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "20%", textAlign: "center" }}>{t("actions")}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredArticles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                    <ArticleIcon sx={{ fontSize: 48, color: "text.disabled" }} />
                    <Typography color="text.secondary">{t("noArticlesFound")}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              filteredArticles.map((article) => (
                <TableRow key={article.id} hover>
                  
                  {/* Cover Image */}
                  <TableCell>
                    {article.image ? (
                      <Avatar 
                        variant="rounded" 
                        src={article.cover_image} 
                        sx={{ width: 60, height: 60 }}
                      />
                    ) : (
                      <Box sx={{ 
                        width: 60, height: 60, borderRadius: 1, bgcolor: "action.hover", 
                        display: "flex", alignItems: "center", justifyContent: "center" 
                      }}>
                        <ArticleIcon color="disabled" />
                      </Box>
                    )}
                  </TableCell>

                  {/* Title */}
                  <TableCell>
                    <Typography fontWeight="medium" noWrap sx={{ maxWidth: 300 }}>
                      {getTitle(article)}
                    </Typography>
                  </TableCell>

                  {/* Author    كاتب المقال كمان بميز بين الادمن والموظف  */}
                    <TableCell>
                      {article.author?.first_name && article.author?.last_name   // ( ?.)  firstname  اذا ما كان فاضي هات ال  author معناها اذه الى  
                       ? `${article.author.first_name} ${article.author.last_name}` //ادمج الاسم الأول، ثم ضع مسافة ، ثم الاسم الأخير".
                      : (typeof article.author === 'string' ? article.author : t("admin"))}
                    </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Chip
                      label={t(article.status)}
                      color={getStatusColor(article.status)}
                      size="small"
                      sx={{ fontWeight: "bold", minWidth: 80 }}
                    />
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="center">
                    <IconButton 
                      color="primary" 
                      size="small" 
                      component={Link} 
                      to={`/Article/${article.id}`}
                      title={t("view")}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    {/*  Edit  */}
                    <IconButton 
                      color="warning" 
                      size="small" 
                      component={Link} 
                      to={`/Articles/EditArticle/${article.id}`}
                      title={t("edit")}
                    >
                      <EditIcon />
                    </IconButton>
                    {isAdmin && (
                       <DeleteArticles ArticlesId={article.id}   onDeleted={handelDeleteAricles}   />
                     )}
             
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