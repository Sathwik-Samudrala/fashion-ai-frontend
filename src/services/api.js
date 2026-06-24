import axios from "axios";

// Backend API root, e.g. "http://127.0.0.1:8000/api" (override via frontend/.env -> VITE_API_URL)
const RAW_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
export const API_BASE = RAW_BASE.replace(/\/+$/, "");

// Backend origin without the trailing /api, used to resolve relative asset
// URLs the backend returns (e.g. product images served from /images/...).
export const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

const API = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

export const getRecommendation = (payload) => API.post("/recommend", payload);
export const sendChatMessage = (payload) => API.post("/chat", payload);
export const getOccasions = () => API.get("/occasions");
export const checkHealth = () => API.get("/health");
export const getProducts = (params) => API.get("/products", { params });
export const getOutfitById = (outfitId) => API.get(`/outfits/${encodeURIComponent(outfitId)}`);

/**
 * Resolve a backend-relative asset path (e.g. "/images/ajio/123.jpg") into a
 * full URL the browser can load directly, regardless of API_BASE shape.
 */
export const resolveImageUrl = (path) => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
};

/** Extracts a friendly message out of an axios error for display in the UI. */
export const describeApiError = (err) => {
  if (err?.response?.data?.detail) return err.response.data.detail;
  if (err?.code === "ECONNABORTED") return "The request timed out. Please try again.";
  if (err?.message?.includes("Network Error")) {
    return "Couldn't reach the backend. Make sure the FastAPI server is running.";
  }
  return err?.message || "Something went wrong. Please try again.";
};

export default API;