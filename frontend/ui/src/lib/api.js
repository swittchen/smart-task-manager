import axios from "axios";

const api = axios.create({
  baseURL:"/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      // invalid/expired token
      localStorage.removeItem("accessToken");
    }
    return Promise.reject(err);
  }
);

export default api;
