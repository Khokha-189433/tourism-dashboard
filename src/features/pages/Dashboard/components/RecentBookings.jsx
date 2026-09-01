import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Paper, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Button
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import CardHeader from "./CardHeader";

export default function RecentBookings({ bookings = [] }) {
  const { t } = useTranslation();

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed": return "success";
      case "pending": return "warning";
      case "cancelled": return "error";
      case "completed": return "info";
      default: return "default";
    }
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        borderRadius: 3, 
        border: "1px solid #e5e7eb",
        overflow: "hidden", 
        height: "100%",
    
      }}
    >
      {/* 🎯 الرأس الموحد */}
      <CardHeader
        icon={<ConfirmationNumberIcon fontSize="small" />}
        color="#10b981"
        title={t("recentBookings") || "آخر الحجوزات"}
        action={
          <Button
            component={Link}
            to="/Bookings"
            endIcon={<ArrowForwardIcon />}
            size="small"
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            {t("viewAll") || "عرض الكل"}
          </Button>
        }
      />

      <TableContainer sx={{ maxHeight: 400 ,width:600 }}> 
        {bookings.length === 0 ? (
          <Box sx={{ p: 6, textAlign: "center"  }}>
            <ConfirmationNumberIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
            <Typography color="text.secondary">
              {t("noBookings") || "لا توجد حجوزات بعد"}
            </Typography>
          </Box>
        ) : (
          <Table stickyHeader size="medium" >
            <TableHead sx={{padding:10 }} >
              <TableRow>
                <TableCell sx={{  fontWeight: "bold", fontSize: "0.8rem" ,textalign: "center" }}>
                  {t("customer") || "العميل"}
                </TableCell>
                <TableCell sx={{  fontWeight: "bold", fontSize: "0.8rem" }}>
                  {t("trip") || "الرحلة"}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "0.8rem" }}>
                  {t("amount") || "المبلغ"}
                </TableCell>
                <TableCell sx={{  fontWeight: "bold", fontSize: "0.8rem" }}>
                  {t("status") || "الحالة"}
                </TableCell>
                <TableCell sx={{fontWeight: "bold", fontSize: "0.8rem" }}>
                  {t("date") || "التاريخ"}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {booking.customer}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                      {booking.trip}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      ${booking.amount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={t(booking.status) || booking.status}
                      color={getStatusColor(booking.status)}
                      size="small"
                      sx={{ fontWeight: "medium", fontSize: "0.75rem" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {booking.date}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Paper>
  );
}