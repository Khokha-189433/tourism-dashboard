import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import api from "../../../../api/refreshToken";
import { useTranslation } from "react-i18next";

export default function EditPackage() {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
     localStorage.getItem("accessToken")
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    price: "",
    is_featured: false,
  });

  // ==========================================
  // جلب بيانات الباقة
  // ==========================================

   // ==========================================
  // تشغيل جلب البيانات
  // ==========================================

  useEffect(() => {
     const getPackage = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/packages/${packageId}`
      );

      const data =
        response.data?.data || response.data;
    
      setFormData({
        price: data.price || "",
        is_featured: data.is_featured || false,
      });
     
    } catch (error) {
      console.error(
        "Error fetching package:",
        error.response?.data || error
      );

      alert(t("packageFetchError"));

      navigate("/Packages");
    } finally {
      setLoading(false);
    }
  };
    getPackage();
  }, [packageId]);

  // ==========================================
  // تغيير الحقول
  // ==========================================

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ==========================================
  // تعديل الباقة
  // ==========================================

  const handleUpdate = async () => {
    try {
      setSaving(true);

      await api.put(`/packages/${packageId}`, {
        price: Number(formData.price),
        is_featured: formData.is_featured,
      });

      alert(t("packageUpdateSuccess"));

      navigate(`/package/${packageId}`);
    } catch (error) {
      console.error(
        "Error updating package:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          t("packageUpdateError")
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            minHeight: 400,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      {/* Header */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
       <Button
        startIcon={<ArrowBackIcon />}
        onClick={() =>
            navigate(`/Package/${packageId}`)
        }
        >
        {t("back")}
        </Button>

        <Typography
          variant="h4"
          fontWeight="bold"
        >
          {t("editPackage")}
        </Typography>
      </Box>

      {/* Form */}

      <Card
        sx={{
          borderRadius: 4,
          boxShadow: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ mb: 4 }}
          >
            {t("packageInformation")}
          </Typography>

          {/* Price */}

          <TextField
            fullWidth
            label={t("price")}
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            sx={{ mb: 3 }}
          />

          {/* Featured */}

          <FormControlLabel
            control={
              <Switch
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
              />
            }
            label={t("featured")}
            sx={{ mb: 4 }}
          />

          {/* Buttons */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={() =>
                navigate(`/package/${packageId}`)
              }
            >
              {t("cancel")}
            </Button>

            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleUpdate}
              disabled={saving}
            >
              {saving
                ? <CircularProgress size={22} />
                : t("save")}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}