import axios from "axios";

const api = axios.create({ baseURL: "/api" });

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    console.log("No refresh token available for refresh.");
    return null;
  }

  try {
    const response = await axios.post("/api/auth/refresh-token", {
      refresh_token: refreshToken,
    });

    const newAccessToken = response.data?.data?.access_token ?? response.data?.access_token;

    if (!newAccessToken) {
      console.log("Refresh response did not contain a new access token.");
      return null;
    }

    localStorage.setItem("accessToken", newAccessToken);
    return newAccessToken;
  } catch (err) {
    console.log("Refresh failed:", err.response?.data || err.message);
    console.log("Refresh Error:", err.response?.status);
    return null;
  }
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;