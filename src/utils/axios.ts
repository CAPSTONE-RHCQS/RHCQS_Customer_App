import axios from "axios";
import { API_ROOT } from "./constants";

const axiosInstance = axios.create({
  baseURL: API_ROOT,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;