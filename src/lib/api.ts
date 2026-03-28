// src/lib/api.ts
import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      Cookies.remove("token");
      Cookies.remove("user");
      window.location.href = "/auth/login";
    }
    return Promise.reject(err);
  }
);

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { name: string; email: string; password: string; phone?: string; role?: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
};

// ─── VENUES (Public) ──────────────────────────────────────────────────────────
export const venueApi = {
  getAll: (params?: { query?: string; sport?: string }) =>
    api.get("/venues", { params }),
  getById: (id: number) => api.get(`/venues/${id}`),
  getSlots: (venueId: number, date: string) =>
    api.get(`/venues/${venueId}/slots`, { params: { date } }),
  getAvailableSlots: (venueId: number, date: string) =>
    api.get(`/venues/${venueId}/slots/available`, { params: { date } }),
};

// ─── BOOKINGS ─────────────────────────────────────────────────────────────────
export const bookingApi = {
  create: (data: { venueId: number; slotId: number }) =>
    api.post("/bookings", data),
  getMyBookings: () => api.get("/bookings/my"),
  cancel: (id: number) => api.put(`/bookings/${id}/cancel`),
};

// ─── REVIEWS ──────────────────────────────────────────────────────────────────
export const reviewApi = {
  add: (data: { venueId: number; rating: number; comment: string }) =>
    api.post("/reviews", data),
  getByVenue: (venueId: number) => api.get(`/reviews/venue/${venueId}`),
};

// ─── OWNER ────────────────────────────────────────────────────────────────────
export const ownerApi = {
  // Venues
  getMyVenues: () => api.get("/owner/venues"),
  createVenue: (data: {
    name: string; sport: string; location: string;
    address?: string; description?: string;
    pricePerHour: number; amenities?: string;
  }) => api.post("/owner/venues", data),
  updateVenue: (id: number, data: {
    name: string; sport: string; location: string;
    address?: string; description?: string;
    pricePerHour: number; amenities?: string;
  }) => api.put(`/owner/venues/${id}`, data),
  deleteVenue: (id: number) => api.delete(`/owner/venues/${id}`),

  // Slots
  addSlot: (venueId: number, data: {
    date: string; startTime: string; endTime: string;
  }) => api.post(`/owner/venues/${venueId}/slots`, data),
  deleteSlot: (venueId: number, slotId: number) =>
    api.delete(`/owner/venues/${venueId}/slots/${slotId}`),

  // Bookings
  getMyBookings: () => api.get("/owner/bookings"),
};

export default api;
