import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menangani error secara global
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || "Terjadi kesalahan sistem";
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;