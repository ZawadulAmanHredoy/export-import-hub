import axios from "axios";
import { auth } from "../firebase/firebase.config.js";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

api.interceptors.request.use(async (config) => {
  const u = auth.currentUser;
  if (u) {
    const token = await u.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
