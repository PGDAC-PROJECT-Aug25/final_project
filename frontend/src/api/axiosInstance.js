import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response handler
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      toast.error("Session expired. Please login again.");
      sessionStorage.clear();
      window.location.href = "/login";
    } else if (error?.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Something went wrong. Please try again.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
