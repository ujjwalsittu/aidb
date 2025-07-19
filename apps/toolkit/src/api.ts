import axios from "axios";
import { loadConfig } from "./config";

export const aidbApi = axios.create({
  baseURL:
    process.env.AIDB_CLI_API_URL ||
    loadConfig().apiUrl ||
    "https://api.aidb.io/api",
  timeout: 10000,
});

// If token, attach bearer
aidbApi.interceptors.request.use((config) => {
  const token = loadConfig().token;
  if (token)
    config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  return config;
});
