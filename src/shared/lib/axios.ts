import axios from "axios";
import { ENV } from "@/shared/config/env";
import { useAuthStore } from "@/stores/authStore";

const API_PREFIX = import.meta.env.VITE_API_PREFIX || "/api";
const baseUrl = ENV.API_URL?.replace(/\/$/, "") || "";

export const api = axios.create({
  baseURL: `${baseUrl}${API_PREFIX}`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
