import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function StatCard({ title, value }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 3,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[1],
        textAlign: "center",
        transition: "all .3s ease",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>

      <Typography variant="h6" fontWeight="bold">
        {value}
      </Typography>
    </Box>
  );
}