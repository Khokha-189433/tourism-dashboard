import React from 'react'
//////////////////////////////////////
import Header from "../../../components/layout/Header"
import { Box, Typography ,styled } from '@mui/material'
// import Sidebar from '../../components/layout/Sidebar'
// ////////////////////////////////////

  const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));
function Dashboard() {
  /////////////////////////////////////

  ///////////////////////////////////

  return (
    < >
     
       <Box  sx={{ display: 'flex' }}>
         <Header /> 
         <Box component="main" sx={{ }}>
            <DrawerHeader />
          <Typography> yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy</Typography>
         </Box>
         
       </Box>
    </>
  )
}

export default Dashboard
