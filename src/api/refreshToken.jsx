import axios from "axios";

const api = axios.create({ baseURL: "/api" });

const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await axios.post("/api/auth/refresh-token", { refreshToken });
    const newAccessToken = response.data.access_token;
    localStorage.setItem("accessToken", newAccessToken);
    return newAccessToken;
  } catch (err) {
    // localStorage.removeItem("accessToken");
    // localStorage.removeItem("refreshToken");
    // window.location.href = "/";
     console.log("Refresh failed:", err.response?.data || err.message);
      console.log("Refresh Error:", err.response?.status);
      console.log("Refresh Data:", err.response?.data);
     return null;
  }
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
   }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 &&  error.config  && !error.config._retry) {
    error.config._retry = true;

    const newAccessToken = await refreshAccessToken();

    if (newAccessToken) {
    error.config.headers.Authorization = `Bearer ${newAccessToken}`;
    return api(error.config);
}
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/";
    }
      return Promise.reject(error);
 }
);

export default api;