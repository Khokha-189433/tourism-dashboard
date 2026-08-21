import React, { useState, useEffect } from "react";
import { Box, Button, TextField, CircularProgress } from "@mui/material";
import api from "../../../../api/refreshToken";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function EditHotel() {
  const navigate = useNavigate();
  const { hotelId } = useParams();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);

  const [hotelData, setHotelData] = useState({
    price_per_night: 0,
    available_rooms: 0,
  });

  // جلب بيانات الفندق عند فتح الصفحة
  useEffect(() => {
    const getHotel = async () => {
      try {
        const response = await api.get(`/hotels/${hotelId}`);
        const data = response.data.data || response.data;

        setHotelData({
          price_per_night: data.price_per_night,
          available_rooms: data.available_rooms,
        });
      } catch (error) {
        console.error(error);
        alert(t("hotelLoadError"));
      } finally {
        setLoading(false);
      }
    };

    getHotel();
  }, [hotelId, t]);

  // تحديث قيم الحقول
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setHotelData({
      ...hotelData,
      [name]: value,
    });
  };

  // إرسال التعديل
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/hotels/${hotelId}`, hotelData);
      alert(t("hotelUpdated"));

      navigate('/hotels' );
    } catch (error) {
      console.error(error);
      alert(t("hotelUpdateError"));
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 500, mx: "auto", mt: 4 }}
    >
      <TextField
        fullWidth
        margin="normal"
        label={t("pricePerNight")}
        name="price_per_night"
        type="number"
        value={hotelData.price_per_night}
        onChange={handleInputChange}
      />

      <TextField
        fullWidth
        margin="normal"
        label={t("availableRooms")}
        name="available_rooms"
        type="number"
        value={hotelData.available_rooms}
        onChange={handleInputChange}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 3 }}
      >
        {t("saveChanges")}
      </Button>
    </Box>
  );
}