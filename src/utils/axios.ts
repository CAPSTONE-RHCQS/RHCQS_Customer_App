import axios from "axios";
import { API_ROOT } from "./constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const axiosInstance = axios.create({
  baseURL: API_ROOT,
  headers: {
    "Content-Type": "application/json",
  },
});


export const getHeaders = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};
export default axiosInstance;