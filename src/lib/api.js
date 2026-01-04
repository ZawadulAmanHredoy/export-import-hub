import axios from "axios";
import { auth } from "../firebase/firebase.config.js";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;

  config.headers = config.headers || {};

  if (user && !config.headers.Authorization) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
