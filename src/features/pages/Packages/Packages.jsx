import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  InputAdornment,
  Tooltip,
  Stack,
} from "@mui/material";

import {
  Add,
  Search,
  Visibility,
  Edit,
  Delete,
  Star,
} from "@mui/icons-material";

export default function Packages() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // =====================================================
  // Language
  // =====================================================

  const isArabic = i18n.language === "ar";

  // =====================================================
  // State
  // =====================================================

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // =====================================================
  // Get Packages
  // =====================================================

  useEffect(() => {
    const getPackages = async () => {
      try {
        setLoading(true);

        const response = await api.get("/packages");

        console.log("Packages Response:", response.data);

        // حسب شكل الـ API
        const packagesData =
          response.data?.data ??
          response.data?.packages ??
          response.data ??
          [];

        setPackages(
          Array.isArray(packagesData)
            ? packagesData
            : []
        );
      } catch (error) {
        console.error(
          "Error fetching packages:",
          error
        );

        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    getPackages();
  }, []);

  // =====================================================
  // Search
  // =====================================================

  const filteredPackages = packages.filter((item) => {
    const title = isArabic
      ? item.title_ar
      : item.title_en;

    const searchValue = search
      .toLowerCase()
      .trim();

    return title
      ?.toLowerCase()
      .includes(searchValue);
  });

  // =====================================================
  // Delete Package
  // =====================================================

  const handleDelete =  (id) => {
    console.log(id)
      // حذف العنصر مباشرة من الجدول
      setPackages((prev) =>
        prev.filter((item) => item.id !== id)
      );
  };

  // =====================================================
  // Format Price
  // =====================================================

  const formatPrice = (price, currency) => {
    if (
      price === undefined ||
      price === null
    ) {
      return "-";
    }

    return `${Number(price).toLocaleString()} ${
      currency || ""
    }`;
  };

  // =====================================================
  // Get Thumbnail
  // =====================================================

  const getThumbnail = (item) => {
    return (
      item.thumbnail ||
      item.image ||
      item.images?.[0]?.image_url ||
      item.images?.[0]?.url ||
      null
    );
  };

  // =====================================================
  // Table Header
  // =====================================================

  const renderTableHeader = () => {
    const headers = [
      {
        key: "thumbnail",
        label: t("packages.thumbnail"),
        width: "11%",
      },
      {
        key: "name",
        label: t("packages.name"),
        width: "21%",
      },
      {
        key: "price",
        label: t("packages.price"),
        width: "16%",
      },
      {
        key: "duration",
        label: t("packages.duration"),
        width: "12%",
      },
      {
        key: "seats",
        label: t("packages.availableSeats"),
        width: "13%",
      },
      {
        key: "status",
        label: t("packages.status"),
        width: "11%",
      },
      {
        key: "actions",
        label: t("packages.actions"),
        width: "16%",
      },
    ];

    // في العربية نعكس ترتيب الأعمدة
    const orderedHeaders = isArabic
      ? [...headers].reverse()
      : headers;

    return orderedHeaders.map((header) => (
      <TableCell
        key={header.key}
        align="center"
        sx={{
          width: header.width,
          fontWeight: 700,
          whiteSpace: "nowrap",
        }}
      >
        {header.label}
      </TableCell>
    ));
  };

  // =====================================================
  // Table Row
  // =====================================================

  const renderTableRow = (item) => {
    // =====================================================
    // Package Title
    // =====================================================

    const title = isArabic
      ? item.title_ar
      : item.title_en;

    // =====================================================
    // Available Seats
    // =====================================================

    const availableSeats =
      item.available_seats ??
      item.max_participants ??
      "-";

    // =====================================================
    // Thumbnail
    // =====================================================

    const thumbnail = getThumbnail(item);

    // =====================================================
    // Individual Columns
    // =====================================================

    const columns = {
      thumbnail: (
        <TableCell
          key="thumbnail"
          align="center"
        >
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
                backgroundColor:
                  "action.hover",
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

      // ===================================================
      // Name
      // ===================================================

      name: (
        <TableCell
          key="name"
          align="center"
        >
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              minWidth: 0,
              width: "100%",
              alignItems:"center" ,
              justifyContent:"center"
            }}
          >
            <Typography
              fontWeight={600}
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "100%",
              }}
            >
              {title || "-"}
            </Typography>

            {item.is_featured && (
              <Tooltip
                title={t(
                  "packages.featured"
                )}
              >
                <Star
                  fontSize="small"
                  sx={{
                    color:
                      "warning.main",
                    flexShrink: 0,
                  }}
                />
              </Tooltip>
            )}
          </Stack>
        </TableCell>
      ),

      // ===================================================
      // Price
      // ===================================================

      price: (
        <TableCell
          key="price"
          align="center"
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {item.discount_price ? (
              <>
                <Typography
                  fontWeight={700}
                  color="primary"
                  sx={{
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatPrice(
                    item.discount_price,
                    item.currency
                  )}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    textDecoration:
                      "line-through",
                    color:
                      "text.secondary",
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatPrice(
                    item.price,
                    item.currency
                  )}
                </Typography>
              </>
            ) : (
              <Typography
                fontWeight={600}
                sx={{
                  whiteSpace: "nowrap",
                }}
              >
                {formatPrice(
                  item.price,
                  item.currency
                )}
              </Typography>
            )}
          </Box>
        </TableCell>
      ),

      // ===================================================
      // Duration
      // ===================================================

      duration: (
        <TableCell
          key="duration"
          align="center"
        >
          <Typography
            sx={{
              whiteSpace: "nowrap",
            }}
          >
            {item.duration_days ?? "-"}{" "}
            {t("packages.days")}
          </Typography>
        </TableCell>
      ),

      // ===================================================
      // Available Seats
      // ===================================================

      seats: (
        <TableCell
          key="seats"
          align="center"
        >
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

      // ===================================================
      // Status
      // ===================================================

      status: (
        <TableCell
          key="status"
          align="center"
        >
          <Chip
            label={
              item.status === "published"
                ? t(
                    "packages.published"
                  )
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

      // ===================================================
      // Actions
      // ===================================================

      actions: (
        <TableCell
          key="actions"
          align="center"
        >
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
            whiteSpace: "nowrap",
            alignItems:"center" ,
            justifyContent:"center"
            }}
          >
            {/* View */}

        
              <IconButton
                size="small"
                color="primary"
                component={Link}
                to={`/Package/${item.id}`}
              >
                <Visibility />
              </IconButton>
        

            {/* Edit */}

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
       

            {/* Delete */}
           {/*  اسم الملف الخاص بحذف الفندق مع ارسال ال id */}
           <Deletepackage  packageId={item.id} onDeleted={handleDelete} />
   



              {/* 
                   <IconButton
                        color="primary"
                        component={Link}
                        to={`/Transport/${transport.id}`}
                      >
                        <VisibilityIcon />
                      </IconButton>


                      {/* Edit */}

                      {/* <IconButton
                        color="warning"
                        component={Link}
                        to={`/Transports/EditTransport/${transport.id}`}
                      >
                        <EditIcon />
                      </IconButton>
                      */}
                     {/*  اسم الملف الخاص بحذف التصنيف مع ارسال ال id */}
                   {/* <DeleteTransport id={transport.id} onDeleted={handleTransDelete} /> */}
              
              
              
      
          </Stack>
        </TableCell>
      ),
    };

    // =====================================================
    // ترتيب الأعمدة حسب اللغة
    // =====================================================

    const columnOrder = [
      "thumbnail",
      "name",
      "price",
      "duration",
      "seats",
      "status",
      "actions",
    ];

    const orderedColumns = isArabic
      ? [...columnOrder].reverse()
      : columnOrder;

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

  // =====================================================
  // Loading
  // =====================================================

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

  // =====================================================
  // UI
  // =====================================================

  return (
    <Box
      sx={{
        p: 3,

        // RTL / LTR
        direction: isArabic
          ? "rtl"
          : "ltr",

        width: "100%",
        maxWidth: "100%",
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
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        {/* Title */}

        <Box>
          <Typography
            variant="h5"
            fontWeight={700}
          >
            {t("packages.title")}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            {t(
              "packages.subtitle"
            )}
          </Typography>
        </Box>

        {/* Add Package */}

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() =>
            navigate(
              "/Packages/CreatePackage"
            )
          }
          sx={{
            borderRadius: 2,
            px: 2.5,
            fontWeight: 600,
          }}
        >
          {t(
            "packages.addPackage"
          )}
        </Button>
      </Box>

      {/* =================================================
          Search
      ================================================= */}

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
          placeholder={t(
            "packages.search"
          )}
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

      {/* =================================================
          Table
      ================================================= */}

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

            // تثبيت أحجام الأعمدة
            tableLayout: "fixed",

            width: "100%",

            "& .MuiTableCell-root": {
              verticalAlign: "middle",
              py: 1.5,
              px: 1.5,
            },

            "& .MuiTableHead-root .MuiTableCell-root":
              {
                fontWeight: 700,
                whiteSpace: "nowrap",
              },
          }}
        >
          {/* =================================================
              Table Head
          ================================================= */}

          <TableHead>
            <TableRow
              sx={{
                backgroundColor:
                  "action.hover",
              }}
            >
              {renderTableHeader()}
            </TableRow>
          </TableHead>

          {/* =================================================
              Table Body
          ================================================= */}

          <TableBody>
            {filteredPackages.length === 0 ? (
              /* =============================================
                 No Packages
              ============================================= */

              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                  sx={{
                    py: 6,
                  }}
                >
                  <Typography
                    color="text.secondary"
                  >
                    {t(
                      "packages.noPackages"
                    )}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              /* =============================================
                 Packages
              ============================================= */

              filteredPackages.map(
                (item) =>
                  renderTableRow(item)
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}