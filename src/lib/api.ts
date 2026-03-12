// src/lib/api.ts
// Central API client — all calls to Spring Boot backend go through here

import axios from "axios";
import Cookies from "js-cookie";

// Your Spring Boot backend URL
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Automatically attach JWT token to every request if it exists
api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If 401 Unauthorized, clear token and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      Cookies.remove("token");
      window.location.href = "/auth/login";
    }
    return Promise.reject(err);
  }
);

// ─── AUTH ────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    api.post("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
};

// ─── VENUES ──────────────────────────────────────────────────────────────────
export const venueApi = {
  getAll: (params?: { query?: string; sport?: string }) =>
    api.get("/venues", { params }),

  getById: (id: number) =>
    api.get(`/venues/${id}`),

  getSlots: (venueId: number, date: string) =>
    api.get(`/venues/${venueId}/slots`, { params: { date } }),

  getAvailableSlots: (venueId: number, date: string) =>
    api.get(`/venues/${venueId}/slots/available`, { params: { date } }),
};

// ─── BOOKINGS ────────────────────────────────────────────────────────────────
export const bookingApi = {
  create: (data: { venueId: number; slotId: number }) =>
    api.post("/bookings", data),

  getMyBookings: () =>
    api.get("/bookings/my"),

  cancel: (id: number) =>
    api.put(`/bookings/${id}/cancel`),
};

// ─── REVIEWS ─────────────────────────────────────────────────────────────────
export const reviewApi = {
  add: (data: { venueId: number; rating: number; comment: string }) =>
    api.post("/reviews", data),

  getByVenue: (venueId: number) =>
    api.get(`/reviews/venue/${venueId}`),
};

export default api;
