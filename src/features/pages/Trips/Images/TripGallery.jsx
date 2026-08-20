import React from "react";
import ImageGallery from "../../../../components/UI/ImageGallery";

// معرض صور الرحلة باستخدام المكون المشترك للمشروع.
export default function TripGallery({ trip, TripId, getTrip }) {
  return (
    <ImageGallery
      images={trip?.images || []}
      resourcePath="trips"
      resourceId={TripId}
      onRefresh={getTrip}
      title="معرض صور الرحلة"
    />
  );
}
