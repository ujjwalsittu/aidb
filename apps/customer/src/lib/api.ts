import axios from "axios";
import { getToken } from "./auth";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api",
  timeout: 9000,
});
api.interceptors.request.use((config) => {
  const t = getToken();
  if (t) config.headers.Authorization = "Bearer " + t;
  return config;
});
