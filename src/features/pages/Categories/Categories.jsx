import React, { useEffect, useState } from "react";
import api from "../../../api/refreshToken";
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import TerrainIcon from "@mui/icons-material/Terrain";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import MuseumIcon from "@mui/icons-material/Museum";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import ForestIcon from "@mui/icons-material/Forest";
import DeleteCategory from "./CUD_Categories/DeleteCategory";

// كل قيمة محفوظة في قاعدة البيانات تقابل مكوّن أيقونة محدد من MUI.
// نستخدم TerrainIcon كقيمة افتراضية حتى لا تنهار الواجهة إذا كانت قيمة icon
// قديمة أو فارغة، مع الاستمرار في عرض أيقونة مفهومة للمستخدم.
const categoryIcons = {
  mountain: TerrainIcon,
  beach: BeachAccessIcon,
  museum: MuseumIcon,
  camp: LocalFireDepartmentIcon,
  forest: ForestIcon,
};

const getCategoryIcon = (iconName) =>
  categoryIcons[iconName] || TerrainIcon;

export default function Categories() {
  const { t, i18n } = useTranslation();

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  // تحميل البيانات مرة واحدة عند فتح الصفحة. نضع مصفوفة فارغة كقيمة احتياطية
  // حتى تبقى الواجهة قابلة للرسم إذا أعاد الخادم استجابة ناجحة بلا بيانات.
  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await api.get("/categories");

        setCategories(response.data.data || []);
      } catch (error) {
        // تسجيل الخطأ يساعد المطور على معرفة سبب الفشل، بينما تبقى الصفحة
        // ظاهرة للمستخدم بدل توقف التطبيق بالكامل بسبب طلب الشبكة.
        console.error(error);
      }
    };

    getCategories();
  }, []);

  // نستخدم النص العربي والإنجليزي معًا في البحث، بغض النظر عن لغة العرض
  // الحالية، حتى يستطيع المستخدم العثور على التصنيف بأي من الاسمين.
  const filteredCategories = categories.filter((item) => {
    const searchValue = search.toLowerCase().trim();
    const arabicName = item.name_ar || "";
    const englishName = (item.name_en || "").toLowerCase();

    return (
      arabicName.includes(searchValue) ||
      englishName.includes(searchValue)
    );
  });
   
// إزالة التصنيف المحذوف من القائمة مباشرة بعد نجاح طلب الحذف.
const handleCategoryDeleted = (categoryId) => {
  setCategories((prev) => prev.filter((Category) => Category.id !== categoryId));
};
  return (
    <Box sx={{ p: 3 }}>
      {/* رأس الصفحة: عنوان الصفحة ووصفها وزر الانتقال إلى نموذج الإضافة. */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {t("categories")}
          </Typography>

          <Typography color="text.secondary">
            {t("manageCategories")}
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
           component={Link}
          to="/Categories/CreateCategory"
          sx={{ borderRadius: 3, textTransform: "none" }}
        >
          {t("addCategory")}
        </Button>
      </Box>

      {/* إحصائيات سريعة محسوبة من نفس البيانات التي أعادها الخادم. */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Card sx={{ p: 3, borderRadius: 3 }}>
          <Typography color="text.secondary">
            {t("totalCategories")}
          </Typography>

          <Typography variant="h4" fontWeight="bold">
            {categories.length}
          </Typography>
        </Card>

        <Card sx={{ p: 3, borderRadius: 3 }}>
          <Typography color="text.secondary">
            {t("activeCategories")}
          </Typography>

          <Typography variant="h4" fontWeight="bold">
            {categories.filter((c) => c.is_active).length}
          </Typography>
        </Card>
      </Box>

      {/* حقل البحث: تتغير النتائج مباشرة مع كل حرف يدخله المستخدم. */}

      <Card sx={{ borderRadius: 3 }}>
        <Box sx={{ p: 2 }}>
        <TextField
        fullWidth
        placeholder={t("searchCategories")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        slotProps={{
            input: {
             startAdornment: (
            <InputAdornment position="start">
                <SearchIcon />
            </InputAdornment>
            ),
            }
        }}
        />
        </Box>

        {/* عرض النتائج كبطاقات متجاوبة؛ عدد الأعمدة يتكيف مع عرض الشاشة. */}
    <TableContainer component={Paper} elevation={0}>
  <Table>
    <TableHead>
      <TableRow
        sx={{
          "& th": {
            fontWeight: "bold",
            bgcolor: "background.default",
          },
        }}
      >
        <TableCell align="center">{t("icon")}</TableCell>
        <TableCell align="center">{t("categoryName")}</TableCell>
        <TableCell align="center">{t("description")}</TableCell>
        <TableCell align="center">{t("status")}</TableCell>
        <TableCell align="center">{t("sortOrder")}</TableCell>
        <TableCell align="center">{t("actions")}</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {filteredCategories.map((item) => (
        <TableRow
          key={item.id}
          hover
          sx={{
            "&:last-child td": { borderBottom: 0 },
          }}
        >
          <TableCell align="center">
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                bgcolor: "#E8F3FB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
              }}
            >
              {React.createElement(getCategoryIcon(item.icon), {
                sx: { color: "#4286AE" },
              })}
            </Box>
          </TableCell>

          <TableCell align="center">
            <Typography fontWeight={600}>
              {i18n.language === "ar"
                ? item.name_ar
                : item.name_en}
            </Typography>
          </TableCell>

          <TableCell align="center">
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 220, mx: "auto" }}
            >
              {i18n.language === "ar"
                ? item.description_ar
                : item.description_en}
            </Typography>
          </TableCell>

          <TableCell align="center">
            <Chip
              label={
                item.is_active
                  ? t("active")
                  : t("inactive")
              }
              color={item.is_active ? "success" : "error"}
              size="small"
            />
          </TableCell>

          <TableCell align="center">
            {item.sort_order}
          </TableCell>

          <TableCell align="center">
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <IconButton
                color="info"
                component={Link} to={`/Category/${item.id}`}
              >
                <VisibilityIcon />
              </IconButton>

              <IconButton
                color="warning"
                component={Link}
                to={`/Categories/EditCategory/${item.id}`}
              >
                <EditIcon />
              </IconButton>
            <DeleteCategory CategoryId={item.id} onDeleted={handleCategoryDeleted} />
            </Box>
          </TableCell>
        </TableRow>
      ))}

      {filteredCategories.length === 0 && (
        <TableRow>
          <TableCell colSpan={6} align="center">
            <Typography color="text.secondary" sx={{ py: 3 }}>
              {t("noCategoriesFound")}
            </Typography>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>
        
      </Card>
    </Box>
  );
}