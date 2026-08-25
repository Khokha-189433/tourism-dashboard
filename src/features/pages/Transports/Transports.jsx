import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DeleteTransport from "./CUD_Transport/DeleteTransport";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  InputAdornment,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import FlightIcon from "@mui/icons-material/Flight";
import TrainIcon from "@mui/icons-material/Train";

import { useTranslation } from "react-i18next";

import api from "../../../api/refreshToken";


const Transports = () => {

  // =====================================================
  // Translation
  // =====================================================

  const { t, i18n } = useTranslation();

  const isArabic = i18n.language === "ar";


  // =====================================================
  // Navigation
  // =====================================================

  const navigate = useNavigate();


  // =====================================================
  // States
  // =====================================================

  const [transports, setTransports] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState(null);

  const limit = 10;


  // =====================================================
  // Get Transports
  // =====================================================

  useEffect(() => {

    const getTransports = async () => {

      try {

        setLoading(true);

        const response = await api.get(
          `/transports?page=${page}&limit=${limit}`
        );

        setTransports(response.data.data || []);

        setPagination(
          response.data.pagination || null
        );

      } catch (error) {

        console.error(
          "Error fetching transports:",
          error
        );

      } finally {

        setLoading(false);

      }

    };

    getTransports();

  }, [page]);


  // =====================================================
  // Transport Name
  // =====================================================

  const getName = (transport) => {

    if (isArabic) {
      return transport.name_ar;
    }

    return transport.name_en;
  };


  // =====================================================
  // Search
  // =====================================================

  const filteredTransports = transports.filter(
    (transport) => {

      const searchText =
        search.toLowerCase().trim();

      const nameAr =
        transport.name_ar?.toLowerCase() || "";

      const nameEn =
        transport.name_en?.toLowerCase() || "";

      return (
        nameAr.includes(searchText) ||
        nameEn.includes(searchText)
      );

    }
  );


  // =====================================================
  // Transport Type
  // =====================================================

  const getTypeName = (type) => {

    return t(`transportTypes.${type}`, {
      defaultValue: type,
    });

  };


  // =====================================================
  // Transport Icon
  // =====================================================

  const getIcon = (type) => {

    if (type === "bus") {
      return <DirectionsBusIcon  />;
    }

    if (type === "minibus") {
      return <DirectionsBusIcon  />;
    }

    if (type === "car") {
      return <DirectionsCarIcon />;
    }

    if (type === "airplane") {
      return <FlightIcon />;
    }

    if (type === "boat") {
      return <DirectionsBoatIcon />;
    }

    if (type === "train") {
      return <TrainIcon />;
    }

    return <DirectionsBusIcon />;

  };


  // =====================================================
  // Loading
  // =====================================================

  if (loading) {

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  }

  const handleTransDelete = (id) => {
  setTransports((prev) => prev.filter((item) => item.id !== id));
};


  // =====================================================
  // Page
  // =====================================================

  return (

    <Box
      sx={{
        p: 3,
        direction: isArabic ? "rtl" : "ltr",
      }}
    >

      {/* =================================================
          Header
      ================================================= */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >

        <Box>

          <Typography
            variant="h4"
            fontWeight={700}
          >
            {t("transports")}
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            {t("manageTransports")}
          </Typography>

        </Box>


        {/* Add Transport */}

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() =>
            navigate("/Transports/CreateTransport")
          }
          sx={{
            borderRadius: 3,
            textTransform: "none",
          }}
        >
          {t("addTransport")}
        </Button>

      </Box>


      {/* =================================================
          Statistics
      ================================================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: 2,
          mb: 3,
        }}
      >

        {/* Total */}

        <Card
          sx={{
            p: 3,
            borderRadius: 3,
          }}
        >

          <Typography color="text.secondary">
            {t("totalTransports")}
          </Typography>

          <Typography
            variant="h4"
            fontWeight="bold"
          >
            {transports.length}
          </Typography>

        </Card>


        {/* Active */}

        <Card
          sx={{
            p: 3,
            borderRadius: 3,
          }}
        >

          <Typography color="text.secondary">
            {t("activeTransports")}
          </Typography>

          <Typography
            variant="h4"
            fontWeight="bold"
          >
            {
              transports.filter(
                (transport) =>
                  transport.is_active
              ).length
            }
          </Typography>

        </Card>

      </Box>


      {/* =================================================
          Table Card
      ================================================= */}

      <Card
        sx={{
          borderRadius: 3,
          overflow: "hidden",
        }}
      >

        {/* =================================================
            Search
        ================================================= */}

        <Box sx={{ p: 2 }}>

          <TextField
            fullWidth
            placeholder={t("searchTransports")}
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />

        </Box>


        {/* =================================================
            Table
        ================================================= */}

        <TableContainer
          sx={{
            overflowX: "auto",
            direction: isArabic ? "rtl" : "ltr",
          }}
        >

          <Table sx={{ direction: isArabic ? "rtl" : "ltr" }}>

            {/* ============================
                Header
            ============================ */}

            <TableHead>

              <TableRow
                sx={{
                  backgroundColor:
                    "action.hover",
                }}
              >

                <TableCell align="center">
                  <b>{t("icon")}</b>
                </TableCell>

                <TableCell align="center">
                  <b>{t("transportName")}</b>
                </TableCell>

                <TableCell align="center">
                  <b>{t("transportType")}</b>
                </TableCell>

                <TableCell align="center">
                  <b>{t("capacity")}</b>
                </TableCell>

                <TableCell align="center">
                  <b>{t("pricePerTrip")}</b>
                </TableCell>

                <TableCell align="center">
                  <b>{t("status")}</b>
                </TableCell>

                <TableCell align="center">
                  <b>{t("actions")}</b>
                </TableCell>

              </TableRow>

            </TableHead>


            {/* ============================
                Body
            ============================ */}

            <TableBody>

              {filteredTransports.map(
                (transport) => (

                  <TableRow
                    key={transport.id}
                    hover
                  >

                    {/* Icon */}

                    <TableCell align="center">

                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,

                          display: "flex",
                          alignItems: "center",
                          justifyContent:
                            "center",

                          backgroundColor:
                            "#E8F3FB",

                          color: "#4286AE",

                          mx: "auto",
                        }}
                      >

                        {getIcon(
                          transport.type
                        )}

                      </Box>

                    </TableCell>


                    {/* Name */}

                    <TableCell align="center">

                      <Typography
                        fontWeight={600}
                      >
                        {getName(transport)}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {transport.company_name}
                      </Typography>

                    </TableCell>


                    {/* Type */}

                    <TableCell align="center">

                      {getTypeName(
                        transport.type
                      )}

                    </TableCell>


                    {/* Capacity */}

                    <TableCell align="center">

                      <Typography
                        fontWeight={600}
                      >
                        {transport.capacity}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {t("passengers")}
                      </Typography>

                    </TableCell>


                    {/* Price */}

                    <TableCell align="center">

                      <Typography
                        fontWeight={700}
                        color="primary.main"
                      >
                        {Number(
                          transport.price_per_trip
                        ).toLocaleString()}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {transport.currency}
                      </Typography>

                    </TableCell>


                    {/* Status */}

                    <TableCell align="center">

                      <Chip
                        label={
                          transport.is_active
                            ? t("active")
                            : t("inactive")
                        }
                        color={
                          transport.is_active
                            ? "success"
                            : "default"
                        }
                        size="small"
                      />

                    </TableCell>


                    {/* Actions */}

                    <TableCell align="center">

                      {/* Details */}

                      <IconButton
                        color="primary"
                        component={Link}
                        to={`/Transport/${transport.id}`}
                      >
                        <VisibilityIcon />
                      </IconButton>


                      {/* Edit */}

                      <IconButton
                        color="warning"
                        component={Link}
                        to={`/Transports/EditTransport/${transport.id}`}
                      >
                        <EditIcon />
                      </IconButton>
                     
                     {/*  اسم الملف الخاص بحذف التصنيف مع ارسال ال id */}
                   <DeleteTransport id={transport.id} onDeleted={handleTransDelete} />
                    </TableCell>

                  </TableRow>

                )
              )}

            </TableBody>

          </Table>

        </TableContainer>


        {/* =================================================
            No Results
        ================================================= */}

        {filteredTransports.length === 0 && (

          <Typography
            align="center"
            color="text.secondary"
            sx={{ p: 4 }}
          >
            {t("noTransports")}
          </Typography>

        )}


        {/* =================================================
            Pagination
        ================================================= */}

        {pagination &&
          pagination.totalPages > 1 && (

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                p: 2,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >

              {/* Previous */}

              <Button
                variant="outlined"
                disabled={
                  !pagination.hasPrev
                }
                onClick={() =>
                  setPage(page - 1)
                }
              >
                {t("previous")}
              </Button>


              {/* Page */}

              <Typography>
                {pagination.page} /{" "}
                {pagination.totalPages}
              </Typography>


              {/* Next */}

              <Button
                variant="outlined"
                disabled={
                  !pagination.hasNext
                }
                onClick={() =>
                  setPage(page + 1)
                }
              >
                {t("next")}
              </Button>

            </Box>

          )}

      </Card>

    </Box>

  );

};

export default Transports;