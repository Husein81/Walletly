import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";

const generateBaseURL = (): string => {
  const baseUrl = {
    web: "http://localhost:5000/api",
    default: `${process.env.EXPO_PUBLIC_API_URL}/api`,
  };
  return Platform.select(baseUrl) || baseUrl.default;
};

export const api = axios.create({
  baseURL: generateBaseURL(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor to include auth token in headers
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
