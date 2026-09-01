import React, { useCallback ,useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import api from "../../../api/refreshToken";
import ImageGallery from "../../../components/UI/ImageGallery";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Rating,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import HotelIcon from "@mui/icons-material/Hotel";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleIcon from "@mui/icons-material/People";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";

export default function PackageDetails() {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  const isArabic = i18n.language === "ar";

  // اختيار النص حسب اللغة
  const text = (ar, en) =>
    isArabic ? ar || en || "-" : en || ar || "-";

  // المقاعد المتاحة
  const availableSeats =
    (packageData?.max_participants || 0) -
    (packageData?.current_participants || 0);

const getPackage = useCallback(async () => {
  try {
    setLoading(true);

    const response = await api.get(`/packages/${packageId}`);

    setPackageData(response.data?.data || response.data);
  } catch (error) {
    console.error("Error fetching package:", error);
    alert(t("packageFetchError"));
    navigate("/Packages");
  } finally {
    setLoading(false);
  }
}, [packageId, navigate, t]);

useEffect(() => {
   const loadPackage = async () => {
      await  getPackage();
    };
     loadPackage()
}, [getPackage]);

  // Loading
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            minHeight: 400,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // لا توجد بيانات
  if (!packageData) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography      sx={{ textAlign: "center" }}>
          {t("packageNotFound")}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>

      {/* ================= Header ================= */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/Packages")}
        >
          {t("back")}
        </Button>

        <Box sx={{ textAlign: "right" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <FlightTakeoffIcon
              sx={{ color: "#6ea3dc", fontSize: 32 }}
            />

            <Typography variant="h4" fontWeight="bold">
              {t("packageDetails")}
            </Typography>
          </Box>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {t("packageDetailsDescription")}
          </Typography>
        </Box>
      </Box>

      {/* ================= Package Main Card ================= */}

      <Card
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          mb: 4,
        }}
      >
        {/* Image */}

        <Box sx={{ position: "relative" }}>
          {packageData.image ? (
            <Box
              component="img"
              src={packageData.image}
              alt={packageData.title_en}
              sx={{
                width: "100%",
                height: { xs: 250, md: 420 },
                objectFit: "cover",
              }}
            />
          ) : (
            <EmptyImage icon={<FlightTakeoffIcon />} />
          )}

          {/* Status */}

          <Chip
            label={packageData.status || "-"}
            color={
              packageData.status === "active"
                ? "success"
                : "default"
            }
            sx={{
              position: "absolute",
              top: 20,
              left: 20,
              fontWeight: "bold",
            }}
          />

          {/* Featured */}

          {packageData.is_featured && (
            <Chip
              icon={<StarIcon />}
              label={t("featured")}
              color="warning"
              sx={{
                position: "absolute",
                top: 20,
                right: 20,
                fontWeight: "bold",
              }}
            />
          )}
        </Box>

        {/* Package Information */}

        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Typography variant="h3" fontWeight="bold">
            {text(
              packageData.title_ar,
              packageData.title_en
            )}
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {text(
              packageData.title_en,
              packageData.title_ar
            )}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Typography sx={{ lineHeight: 2, mb: 3 }}>
            {text(
              packageData.description_ar,
              packageData.description_en
            )}
          </Typography>

          {/* Rating */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 3,
            }}
          >
            <Rating
              value={Number(packageData.average_rating || 0)}
              readOnly
              precision={0.1}
            />

            <Typography fontWeight="bold">
              {packageData.average_rating || 0}
            </Typography>

            <Typography color="text.secondary">
              ({packageData.total_reviews || 0} {t("reviews")})
            </Typography>
          </Box>

          {/* Price */}

          <Price
            price={packageData.price}
            discountPrice={packageData.discount_price}
            currency={packageData.currency}
          />

          {/* Quick Information */}

          <Box sx={gridStyle}>
            <InfoCard
              icon={<CalendarMonthIcon />}
              title={t("duration")}
              value={`${packageData.duration_days || 0} ${t("days")}`}
            />

            <InfoCard
              icon={<CalendarMonthIcon />}
              title={t("startDate")}
              value={formatDate(packageData.start_date)}
            />

            <InfoCard
              icon={<CalendarMonthIcon />}
              title={t("endDate")}
              value={formatDate(packageData.end_date)}
            />

            <InfoCard
              icon={<PeopleIcon />}
              title={t("availableSeats")}
              value={availableSeats}
            />
          </Box>
        </CardContent>

        {/* Image Gallery */}

        <CardContent sx={{ py: 4 }}>
          <ImageGallery
            images={
              packageData.image
                ? [{ image_url: packageData.image }]
                : []
            }
            resourcePath="packages"
            resourceId={packageId}
            uploadPath={`/packages/${packageId}/image`}
            deletePath={`/packages/${packageId}/image`}
            fieldName="image"
            multiple={false}
            displayLimit={1}
            onRefresh={getPackage}
            title={t("image")}
          />
        </CardContent>
      </Card>

      {/* ================= Tabs ================= */}

      <Card sx={{ borderRadius: 3, mb: 4 }}>
        <Tabs
          value={tab}
          onChange={(_, value) => setTab(value)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label={t("overview")} />
          <Tab label={t("trips")} />
          <Tab label={t("hotels")} />
          <Tab label={t("Transports")} />
        </Tabs>
      </Card>

      {/* ================= Tab Content ================= */}

      {tab === 0 && (
        <Overview
          data={packageData}
          text={text}
          t={t}
        />
      )}

      {tab === 1 && (
        <Trips
          trips={packageData.trips}
          text={text}
          t={t}
        />
      )}

      {tab === 2 && (
        <Hotels
          hotels={packageData.hotels}
          text={text}
          t={t}
        />
      )}

      {tab === 3 && (
        <Transports
          transports={packageData.transports}
          text={text}
          t={t}
        />
      )}

      {/* ================= Edit Button ================= */}

      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() =>
            navigate(`/Packages/EditPackage/${packageData.id}`)
          }
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.3,
          }}
        >
          {t("edit")}
        </Button>
      </Box>
    </Container>
  );
}

/* =====================================================
   Overview
===================================================== */

function Overview({ data, text, t }) {
  return (
    <Box>
      <InfoSection
        title={t("description")}
        content={text(
          data.description_ar,
          data.description_en
        )}
      />

      <InfoSection
        title={t("includedServices")}
        content={text(
          data.included_services_ar,
          data.included_services_en
        )}
      />

      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
            {t("packageInformation")}
          </Typography>

          <Box sx={gridStyle}>
            <InfoCard
              title={t("maximumParticipants")}
              value={data.max_participants}
            />

            <InfoCard
              title={t("currentParticipants")}
              value={data.current_participants}
            />

            <InfoCard
              title={t("totalReviews")}
              value={data.total_reviews}
            />

            <InfoCard
              title={t("slug")}
              value={data.slug}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

/* =====================================================
   Trips
===================================================== */

function Trips({ trips = [], text, t }) {
  if (!trips.length) {
    return <EmptyText text={t("noTrips")} />;
  }

  return (
    <Box>
      {trips.map((trip) => (
        <Card
          key={trip.id}
          sx={{
            borderRadius: 3,
            mb: 3,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: { xs: "block", md: "flex" },
            }}
          >
            <Box
              sx={{
                width: { xs: "100%", md: "35%" },
                height: 250,
              }}
            >
              {trip.images?.[0]?.image_url ? (
                <Box
                  component="img"
                  src={trip.images[0].image_url}
                  alt={trip.title_en}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <EmptyImage icon={<FlightTakeoffIcon />} />
              )}
            </Box>

            <CardContent sx={{ flex: 1, p: 4 }}>
              <Chip
                label={trip.status || "-"}
                color="primary"
                size="small"
                sx={{ mb: 2 }}
              />

              <Typography variant="h5" fontWeight="bold">
                {text(trip.title_ar, trip.title_en)}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ lineHeight: 1.8, my: 2 }}
              >
                {text(
                  trip.description_ar,
                  trip.description_en
                )}
              </Typography>

              <Box sx={gridStyle}>
                <InfoCard
                  title={t("duration")}
                  value={`${trip.duration_days || 0} ${t("days")}`}
                />

                <InfoCard
                  title={t("price")}
                  value={`${trip.price || 0} ${trip.currency || ""}`}
                />

                <InfoCard
                  title={t("sortOrder")}
                  value={trip.PackageTrip?.sort_order || "-"}
                />
              </Box>
            </CardContent>
          </Box>
        </Card>
      ))}
    </Box>
  );
}

/* =====================================================
   Hotels
===================================================== */

function Hotels({ hotels = [], text, t }) {
  if (!hotels.length) {
    return <EmptyText text={t("noHotels")} />;
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "1fr 1fr",
        },
        gap: 3,
      }}
    >
      {hotels.map((hotel) => (
        <Card
          key={hotel.id}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {hotel.image ? (
            <Box
              component="img"
              src={hotel.image}
              alt={hotel.name_en}
              sx={{
                width: "100%",
                height: 220,
                objectFit: "cover",
              }}
            />
          ) : (
            <EmptyImage icon={<HotelIcon />} />
          )}

          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold">
              {text(hotel.name_ar, hotel.name_en)}
            </Typography>

            <Rating
              value={Number(hotel.stars || 0)}
              readOnly
              sx={{ my: 1 }}
            />

            <Typography
              color="text.secondary"
              sx={{ lineHeight: 1.8, mb: 2 }}
            >
              {text(
                hotel.description_ar,
                hotel.description_en
              )}
            </Typography>

            <InfoCard
              icon={<LocationOnIcon />}
              title={t("address")}
              value={text(
                hotel.address_ar,
                hotel.address_en
              )}
            />

            <Box sx={gridStyle}>
              <InfoCard
                title={t("pricePerNight")}
                value={`${hotel.price_per_night || 0} ${
                  hotel.currency || ""
                }`}
              />

              <InfoCard
                title={t("availableRooms")}
                value={hotel.available_rooms || 0}
              />

              <InfoCard
                title={t("nights")}
                value={hotel.PackageHotel?.nights || 0}
              />
            </Box>

            {hotel.contact_phone && (
              <InfoCard
                icon={<PhoneIcon />}
                title={t("phone")}
                value={hotel.contact_phone}
              />
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

/* =====================================================
   Transports
===================================================== */

function Transports({ transports = [], text, t }) {
  if (!transports.length) {
    return <EmptyText text={t("noTransport")} />;
  }

  return (
    <Box>
      {transports.map((transport) => (
        <Card
          key={transport.id}
          sx={{
            borderRadius: 3,
            mb: 3,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "primary.main",
                  color: "white",
                }}
              >
                <DirectionsCarIcon />
              </Box>

              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {text(
                    transport.name_ar,
                    transport.name_en
                  )}
                </Typography>

                <Typography color="text.secondary">
                  {transport.type || "-"}
                </Typography>
              </Box>
            </Box>

            <Typography sx={{ lineHeight: 1.8, mb: 3 }}>
              {text(
                transport.description_ar,
                transport.description_en
              )}
            </Typography>

            <Box sx={gridStyle}>
              <InfoCard
                title={t("route")}
                value={text(
                  transport.PackageTransport?.route_ar,
                  transport.PackageTransport?.route_en
                )}
              />

              <InfoCard
                title={t("capacity")}
                value={transport.capacity}
              />

              <InfoCard
                title={t("pricePerTrip")}
                value={`${transport.price_per_trip || 0} ${
                  transport.currency || ""
                }`}
              />

              <InfoCard
                title={t("company")}
                value={transport.company_name}
              />

              <InfoCard
                title={t("phone")}
                value={transport.contact_phone}
              />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

/* =====================================================
   Reusable Components
===================================================== */

function InfoCard({ icon, title, value }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: "background.default",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 1,
          color: "primary.main",
        }}
      >
        {icon}

        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Box>

      <Typography fontWeight="bold">
        {value ?? "-"}
      </Typography>
    </Box>
  );
}

function InfoSection({ title, content }) {
  return (
    <Card sx={{ borderRadius: 3, mb: 3 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
          {title}
        </Typography>

        <Typography
          sx={{
            lineHeight: 2,
            whiteSpace: "pre-line",
          }}
        >
          {content || "-"}
        </Typography>
      </CardContent>
    </Card>
  );
}

function Price({ price, discountPrice, currency }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="h3"
        fontWeight="bold"
        color="primary"
      >
        {discountPrice || price || 0} {currency || ""}
      </Typography>

      {discountPrice && (
        <Typography
          color="text.secondary"
          sx={{ textDecoration: "line-through" }}
        >
          {price || 0} {currency || ""}
        </Typography>
      )}
    </Box>
  );
}

function EmptyImage({ icon }) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: 220,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #6ea3dc, #4286ae)",
        color: "white",
      }}
    >
      {React.cloneElement(icon, {
        sx: { fontSize: 80 },
      })}
    </Box>
  );
}

function EmptyText({ text }) {
  return (
    <Typography color="text.secondary">
      {text}
    </Typography>
  );
}

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString();
}

/* =====================================================
   Shared Style
===================================================== */

const gridStyle = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    sm: "1fr 1fr",
    md: "1fr 1fr",
  },
  gap: 2,
};