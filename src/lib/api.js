import axios from "axios";
import { getAuth } from "firebase/auth";

/**
 * Make sure base URL is valid:
 * - if you set: "my-api.vercel.app" => becomes "https://my-api.vercel.app"
 * - trims trailing slashes
 */
function normalizeBaseURL(raw) {
  if (!raw) return "";

  let url = raw.trim();

  // If someone put quotes in env by mistake
  url = url.replace(/^['"]|['"]$/g, "");

  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  url = url.replace(/\/+$/, "");
  return url;
}

/**
 * If your Vercel routes all go through /api, you can set it in env.
 * This helper also works if you keep it at root.
 */
function withApiPath(base) {
  // If the base already ends with /api, keep it.
  if (base.endsWith("/api")) return base;
  return base; // server is routed to api/index.js at root in our vercel.json
}

const rawBase = import.meta.env.VITE_API_BASE_URL;
const baseURL = withApiPath(normalizeBaseURL(rawBase));

export const api = axios.create({
  baseURL,
  timeout: 20000
});

// Attach Firebase token automatically
api.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;

  // Only attach if user exists
  if (user) {
    const token = await user.getIdToken();
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Do NOT swallow errors — let caller handle them (or React Query will)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Useful debug info in production too
    const status = error?.response?.status;
    const url = error?.config?.baseURL + (error?.config?.url || "");
    console.error("API Error:", status, url, error?.response?.data || error?.message);
    return Promise.reject(error);
  }
);
