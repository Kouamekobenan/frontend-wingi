import axios from "axios";
export const api = axios.create({
  // baseURL: "http://localhost:3001/api/v1",
  baseURL: "https://wingi-api-pk75.onrender.com/api/v1",
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);
