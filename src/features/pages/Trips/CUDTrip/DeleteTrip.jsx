import api from "../../../../api/refreshToken";

export const deleteTrip = async (tripId) => {
  return await api.delete(`/trips/${tripId}`);
};