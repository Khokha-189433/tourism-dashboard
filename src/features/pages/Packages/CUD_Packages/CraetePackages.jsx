import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../../../api/refreshToken";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import {
  Add,
  Delete,
  Hotel,
  DirectionsBus,
  Hiking,
  Save,
  ArrowBack,
} from "@mui/icons-material";

export default function CreatePackage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const isArabic = i18n.language === "ar";

  // =========================
  // State
  // =========================

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [trips, setTrips] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [transports, setTransports] = useState([]);

  const [formData, setFormData] = useState({
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    price: "",
    currency: "SYP",
    discount_price: "",
    duration_days: "",
    start_date: "",
    end_date: "",
    max_participants: "",
    included_services_ar: "",
    included_services_en: "",
    status: "published",
    is_featured: false,
  });

  // Selected relations
  const [selectedTripIds, setSelectedTripIds] = useState([]);
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [selectedTransports, setSelectedTransports] = useState([]);

  const [selectedHotelId, setSelectedHotelId] = useState("");
  const [hotelNights, setHotelNights] = useState(1);

  const [selectedTransportId, setSelectedTransportId] = useState("");
  const [routeAr, setRouteAr] = useState("");
  const [routeEn, setRouteEn] = useState("");

  // =========================
  // Load Trips / Hotels / Transports
  // =========================

  useEffect(() => {
    const getPackageRelatedData = async () => {
    try {
      setLoadingData(true);
      setError("");

      const [tripsRes, hotelsRes, transportsRes] = await Promise.all([
        api.get("/trips"),
        api.get("/hotels"),
        api.get("/transports"),
      ]);

      const getData = (response, key) =>
        response.data?.data ??
        response.data?.[key] ??
        response.data ??
        [];

      setTrips(getData(tripsRes, "trips"));
      setHotels(getData(hotelsRes, "hotels"));
      setTransports(getData(transportsRes, "transports"));
    } catch (err) {
      console.error("Error loading package data:", err);

      setError(
        err.response?.data?.message ||
          t("packages.errors.loadData")
      );
    } finally {
      setLoadingData(false);
    }
  };
    getPackageRelatedData();
  }, []);
  
  // =========================
  // Basic form handlers
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeaturedChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      is_featured: e.target.checked,
    }));
  };

  const handleTripChange = (e) => {
    const value = e.target.value;

    setSelectedTripIds(
      typeof value === "string"
        ? value.split(",").map(Number)
        : value.map(Number)
    );
  };

  // =========================
  // Hotels
  // =========================

  const handleAddHotel = () => {
    if (!selectedHotelId) return;

    const hotelId = Number(selectedHotelId);

    if (selectedHotels.some((hotel) => hotel.hotel_id === hotelId)) {
      setError(t("packages.errors.hotelAlreadyAdded"));
      return;
    }

    setSelectedHotels((prev) => [
      ...prev,
      {
        hotel_id: hotelId,
        nights: Number(hotelNights),
      },
    ]);

    setSelectedHotelId("");
    setHotelNights(1);
    setError("");
  };

  const handleRemoveHotel = (hotelId) => {
    setSelectedHotels((prev) =>
      prev.filter((hotel) => hotel.hotel_id !== hotelId)
    );
  };

  // =========================
  // Transports
  // =========================

  const handleAddTransport = () => {
    if (!selectedTransportId) return;

    const transportId = Number(selectedTransportId);

    if (
      selectedTransports.some(
        (transport) => transport.transport_id === transportId
      )
    ) {
      setError(t("packages.errors.transportAlreadyAdded"));
      return;
    }

    setSelectedTransports((prev) => [
      ...prev,
      {
        transport_id: transportId,
        route_ar: routeAr,
        route_en: routeEn,
      },
    ]);

    setSelectedTransportId("");
    setRouteAr("");
    setRouteEn("");
    setError("");
  };

  const handleRemoveTransport = (transportId) => {
    setSelectedTransports((prev) =>
      prev.filter(
        (transport) => transport.transport_id !== transportId
      )
    );
  };

  // =========================
  // Get names by ID
  // =========================

  const getHotelName = (id) => {
    const hotel = hotels.find((item) => item.id === id);

    return hotel
      ? isArabic
        ? hotel.name_ar
        : hotel.name_en
      : "-";
  };

  const getTransportName = (id) => {
    const transport = transports.find((item) => item.id === id);

    return transport
      ? isArabic
        ? transport.name_ar
        : transport.name_en
      : "-";
  };

  const getTripName = (id) => {
    const trip = trips.find((item) => item.id === id);

    return trip
      ? isArabic
        ? trip.title_ar
        : trip.title_en
      : "-";
  };

  // =========================
  // Submit Package
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Validation
    const requiredFields = [
      ["title_ar", "packages.errors.titleAr"],
      ["title_en", "packages.errors.titleEn"],
      ["price", "packages.errors.price"],
      ["duration_days", "packages.errors.duration"],
      ["max_participants", "packages.errors.maxParticipants"],
    ];

    for (const [field, message] of requiredFields) {
      if (!String(formData[field]).trim()) {
        setError(t(message));
        return;
      }
    }

    if (!formData.start_date || !formData.end_date) {
      setError(t("packages.errors.dates"));
      return;
    }

    if (!["SYP", "USD"].includes(formData.currency)) {
      setError(t("packages.errors.currency"));
      return;
    }

    if (Number(formData.price) <= 0) {
      setError(t("packages.errors.pricePositive"));
      return;
    }

    if (
      formData.discount_price &&
      Number(formData.discount_price) <= 0
    ) {
      setError(t("packages.errors.discountPositive"));
      return;
    }

    // Payload
    const payload = {
      title_ar: formData.title_ar.trim(),
      title_en: formData.title_en.trim(),

      description_ar: formData.description_ar.trim(),
      description_en: formData.description_en.trim(),

      price: Number(formData.price),
      currency: formData.currency,

      discount_price: formData.discount_price
        ? Number(formData.discount_price)
        : null,

      duration_days: Number(formData.duration_days),

      start_date: formData.start_date,
      end_date: formData.end_date,

      max_participants: Number(formData.max_participants),

      included_services_ar:
        formData.included_services_ar.trim(),

      included_services_en:
        formData.included_services_en.trim(),

      status: formData.status,
      is_featured: formData.is_featured,

      trip_ids: selectedTripIds,
      hotel_ids: selectedHotels,
      transport_ids: selectedTransports,
    };

    try {
      setLoading(true);

      await api.post("/packages", payload);

      setSuccess(t("packages.success"));

      setTimeout(() => {
        navigate("/packages");
      }, 1500);
    } catch (err) {
      console.error("Create Package Error:", err);

      setError(
        err.response?.data?.message ||
          t("packages.errors.createFailed")
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Loading
  // =========================

  if (loadingData) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {t("packages.addPackage")}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {t("packages.createSubtitle")}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/packages")}
        >
          {t("back")}
        </Button>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>

        {/* =========================
            Basic Information
        ========================= */}

        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} mb={2}>
              {t("packages.basicInformation")}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label={t("packages.titleAr")}
                  name="title_ar"
                  value={formData.title_ar}
                  onChange={handleChange}
                  dir="rtl"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label={t("packages.titleEn")}
                  name="title_en"
                  value={formData.title_en}
                  onChange={handleChange}
                  dir="ltr"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label={t("packages.descriptionAr")}
                  name="description_ar"
                  value={formData.description_ar}
                  onChange={handleChange}
                  dir="rtl"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label={t("packages.descriptionEn")}
                  name="description_en"
                  value={formData.description_en}
                  onChange={handleChange}
                  dir="ltr"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* =========================
            Price & Duration
        ========================= */}

        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} mb={2}>
              {t("packages.priceAndDuration")}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label={t("packages.price")}
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  select
                  fullWidth
                  label={t("packages.currency")}
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                >
                  {["SYP", "USD"].map((currency) => (
                    <MenuItem key={currency} value={currency}>
                      {currency}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label={t("packages.discountPrice")}
                  name="discount_price"
                  value={formData.discount_price}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label={t("packages.duration")}
                  name="duration_days"
                  value={formData.duration_days}
                  onChange={handleChange}
                  inputProps={{ min: 1 }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  label={t("packages.startDate")}
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  label={t("packages.endDate")}
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label={t("packages.maxParticipants")}
                  name="max_participants"
                  value={formData.max_participants}
                  onChange={handleChange}
                  inputProps={{ min: 1 }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* =========================
            Included Services
        ========================= */}

        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} mb={2}>
              {t("packages.includedServices")}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label={t("packages.includedServicesAr")}
                  name="included_services_ar"
                  value={formData.included_services_ar}
                  onChange={handleChange}
                  dir="rtl"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label={t("packages.includedServicesEn")}
                  name="included_services_en"
                  value={formData.included_services_en}
                  onChange={handleChange}
                  dir="ltr"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* =========================
            Trips
        ========================= */}

        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <SectionTitle
              icon={<Hiking color="primary" />}
              title={t("packages.trips")}
            />

            <FormControl fullWidth>
              <InputLabel>
                {t("packages.selectTrips")}
              </InputLabel>

              <Select
                multiple
                value={selectedTripIds}
                onChange={handleTripChange}
                label={t("packages.selectTrips")}
                renderValue={(selected) => (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 0.5,
                      flexWrap: "wrap",
                    }}
                  >
                    {selected.map((id) => (
                      <Chip
                        key={id}
                        label={getTripName(id)}
                        size="small"
                      />
                    ))}
                  </Box>
                )}
              >
                {trips.length === 0 ? (
                  <MenuItem disabled>
                    {t("packages.noTrips")}
                  </MenuItem>
                ) : (
                  trips.map((trip) => (
                    <MenuItem key={trip.id} value={trip.id}>
                      {isArabic
                        ? trip.title_ar
                        : trip.title_en}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </CardContent>
        </Card>

        {/* =========================
            Hotels
        ========================= */}

        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <SectionTitle
              icon={<Hotel color="primary" />}
              title={t("packages.hotels")}
            />

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={7}>
                <FormControl fullWidth>
                  <InputLabel>
                    {t("packages.selectHotel")}
                  </InputLabel>

                  <Select
                    value={selectedHotelId}
                    onChange={(e) =>
                      setSelectedHotelId(e.target.value)
                    }
                    label={t("packages.selectHotel")}
                  >
                    <MenuItem value="">
                      <em>{t("packages.select")}</em>
                    </MenuItem>

                    {hotels.map((hotel) => (
                      <MenuItem key={hotel.id} value={hotel.id}>
                        {isArabic
                          ? hotel.name_ar
                          : hotel.name_en}
                        {" - "}
                        {hotel.stars} ⭐
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label={t("packages.nights")}
                  value={hotelNights}
                  onChange={(e) =>
                    setHotelNights(e.target.value)
                  }
                  inputProps={{ min: 1 }}
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddHotel}
                >
                  {t("packages.add")}
                </Button>
              </Grid>
            </Grid>

            <SelectedItems
              items={selectedHotels}
              getName={(item) =>
                getHotelName(item.hotel_id)
              }
              secondary={(item) =>
                `${item.nights} ${t("packages.nights")}`
              }
              onRemove={(item) =>
                handleRemoveHotel(item.hotel_id)
              }
              removeText={t("packages.remove")}
            />
          </CardContent>
        </Card>

        {/* =========================
            Transports
        ========================= */}

        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <SectionTitle
              icon={<DirectionsBus color="primary" />}
              title={t("packages.transports")}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>
                    {t("packages.selectTransport")}
                  </InputLabel>

                  <Select
                    value={selectedTransportId}
                    onChange={(e) =>
                      setSelectedTransportId(e.target.value)
                    }
                    label={t("packages.selectTransport")}
                  >
                    <MenuItem value="">
                      <em>{t("packages.select")}</em>
                    </MenuItem>

                    {transports.map((transport) => (
                      <MenuItem
                        key={transport.id}
                        value={transport.id}
                      >
                        {isArabic
                          ? transport.name_ar
                          : transport.name_en}
                        {" - "}
                        {transport.capacity}{" "}
                        {t("packages.seats")}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={t("packages.routeAr")}
                  value={routeAr}
                  onChange={(e) => setRouteAr(e.target.value)}
                  dir="rtl"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={t("packages.routeEn")}
                  value={routeEn}
                  onChange={(e) => setRouteEn(e.target.value)}
                  dir="ltr"
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddTransport}
                >
                  {t("packages.addTransport")}
                </Button>
              </Grid>
            </Grid>

            <SelectedItems
              items={selectedTransports}
              getName={(item) =>
                getTransportName(item.transport_id)
              }
              secondary={(item) =>
                isArabic
                  ? item.route_ar
                  : item.route_en
              }
              onRemove={(item) =>
                handleRemoveTransport(item.transport_id)
              }
              removeText={t("packages.remove")}
            />
          </CardContent>
        </Card>

        {/* =========================
            Settings
        ========================= */}

        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} mb={2}>
              {t("packages.settings")}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label={t("packages.status")}
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <MenuItem value="published">
                    {t("packages.published")}
                  </MenuItem>

                  <MenuItem value="draft">
                    {t("packages.draft")}
                  </MenuItem>

                  <MenuItem value="cancelled">
                    {t("packages.cancelled")}
                  </MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_featured}
                      onChange={handleFeaturedChange}
                    />
                  }
                  label={t("packages.isFeatured")}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* =========================
            Submit
        ========================= */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mb: 4,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate("/packages")}
            disabled={loading}
          >
            {t("cancel")}
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Save />
              )
            }
            sx={{ minWidth: 180 }}
          >
            {loading
              ? t("saving")
              : t("packages.create")}
          </Button>
        </Box>
      </form>
    </Box>
  );
}

// =====================================================
// Reusable Section Title
// =====================================================

function SectionTitle({ icon, title }) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
        }}
      >
        {icon}

        <Typography variant="h6" fontWeight={700}>
          {title}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />
    </>
  );
}

// =====================================================
// Reusable Selected Items
// =====================================================

function SelectedItems({
  items,
  getName,
  secondary,
  onRemove,
  removeText,
}) {
  if (!items.length) return null;

  return (
    <Stack spacing={1} sx={{ mt: 3 }}>
      {items.map((item, index) => (
        <Box
          key={item.hotel_id ?? item.transport_id ?? index}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1.5,
            borderRadius: 2,
            backgroundColor: "action.hover",
          }}
        >
          <Box>
            <Typography fontWeight={600}>
              {getName(item)}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              {secondary(item)}
            </Typography>
          </Box>

          <Button
            color="error"
            startIcon={<Delete />}
            onClick={() => onRemove(item)}
          >
            {removeText}
          </Button>
        </Box>
      ))}
    </Stack>
  );
}