import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import api from "../../../api/refreshToken";
import Deletepackage from "./CUD_Packages/DeletePackages";

import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  InputAdornment,
} from "@mui/material";

import {
  Add,
  Search,
  Visibility,
  Edit,
  Star,
} from "@mui/icons-material";

export default function Packages() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const isArabic = i18n.language === "ar";

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // =========================
  // Fetch Packages
  // =========================
  useEffect(() => {
    const getPackages = async () => {
      try {
        setLoading(true);

        const { data } = await api.get("/packages");

        const packagesData =
          data?.data ??
          data?.packages ??
          data ??
          [];

        setPackages(
          Array.isArray(packagesData) ? packagesData : []
        );
      } catch (error) {
        console.error("Error fetching packages:", error);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    getPackages();
  }, []);

  // =========================
  // Search
  // =========================
  const filteredPackages = packages.filter((item) => {
    const title = isArabic
      ? item.title_ar
      : item.title_en;

    return title
      ?.toLowerCase()
      .includes(search.trim().toLowerCase());
  });

  // =========================
  // Delete
  // =========================
  const handleDelete = (id) => {
    setPackages((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // =========================
  // Helpers
  // =========================
  const formatPrice = (price, currency) => {
    if (price === undefined || price === null) {
      return "-";
    }

    return `${Number(price).toLocaleString()} ${currency || ""}`;
  };

  const getThumbnail = (item) =>
    item.thumbnail ||
    item.image ||
    item.images?.[0]?.image_url ||
    item.images?.[0]?.url ||
    null;

  const getTitle = (item) =>
    isArabic ? item.title_ar : item.title_en;

  const getAvailableSeats = (item) =>
    item.available_seats ??
    item.max_participants ??
    "-";

  // =========================
  // Table Columns
  // =========================
  const columnOrder = [
    "thumbnail",
    "name",
    "price",
    "duration",
    "seats",
    "status",
    "actions",
  ];

  const headers = [
    ["thumbnail", t("packages.thumbnail"), "11%"],
    ["name", t("packages.name"), "21%"],
    ["price", t("packages.price"), "16%"],
    ["duration", t("packages.duration"), "12%"],
    ["seats", t("packages.availableSeats"), "13%"],
    ["status", t("packages.status"), "11%"],
    ["actions", t("packages.actions"), "16%"],
  ];

  const orderedHeaders = isArabic
    ? [...headers].reverse()
    : headers;

  const orderedColumns = isArabic
    ? [...columnOrder].reverse()
    : columnOrder;

  // =========================
  // Render Table Header
  // =========================
  const renderTableHeader = () =>
    orderedHeaders.map(([key, label, width]) => (
      <TableCell
        key={key}
        align="center"
        sx={{
          width,
          fontWeight: 700,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </TableCell>
    ));

  // =========================
  // Render Table Row
  // =========================
  const renderTableRow = (item) => {
    const title = getTitle(item);
    const thumbnail = getThumbnail(item);
    const availableSeats = getAvailableSeats(item);

    const columns = {
      // Image
      thumbnail: (
        <TableCell key="thumbnail" align="center">
          {thumbnail ? (
            <Box
              component="img"
              src={thumbnail}
              alt={title}
              sx={{
                width: 70,
                height: 50,
                objectFit: "cover",
                borderRadius: 2,
                display: "block",
                mx: "auto",
              }}
            />
          ) : (
            <Box
              sx={{
                width: 70,
                height: 50,
                borderRadius: 2,
                bgcolor: "action.hover",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                {t("packages.noImage")}
              </Typography>
            </Box>
          )}
        </TableCell>
      ),

      // Name
      name: (
        <TableCell key="name" align="center">
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              minWidth: 0,
              width: "100%",
              alignItems:"center" ,
              justifyContent:"center"  }}
          >
            <Typography
              fontWeight={600}
              noWrap
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
              }}
            >
              {title || "-"}
            </Typography>

            {item.is_featured && (
              <Tooltip title={t("packages.featured")}>
                <Star
                  fontSize="small"
                  sx={{
                    color: "warning.main",
                    flexShrink: 0,
                  }}
                />
              </Tooltip>
            )}
          </Stack>
        </TableCell>
      ),

      // Price
      price: (
        <TableCell key="price" align="center">
          <Stack  sx={{alignItems:"center"}}>
            {item.discount_price ? (
              <>
                <Typography
                  fontWeight={700}
                  color="primary"
                  noWrap
                >
                  {formatPrice(
                    item.discount_price,
                    item.currency
                  )}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  sx={{
                    textDecoration: "line-through",
                  }}
                >
                  {formatPrice(
                    item.price,
                    item.currency
                  )}
                </Typography>
              </>
            ) : (
              <Typography fontWeight={600} noWrap>
                {formatPrice(
                  item.price,
                  item.currency
                )}
              </Typography>
            )}
          </Stack>
        </TableCell>
      ),

      // Duration
      duration: (
        <TableCell key="duration" align="center">
          <Typography noWrap>
            {item.duration_days ?? "-"}{" "}
            {t("packages.days")}
          </Typography>
        </TableCell>
      ),

      // Seats
      seats: (
        <TableCell key="seats" align="center">
          <Chip
            label={availableSeats}
            size="small"
            color={
              Number(availableSeats) > 0
                ? "success"
                : "error"
            }
            sx={{
              minWidth: 55,
              fontWeight: 600,
            }}
          />
        </TableCell>
      ),

      // Status
      status: (
        <TableCell key="status" align="center">
          <Chip
            label={
              item.status === "published"
                ? t("packages.published")
                : item.status || "-"
            }
            size="small"
            color={
              item.status === "published"
                ? "success"
                : "default"
            }
            sx={{
              minWidth: 80,
              fontWeight: 600,
            }}
          />
        </TableCell>
      ),

      // Actions
      actions: (
        <TableCell key="actions" align="center">
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ whiteSpace: "nowrap" ,  justifyContent:"center" , alignItems:"center" }}
          >
            <IconButton
              size="small"
              color="primary"
              component={Link}
              to={`/Package/${item.id}`}
            >
              <Visibility />
            </IconButton>

            <IconButton
              size="small"
              color="warning"
              onClick={() =>
                navigate(
                  `/Packages/EditPackage/${item.id}`
                )
              }
            >
              <Edit />
            </IconButton>

            <Deletepackage
              packageId={item.id}
              onDeleted={handleDelete}
            />
          </Stack>
        </TableCell>
      ),
    };

    return (
      <TableRow
        key={item.id}
        hover
        sx={{
          height: 80,
          "&:last-child td, &:last-child th": {
            border: 0,
          },
        }}
      >
        {orderedColumns.map(
          (column) => columns[column]
        )}
      </TableRow>
    );
  };

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <Box
      sx={{
        p: 3,
        direction: isArabic ? "rtl" : "ltr",
        width: "100%",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {t("packages.title")}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            {t("packages.subtitle")}
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() =>
            navigate("/Packages/CreatePackage")
          }
          sx={{
            borderRadius: 2,
            px: 2.5,
            fontWeight: 600,
          }}
        >
          {t("packages.addPackage")}
        </Button>
      </Box>

      {/* Search */}
      <Card
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
        }}
      >
        <TextField
          fullWidth
          size="small"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder={t("packages.search")}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            },
          }}
        />
      </Card>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          overflowX: "auto",
          overflowY: "hidden",
        }}
      >
        <Table
          sx={{
            minWidth: 1100,
            tableLayout: "fixed",
            width: "100%",

            "& .MuiTableCell-root": {
              verticalAlign: "middle",
              py: 1.5,
              px: 1.5,
            },

            "& .MuiTableHead-root .MuiTableCell-root": {
              fontWeight: 700,
              whiteSpace: "nowrap",
            },
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                bgcolor: "action.hover",
              }}
            >
              {renderTableHeader()}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredPackages.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                  sx={{ py: 6 }}
                >
                  <Typography color="text.secondary">
                    {t("packages.noPackages")}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredPackages.map(renderTableRow)
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}