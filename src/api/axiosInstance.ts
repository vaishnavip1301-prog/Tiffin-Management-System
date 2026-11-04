import axios from "axios";

// Kitchen / Main Tiffin API
export const kitchenAxiosInstance = axios.create({
  baseURL: "https://tiffinapis.ysaasinfotech.com",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Cart API
export const cartAxiosInstance = axios.create({
  baseURL: "https://cartapis.ciitstudent.com",
  // baseURL: "https://192.168.1.13:7217",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
