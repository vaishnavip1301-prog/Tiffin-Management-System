import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://tiffinapis.ysaasinfotech.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;