import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import ImageGallery from "../../../components/UI/ImageGallery";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../../../api/refreshToken";

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

import { useTranslation } from "react-i18next";

export default function PackageDetails() {
  const { packageId } = useParams();

  const navigate = useNavigate();

  const { i18n, t } = useTranslation();

  const [packageData, setPackageData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [tab, setTab] = useState(0);

  // ==========================================
  // جلب بيانات الباقة
  // ==========================================

const getPackage = useCallback(async () => {
  try {
    setLoading(true);

    const response = await api.get(
      `/packages/${packageId}`
    );

    setPackageData(
      response.data?.data ||
      response.data
    );

  } catch (error) {

    console.error(
      "Error fetching package:",
      error
    );

    alert(t("packageFetchError"));

    navigate("/Packages");

  } finally {

    setLoading(false);

  }
}, [packageId, navigate, t]);

  // ==========================================
  // تشغيل جلب البيانات
  // ==========================================
useEffect(() => {

  const loadPackage = async () => {
    await getPackage();
  };

  loadPackage();

}, [getPackage]); 
  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{ py: 8 }}
      >
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

  // ==========================================
  // لا توجد بيانات
  // ==========================================

  if (!packageData) {
    return (
      <Container
        maxWidth="lg"
        sx={{ py: 8 }}
      >
        <Typography
          variant="h6"
          textAlign="center"
        >
          {t("packageNotFound")}
        </Typography>
      </Container>
    );
  }

  // ==========================================
  // تغيير التبويب
  // ==========================================

  const changeTab = (
    event,
    newValue
  ) => {
    setTab(newValue);
  };

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 5 }}
    >

      {/* ======================================
          Header
      ====================================== */}

      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >

        <Button
          startIcon={
            <ArrowBackIcon />
          }
          onClick={() =>
            navigate("/Packages")
          }
        >
          {t("back")}
        </Button>

        <Box
          sx={{
            textAlign: "right",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent:
                "flex-end",
              gap: 1,
            }}
          >
            <FlightTakeoffIcon
              sx={{
                color: "#6ea3dc",
                fontSize: 32,
              }}
            />

            <Typography
              variant="h4"
              fontWeight="bold"
            >
              {t(
                "packageDetails"
              )}
            </Typography>
          </Box>

          <Typography
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            {t(
              "packageDetailsDescription"
            )}
          </Typography>
        </Box>

      </Box>

      {/* ======================================
          Hero
      ====================================== */}

      <Card
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          mb: 4,
          boxShadow:
            "0 6px 25px rgba(0,0,0,0.08)",
        }}
      >

        {/* صورة الباقة */}

        <Box
          sx={{
            height: {
              xs: 250,
              md: 420,
            },
            position: "relative",
          }}
        >
          {packageData.image ? (

      <Box
        component="img"
        src={packageData.image}
        alt={packageData.title_en}
        sx={{
          width: "100%",
          height: 420,
          objectFit: "cover",
          borderRadius:3
        }}
      />

    ) : (

      <Box
        sx={{
          width: "100%",
          height: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #6ea3dc, #4286ae)",
        }}
      >

        <FlightTakeoffIcon
          sx={{
            fontSize: 100,
            color: "white",
          }}
        />

      </Box>

    )}
          {/* الحالة */}

          <Chip
            label={
              packageData.status ||
              "-"
            }
            color={
              packageData.status ===
              "active"
                ? "success"
                : "default"
            }
            sx={{
              position:
                "absolute",
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
                position:
                  "absolute",
                top: 20,
                right: 20,
                fontWeight:
                  "bold",
              }}
            />
          )}

        </Box>
       {/* ================= Image Gallery ================= */}



        {/* معلومات الباقة */}

        <CardContent
          sx={{
            p: {
              xs: 3,
              md: 5,
            },
          }}
        >

          {/* الاسم */}

          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{ mb: 1 }}
          >
            {i18n.language === "ar"
              ? packageData.title_ar ||
                packageData.title_en
              : packageData.title_en ||
                packageData.title_ar}
          </Typography>

          {/* الاسم باللغة الأخرى */}

          <Typography
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            {i18n.language === "ar"
              ? packageData.title_en ||
                packageData.title_ar
              : packageData.title_ar ||
                packageData.title_en}
          </Typography>

          <Divider
            sx={{ mb: 3 }}
          />

          {/* الوصف */}

          <Typography
            sx={{
              lineHeight: 2,
              mb: 3,
            }}
          >
            {i18n.language === "ar"
              ? packageData.description_ar ||
                packageData.description_en
              : packageData.description_en ||
                packageData.description_ar}
          </Typography>

          {/* التقييم */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 3,
            }}
          >
            <Rating
              value={Number(
                packageData.average_rating ||
                  0
              )}
              readOnly
              precision={0.1}
            />

            <Typography
              fontWeight="bold"
            >
              {packageData.average_rating ||
                0}
            </Typography>

            <Typography
              color="text.secondary"
            >
              (
              {packageData.total_reviews ||
                0}{" "}
              {t("reviews")})
            </Typography>
          </Box>

          {/* السعر */}

          <Box sx={{ mb: 3 }}>

            {packageData.discount_price ? (
              <>
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  color="primary"
                >
                  {
                    packageData.discount_price
                  }{" "}
                  {
                    packageData.currency
                  }
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{
                    textDecoration:
                      "line-through",
                  }}
                >
                  {
                    packageData.price
                  }{" "}
                  {
                    packageData.currency
                  }
                </Typography>
              </>
            ) : (
              <Typography
                variant="h3"
                fontWeight="bold"
                color="primary"
              >
                {
                  packageData.price
                }{" "}
                {
                  packageData.currency
                }
              </Typography>
            )}

          </Box>
       
          {/* معلومات سريعة */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 1fr 1fr",
              },
              gap: 2,
            }}
          >

            <InfoCard
              icon={
                <CalendarMonthIcon />
              }
              title={t("duration")}
              value={`${packageData.duration_days || 0} ${t(
                "days"
              )}`}
            />

            <InfoCard
              icon={
                <CalendarMonthIcon />
              }
              title={t("startDate")}
              value={
                packageData.start_date
                  ? new Date(
                      packageData.start_date
                    ).toLocaleDateString()
                  : "-"
              }
            />

            <InfoCard
              icon={
                <CalendarMonthIcon />
              }
              title={t("endDate")}
              value={
                packageData.end_date
                  ? new Date(
                      packageData.end_date
                    ).toLocaleDateString()
                  : "-"
              }
            />

            <InfoCard
              icon={
                <PeopleIcon />
              }
              title={t(
                "availableSeats"
              )}
              value={
                (packageData.max_participants ||
                  0) -
                (packageData.current_participants ||
                  0)
              }
            />

          </Box>

        </CardContent>
           {/*      */}
     <CardContent sx={{ py: 4 }}>
       <ImageGallery
         images={
         packageData.image
         ? [
            {
              image_url: packageData.image,
            },
          ]
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

      {/* ======================================
          Tabs
      ====================================== */}

      <Card
        sx={{
          borderRadius: 3,
          mb: 4,
        }}
      >

        <Tabs
          value={tab}
          onChange={changeTab}
          variant="scrollable"
          scrollButtons="auto"
        >

          <Tab
            label={t("overview")}
          />

          <Tab
            label={t("trips")}
          />

          <Tab
            label={t("hotels")}
          />

          <Tab
            label={t("Transports")}
          />

        </Tabs>

      </Card>

      {/* ======================================
          المحتوى + كرت الحجز
      ====================================== */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "2fr 1fr",
          },
          gap: 3,
          alignItems:
            "start",
        }}
      >

        {/* ====================================
            المحتوى
        ==================================== */}

        <Box>

          {/* ==================================
              Overview
          ================================== */}

          {tab === 0 && (

            <Box>

              {/* الوصف */}

              <Card
                sx={{
                  borderRadius: 3,
                  mb: 3,
                }}
              >

                <CardContent
                  sx={{ p: 4 }}
                >

                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ mb: 3 }}
                  >
                    {t(
                      "description"
                    )}
                  </Typography>

                  <Typography
                    sx={{
                      lineHeight: 2,
                      mb: 2,
                    }}
                  >
                    {i18n.language ===
                    "ar"
                      ? packageData.description_ar ||
                        packageData.description_en
                      : packageData.description_en ||
                        packageData.description_ar}
                  </Typography>

                </CardContent>

              </Card>

              {/* الخدمات */}

              <Card
                sx={{
                  borderRadius: 3,
                  mb: 3,
                }}
              >

                <CardContent
                  sx={{ p: 4 }}
                >

                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ mb: 3 }}
                  >
                    {t(
                      "includedServices"
                    )}
                  </Typography>

                  <Typography
                    sx={{
                      lineHeight: 2,
                      whiteSpace:
                        "pre-line",
                    }}
                  >
                    {i18n.language ===
                    "ar"
                      ? packageData.included_services_ar ||
                        "-"
                      : packageData.included_services_en ||
                        "-"}
                  </Typography>

                </CardContent>

              </Card>

              {/* معلومات الباقة */}

              <Card
                sx={{
                  borderRadius: 3,
                }}
              >

                <CardContent
                  sx={{ p: 4 }}
                >

                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ mb: 3 }}
                  >
                    {t(
                      "packageInformation"
                    )}
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "1fr 1fr",
                      },
                      gap: 2,
                    }}
                  >

                    <InfoCard
                      title={t(
                        "maximumParticipants"
                      )}
                      value={
                        packageData.max_participants
                      }
                    />

                    <InfoCard
                      title={t(
                        "currentParticipants"
                      )}
                      value={
                        packageData.current_participants
                      }
                    />

                    <InfoCard
                      title={t(
                        "totalReviews"
                      )}
                      value={
                        packageData.total_reviews
                      }
                    />

                    <InfoCard
                      title={t("slug")}
                      value={
                        packageData.slug
                      }
                    />

                  </Box>

                </CardContent>

              </Card>

            </Box>
          )}

          {/* ==================================
              Trips
          ================================== */}

          {tab === 1 && (

            <Box>

              {packageData.trips &&
              packageData.trips.length > 0 ? (

                packageData.trips.map(
                  (trip) => (

                    <Card
                      key={trip.id}
                      sx={{
                        borderRadius: 3,
                        mb: 3,
                        overflow:
                          "hidden",
                      }}
                    >

                      <Box
                        sx={{
                          display: {
                            xs: "block",
                            md: "flex",
                          },
                        }}
                      >

                        {/* صورة الرحلة */}

                        <Box
                          sx={{
                            width: {
                              xs: "100%",
                              md: "35%",
                            },
                            height: 250,
                          }}
                        >

                          {trip.images?.[0]
                            ?.image_url ? (

                            <Box
                              component="img"
                              src={
                                trip
                                  .images[0]
                                  .image_url
                              }
                              alt={
                                trip.title_en
                              }
                              sx={{
                                width:
                                  "100%",
                                height:
                                  "100%",
                                objectFit:
                                  "cover",
                              }}
                            />

                          ) : (

                            <Box
                              sx={{
                                width:
                                  "100%",
                                height:
                                  "100%",
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "center",
                                background:
                                  "linear-gradient(135deg, #6ea3dc, #4286ae)",
                              }}
                            >
                              <FlightTakeoffIcon
                                sx={{
                                  fontSize: 70,
                                  color:
                                    "white",
                                }}
                              />
                            </Box>

                          )}

                        </Box>

                        {/* معلومات الرحلة */}

                        <CardContent
                          sx={{
                            flex: 1,
                            p: 4,
                          }}
                        >

                          <Chip
                            label={
                              trip.status ||
                              "-"
                            }
                            color="primary"
                            size="small"
                            sx={{
                              mb: 2,
                            }}
                          />

                          <Typography
                            variant="h5"
                            fontWeight="bold"
                            sx={{
                              mb: 1,
                            }}
                          >
                            {i18n.language ===
                            "ar"
                              ? trip.title_ar ||
                                trip.title_en
                              : trip.title_en ||
                                trip.title_ar}
                          </Typography>

                          <Typography
                            color="text.secondary"
                            sx={{
                              lineHeight: 1.8,
                              mb: 3,
                            }}
                          >
                            {i18n.language ===
                            "ar"
                              ? trip.description_ar ||
                                trip.description_en
                              : trip.description_en ||
                                trip.description_ar}
                          </Typography>

                          <Box
                            sx={{
                              display:
                                "grid",
                              gridTemplateColumns: {
                                xs: "1fr",
                                sm: "1fr 1fr",
                              },
                              gap: 2,
                            }}
                          >

                            <InfoCard
                              title={t(
                                "duration"
                              )}
                              value={`${trip.duration_days || 0} ${t(
                                "days"
                              )}`}
                            />

                            <InfoCard
                              title={t(
                                "price"
                              )}
                              value={`${trip.price || 0} ${
                                trip.currency ||
                                ""
                              }`}
                            />

                            <InfoCard
                              title={t(
                                "sortOrder"
                              )}
                              value={
                                trip
                                  .PackageTrip
                                  ?.sort_order ||
                                "-"
                              }
                            />

                          </Box>

                        </CardContent>

                      </Box>

                    </Card>

                  )
                )

              ) : (

                <Typography
                  color="text.secondary"
                >
                  {t("noTrips")}
                </Typography>

              )}

            </Box>
          )}

          {/* ==================================
              Hotels
          ================================== */}

          {tab === 2 && (

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

              {packageData.hotels &&
              packageData.hotels.length > 0 ? (

                packageData.hotels.map(
                  (hotel) => (

                    <Card
                      key={hotel.id}
                      sx={{
                        borderRadius: 3,
                        overflow:
                          "hidden",
                      }}
                    >

                      {/* صورة الفندق */}

                      {hotel.image ? (

                        <Box
                          component="img"
                          src={
                            hotel.image
                          }
                          alt={
                            hotel.name_en
                          }
                          sx={{
                            width:
                              "100%",
                            height: 220,
                            objectFit:
                              "cover",
                          }}
                        />

                      ) : (

                        <Box
                          sx={{
                            height: 220,
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            background:
                              "linear-gradient(135deg, #6ea3dc, #4286ae)",
                          }}
                        >
                          <HotelIcon
                            sx={{
                              fontSize: 80,
                              color:
                                "white",
                            }}
                          />
                        </Box>

                      )}

                      <CardContent
                        sx={{ p: 3 }}
                      >

                        <Typography
                          variant="h5"
                          fontWeight="bold"
                          sx={{
                            mb: 1,
                          }}
                        >
                          {i18n.language ===
                          "ar"
                            ? hotel.name_ar ||
                              hotel.name_en
                            : hotel.name_en ||
                              hotel.name_ar}
                        </Typography>

                        <Rating
                          value={Number(
                            hotel.stars ||
                              0
                          )}
                          readOnly
                          sx={{
                            mb: 2,
                          }}
                        />

                        <Typography
                          color="text.secondary"
                          sx={{
                            lineHeight:
                              1.8,
                            mb: 2,
                          }}
                        >
                          {i18n.language ===
                          "ar"
                            ? hotel.description_ar ||
                              hotel.description_en
                            : hotel.description_en ||
                              hotel.description_ar}
                        </Typography>

                        <InfoCard
                          icon={
                            <LocationOnIcon />
                          }
                          title={t(
                            "address"
                          )}
                          value={
                            i18n.language ===
                            "ar"
                              ? hotel.address_ar ||
                                hotel.address_en
                              : hotel.address_en ||
                                hotel.address_ar
                          }
                        />

                        <Box
                          sx={{
                            display:
                              "grid",
                            gridTemplateColumns:
                              "1fr 1fr",
                            gap: 2,
                            mt: 2,
                          }}
                        >

                          <InfoCard
                            title={t(
                              "pricePerNight"
                            )}
                            value={`${hotel.price_per_night || 0} ${
                              hotel.currency ||
                              ""
                            }`}
                          />

                          <InfoCard
                            title={t(
                              "availableRooms"
                            )}
                            value={
                              hotel.available_rooms ||
                              0
                            }
                          />

                          <InfoCard
                            title={t(
                              "nights"
                            )}
                            value={
                              hotel
                                .PackageHotel
                                ?.nights ||
                              0
                            }
                          />

                        </Box>
                        
                        {hotel.contact_phone && (
                            
                          <Box
                            sx={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: 1,
                              mt: 2,
                            }}
                          >
                     <InfoCard
                          icon={
                            <PhoneIcon />
                          }
                          title={t(
                            "phone"
                          )}
                          value={
                             hotel.contact_phone}
                        />
                   
                          </Box>
                        )}

                      </CardContent>

                    </Card>

                  )
                )

              ) : (

                <Typography
                  color="text.secondary"
                >
                  {t("noHotels")}
                </Typography>

              )}

            </Box>
          )}

          {/* ==================================
              Transport
          ================================== */}

          {tab === 3 && (

            <Box>

              {packageData.transports &&
              packageData.transports.length > 0 ? (

                packageData.transports.map(
                  (transport) => (

                    <Card
                      key={
                        transport.id
                      }
                      sx={{
                        borderRadius: 3,
                        mb: 3,
                      }}
                    >

                      <CardContent
                        sx={{ p: 4 }}
                      >

                        <Box
                          sx={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap: 2,
                            mb: 3,
                          }}
                        >

                          <Box
                            sx={{
                              width: 60,
                              height: 60,
                              borderRadius:
                                2,
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              backgroundColor:
                                "primary.main",
                              color:
                                "white",
                            }}
                          >
                            <DirectionsCarIcon />
                          </Box>

                          <Box>

                            <Typography
                              variant="h5"
                              fontWeight="bold"
                            >
                              {i18n.language ===
                              "ar"
                                ? transport.name_ar ||
                                  transport.name_en
                                : transport.name_en ||
                                  transport.name_ar}
                            </Typography>

                            <Typography
                              color="text.secondary"
                            >
                              {
                                transport.type
                              }
                            </Typography>

                          </Box>

                        </Box>

                        <Typography
                          sx={{
                            lineHeight:
                              1.8,
                            mb: 3,
                          }}
                        >
                          {i18n.language ===
                          "ar"
                            ? transport.description_ar ||
                              transport.description_en
                            : transport.description_en ||
                              transport.description_ar}
                        </Typography>

                        <Box
                          sx={{
                            display:
                              "grid",
                            gridTemplateColumns: {
                              xs: "1fr",
                              sm: "1fr 1fr",
                            },
                            gap: 2,
                          }}
                        >

                          <InfoCard
                            title={t(
                              "route"
                            )}
                            value={
                              i18n.language ===
                              "ar"
                                ? transport
                                    .PackageTransport
                                    ?.route_ar ||
                                  transport
                                    .PackageTransport
                                    ?.route_en
                                : transport
                                    .PackageTransport
                                    ?.route_en ||
                                  transport
                                    .PackageTransport
                                    ?.route_ar
                            }
                          />

                          <InfoCard
                            title={t(
                              "capacity"
                            )}
                            value={
                              transport.capacity
                            }
                          />

                          <InfoCard
                            title={t(
                              "pricePerTrip"
                            )}
                            value={`${transport.price_per_trip || 0} ${
                              transport.currency ||
                              ""
                            }`}
                          />

                          <InfoCard
                            title={t(
                              "company"
                            )}
                            value={
                              transport.company_name
                            }
                          />

                          <InfoCard
                            title={t(
                              "phone"
                            )}
                            value={
                              transport.contact_phone
                            }
                          />

                        </Box>

                      </CardContent>

                    </Card>

                  )
                )

              ) : (

                <Typography
                  color="text.secondary"
                >
                  {t(
                    "noTransport"
                  )}
                </Typography>

              )}

            </Box>
          )}

        </Box>

        {/* ====================================
            Sticky Booking Card
        ==================================== */}

        <Box
          sx={{
            position: {
              xs: "static",
              lg: "sticky",
            },
            top: 20,
          }}
        >

          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 4,
            }}
          >

            <CardContent
              sx={{ p: 4 }}
            >

              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ mb: 3 }}
              >
                {t(
                  "bookPackage"
                )}
              </Typography>

              <Divider
                sx={{ mb: 3 }}
              />

              {/* السعر */}

              <Typography
                variant="h3"
                color="primary"
                fontWeight="bold"
              >
                {packageData.discount_price ||
                  packageData.price ||
                  0}{" "}
                {
                  packageData.currency
                }
              </Typography>

              {/* المقاعد */}

              <Box sx={{ mt: 3 }}>

                <InfoCard
                  icon={
                    <PeopleIcon />
                  }
                  title={t(
                    "availableSeats"
                  )}
                  value={
                    (packageData.max_participants ||
                      0) -
                    (packageData.current_participants ||
                      0)
                  }
                />

              </Box>

              {/* زر الحجز */}

              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 3,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight:
                    "bold",
                  textTransform:
                    "none",
                }}
              >
                {t("bookNow")}
              </Button>

            </CardContent>

          </Card>

        </Box>

      </Box>

      {/* ======================================
          Edit Button
      ====================================== */}

      <Box sx={{ mt: 4 }}>

        <Button
          variant="contained"
          startIcon={
            <EditIcon />
          }
          onClick={() =>
            navigate(
              `/Packages/EditPackage/${packageData.id}`
            )
          }
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.3,
            textTransform:
              "none",
          }}
        >
          {t("edit")}
        </Button>

      </Box>

    </Container>
  );
}


// ==========================================
// Info Card
// ==========================================

function InfoCard({
  icon,
  title,
  value,
}) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor:
          "background.default",
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
          color: "#4286ae",
        }}
      >
        {icon}

        <Typography
          variant="body2"
          color="text.secondary"
        >
          {title}
        </Typography>
      </Box>

      <Typography
        fontWeight="bold"
      >
        {value || "-"}
      </Typography>

    </Box>
  );
}