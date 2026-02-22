import axios from "axios";
import { ENV } from "../config/env";
import { useAuthStore } from "@/features/auth/authStore";

export const api = axios.create({
  baseURL: ENV.API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
