import React from 'react';
import { Box,  useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import Chip from '@mui/material/Chip';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useState, useEffect } from 'react';
import api from '../../../api/refreshToken';
import CircularProgress from '@mui/material/CircularProgress';
import Rating from "@mui/material/Rating";
import isArabic from '../../Translate/Translation';
import DeleteHotel from './CUD_Hotels/DeletHotel';
export default function Hotels() { 
const theme = useTheme();
const [hotels, setHotels] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);



useEffect(() => {
  const loadHotels = async () => {
    setLoading(true);
    try {
      const res = await api.get('/hotels');
      const data = res.data?.data || res.data || [];
      console.log('Loaded hotels:', data);
      setHotels(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('فشل تحميل الفنادق');
    } finally {
      setLoading(false);
    }
  };

  loadHotels();
}, []);

// إزالة الفندق المحذوف من القائمة مباشرة بعد نجاح طلب الحذف.
const handleHotelDeleted = (hotelId) => {
  setHotels((prev) => prev.filter((hotel) => hotel.id !== hotelId));
};
  if (loading) {
    return (
      <Box display="flex" justifycontent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifycontent: 'center', mt: 5 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={30}>
           {/* Header */} 
      <Box
        display="flex"
       
        mb={30}
        sx={{ marginBlockEnd:4, justifycontent: "space-between", alignItems: "center" }}
      >
        <Typography variant="h4" fontWeight="bold">
          إدارة الفنادق
        </Typography>
        <Divider />
  

        {/*  */}
        {/* زر إضافة رحلة */}
         <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/CreateHotel"
                    
          sx={{
          
              borderRadius: 3,
              px: 3,
              margin: 2,
            backgroundColor: theme.palette.mode === "dark" ? "#2d3033" : "#f5f5f5",
            color: theme.palette.mode === "dark" ? "#fff" : "#000",     
          }}
        >
         إضافة فندق
        </Button>
      
    
       {/* /////الجدول ////// */}
      
        <TableContainer
        component={Paper}
        sx={{
          marginTop: 2,
          borderRadius: 4,
          overflow: "hidden",
          backgroundColor:
                  theme.palette.mode === "dark"
                    ? "#1a1d1f"
                    : "#fff",
        }}
      >
        <Table>
          {/* رأس الجدول */}
          <TableHead>
            <TableRow
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "#2d3033"
                    : "#f5f5f5",

              }}
            >
           <TableCell> الصورة  </TableCell>
           <TableCell> 	اسم الفندق  </TableCell>
              <TableCell>	الوجهة </TableCell>
              <TableCell>التقييم بالنجوم</TableCell>
 
              <TableCell> السعر لليلة</TableCell>
              <TableCell> الوصف </TableCell>
              <TableCell> العنوان </TableCell>
            
                 
              <TableCell align="center">
                  Button
              </TableCell>
            </TableRow>
          </TableHead>

          {/* بيانات الجدول */}
          <TableBody>
            {hotels.map((hotel) => (
              <TableRow key={hotel.id} hover>
                <TableCell>
                  {/* عرض الصورة فقط عند توفر رابط صحيح لتجنب src فارغ. */}
                  {hotel?.images?.[0]?.image_url || hotel.image ? (
                    <Box
                      component="img"
                      src={hotel.images?.[0]?.image_url || hotel.image}
                      alt={hotel.name_en || hotel.name_ar || 'hotel'}
                      sx={{ width: 100, height: 70, objectFit: 'cover', borderRadius: 1 }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 100,
                        height: 70,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 1,
                        backgroundColor: 'action.hover',
                        color: 'text.secondary',
                      }}
                    >
                      لا توجد صورة
                    </Box>
                  )}
                </TableCell>
                 {/*  اسم الفندق  */}
                <TableCell>
                  {isArabic ? hotel.name_ar || hotel.name_en : hotel.name_en || hotel.name_ar}
                </TableCell>
                 {/*  الى اين متوجهين  */}
                <TableCell>
                  {hotel?.Destination
                      ? (isArabic
                          ? hotel.Destination.name_ar || hotel.Destination.name_en
                          : hotel.Destination.name_en || hotel.Destination.name_ar)
                      : "-"}
                </TableCell>
               {/*  لعرض النجوم */}
               <TableCell>
                  <Rating
                    value={Number(hotel.stars || hotel.star_rating || hotel.rating || 0)}
                    readOnly
                    precision={1}
                    size="small"
                  />
                </TableCell>
                 {/* عرض سعر الليلة  */}
                <TableCell sx={{ fontWeight: 'bold', color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>
                  {hotel.price_per_night || hotel.price || '-'}
                  {hotel.currency ? ` ${hotel.currency}` : ''}
                </TableCell>
                 {/* شرح بسيط عن الفندق */}
                <TableCell>
                  {isArabic ? hotel.short_description_ar || hotel.description_ar || '-' : hotel.short_description_en || hotel.description_en || '-'}
                </TableCell>
                 {/* عنوان الفندق */}
                <TableCell>
                  {isArabic ? hotel.address_ar || hotel.address_en || '-' : hotel.address_en || hotel.address_ar || '-'}
                  {hotel.address || hotel.location || '-'}
                </TableCell>
                  {/*  الازرار */}
                <TableCell align="center">
                  <IconButton color="primary" component={Link} to={`/hotel/${hotel.id}`}>
                    <VisibilityIcon />
                  </IconButton>

                  <IconButton color="warning" component={Link} to={`/EditHotel/${hotel.id}`}>
                    <EditIcon />  
                  </IconButton>
                   {/*  اسم الملف الخاص بحذف الفندق مع ارسال ال id */}
                  <DeleteHotel hotelId={hotel.id} onDeleted={handleHotelDeleted} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>
    </Box>
  )
}
