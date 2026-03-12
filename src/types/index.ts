// src/types/index.ts
// These match the Java entities in your Spring Boot backend

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: "USER" | "ADMIN";
  createdAt: string;
}

export interface Venue {
  id: number;
  name: string;
  sport: string;
  location: string;
  address?: string;
  description?: string;
  pricePerHour: number;
  amenities?: string;       // comma-separated e.g. "Parking,Shower"
  avgRating: number;
  totalReviews: number;
  createdAt: string;
}

export interface Slot {
  id: number;
  venue: Venue;
  date: string;             // "2025-03-15"
  startTime: string;        // "06:00:00"
  endTime: string;          // "07:00:00"
  status: "AVAILABLE" | "BOOKED";
}

export interface Booking {
  id: number;
  user: User;
  venue: Venue;
  slot: Slot;
  status: "CONFIRMED" | "CANCELLED";
  totalPrice: number;
  bookedAt: string;
}

export interface Review {
  id: number;
  user: User;
  venue: Venue;
  rating: number;
  comment?: string;
  createdAt: string;
}

// Auth state stored in context
export interface AuthState {
  token: string | null;
  user: { name: string; email: string } | null;
  isLoggedIn: boolean;
}
