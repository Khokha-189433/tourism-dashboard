import React from 'react';
import { Box, Typography, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

function Dashboard() {
  const { t } = useTranslation();
  return (
    <Box component="main" sx={{ p: 3, width: '100%' }}>
      <DrawerHeader />
      <Typography variant="h4" gutterBottom>
        {t("dashboard")}
      </Typography>
      <Typography>
        {t("welcome")}
      </Typography>
    </Box>
  );
}

export default Dashboard;
