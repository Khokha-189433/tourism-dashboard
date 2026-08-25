import React from "react";
import { useParams } from "react-router-dom";
import DestinationForm from "./DestinationForm";

export default function EditDestination() {
  const { destinationId } = useParams();

  return (
    <DestinationForm
      mode="edit"
      destinationId={destinationId}
    />
  );
}