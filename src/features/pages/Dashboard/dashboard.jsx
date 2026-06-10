import React from 'react';
import { Box, Typography, styled } from '@mui/material';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

function Dashboard() {
  return (
    <Box component="main" sx={{ p: 3, width: '100%' }}>
      <DrawerHeader />
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography>
        Welcome to the admin dashboard. Use the sidebar to navigate between pages.
      </Typography>
    </Box>
  );
}

export default Dashboard;
