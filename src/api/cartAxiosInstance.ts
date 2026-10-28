import axios from "axios";

const cartAxiosInstance = axios.create({
  baseURL: "https://cartapis.ciitstudent.com",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default cartAxiosInstance;