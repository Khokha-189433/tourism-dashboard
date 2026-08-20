import React from 'react'
import { Button } from '@mui/material' ;
import Link from '@mui/material';
import { useTheme } from '@mui/material';


export default function ButtonF() {
  const theme = useTheme();
  return (
    <div>
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
    </div>
  )
}
