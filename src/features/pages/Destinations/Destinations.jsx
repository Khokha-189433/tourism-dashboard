
import { useEffect, useState } from "react";
import api from "../../../api/refreshToken";
import { Link } from 'react-router-dom';
import DeleteDest from "./CUD_Destinations/DeleteDest"
import {
  Box,
  useTheme ,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
  Divider
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useTranslation } from "react-i18next";

export default function Destinations() {
  const theme = useTheme();
  const { i18n, t } = useTranslation();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);




  useEffect(() => {
    const fetchDestinations = async () => {
    try {
        const res = await api.get("/destinations");
        const data = res.data?.data || res.data || [];
        setDestinations(Array.isArray(data) ? data : []);
        console.log("res.data:", res.data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
    };
    fetchDestinations();
  }, []);

    // إزالة الوجهة المحذوف من القائمة مباشرة بعد نجاح طلب الحذف.
const handleDestDelete = (id) => {
  setDestinations((prev) => prev.filter((item) => item.id !== id));
};
    
  if (loading) {
    return (
      <Box  sx={{justifyContent:"center" , display:"flex"}} mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
   <Box  p={30}>
              {/* Header */} 
         <Box
           display="flex"
          
           mb={30}
           sx={{ marginBlockEnd:4, justifycontent: "space-between", alignItems: "center" }}
         >

      <Typography variant="h4" fontWeight="bold">
          {t("manageDestinations")}
        </Typography>

        <Divider />
  

        {/*  */}
        {/* زر إضافة رحلة */}
         <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/destinations/CreateDestinations"
                    
          sx={{
          
              borderRadius: 3,
              px: 3,
              margin: 2,
            backgroundColor: theme.palette.mode === "dark" ? "#2d3033" : "#f5f5f5",
            color: theme.palette.mode === "dark" ? "#fff" : "#000",     
          }}
        >
         {t("addDestination")}
        </Button>

      </Box>

      <Grid container spacing={3}>
        {destinations.map((destination) => (
          <Grid  xs={12} sm={6} md={4} lg={3} key={destination.id}>
            <Card
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: "0 6px 20px rgba(0,0,0,.08)",
                transition: ".3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 12px 30px rgba(0,0,0,.15)",
                },
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  backgroundColor: "#e0e0e0",
                }}
              >
                <CardMedia
                  component="img"
                  height="190"
                  image={
                    destination.image ||
                    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop"
                  }
                  alt={destination.name_en}
                  sx={{
                    width: "100%",
                    height: 190,
                    objectFit: "cover",
                    transition: ".3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop";
                  }}
                />
              </Box>

              <CardContent>
                <Typography
                  variant="h5"
                  sx={{color:"#4787bbfa"}}
                
                >
                {i18n.language === "ar"
                  ? destination.name_ar || destination.name_en
                  : destination.name_en || destination.name_ar}
                </Typography>

                <Typography
                  
                  color="text.secondary"
                  sx={{
                    color:"#c9c1c1",
                    fontFamily:"fantasy",
                    mt: 1,
                    minHeight: 35,
                  }}
                >
                {i18n.language === "ar"
                  ? destination.country_ar || destination.country_en
                  : destination.country_en || destination.country_ar}
                  
                </Typography>
              </CardContent>

              <CardActions
                sx={{
                  justifyContent: "space-between",
                  px: 4,
                  pb: 2,
                }}
              >

                <IconButton
                  color="primary" component={Link} to={`/destinations/EditDestination/${destination.id}`}
                >
                  <EditIcon />
                </IconButton>

                <IconButton color="primary" component={Link} to={`/Destination/${destination.id}`} >
                    <VisibilityIcon />
                </IconButton>
                {/*  اسم الملف الخاص بحذف التصنيف مع ارسال ال id */}
                <DeleteDest id={destination.id} onDeleted={handleDestDelete} />
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

