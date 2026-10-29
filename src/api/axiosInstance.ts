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
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
