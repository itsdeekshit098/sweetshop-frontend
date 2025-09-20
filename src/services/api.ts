import axios, { AxiosError } from "axios";
import { getToken } from "../utils/auth";

const api = axios.create({
  baseURL: "https://sweetshop-backend-1r0y.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(config => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<{ error: string; message?: string }>;
    return err.response?.data?.message || err.response?.data?.error || error.toString();
  }
  return String(error);
};

export default api;
