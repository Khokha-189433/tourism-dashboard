import React, { useState, useEffect } from "react";
import { Box, Button, TextField, CircularProgress } from "@mui/material";
import api from "../../../../api/refreshToken";
import { useParams, useNavigate } from "react-router-dom";

export default function EditHotel() {
  const navigate = useNavigate();
  const { hotelId } = useParams();

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
        alert("فشل في تحميل بيانات الفندق");
      } finally {
        setLoading(false);
      }
    };

    getHotel();
  }, [hotelId]);

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

      alert("تم تعديل الفندق بنجاح");

      navigate('/hotels' );
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء التعديل");
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
        label="Price Per Night"
        name="price_per_night"
        type="number"
        value={hotelData.price_per_night}
        onChange={handleInputChange}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Available Rooms"
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
        Save Changes
      </Button>
    </Box>
  );
}