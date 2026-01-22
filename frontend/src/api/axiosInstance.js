import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api", // 🔴 change if needed
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Optional: response error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data);
    } else {
      console.error("Network Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
