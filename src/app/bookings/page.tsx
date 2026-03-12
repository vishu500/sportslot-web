"use client";
// src/app/bookings/page.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { bookingApi } from "@/lib/api";
import { Booking } from "@/types";
import { useAuth } from "@/lib/AuthContext";
import toast from "react-hot-toast";
import { format } from "date-fns";

const SPORT_COLORS: Record<string, string> = {
  Badminton: "#00E5A0", Football: "#FF6B35", Tennis: "#FFD700",
  Basketball: "#FF4081", Cricket: "#7C6AF7", Volleyball: "#00B4D8",
};
const SPORT_EMOJI: Record<string, string> = {
  Badminton: "🏸", Football: "⚽", Tennis: "🎾",
  Basketball: "🏀", Cricket: "🏏", Volleyball: "🏐",
};

export default function BookingsPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoggedIn) { router.push("/auth/login"); return; }
    bookingApi.getMyBookings()
      .then(r => setBookings(r.data))
      .catch(() => toast.error("Failed to load bookings"))
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  const handleCancel = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setCancelling(id);
    try {
      await bookingApi.cancel(id);
      toast.success("Booking cancelled");
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "CANCELLED" } : b));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Cancel failed");
    } finally {
      setCancelling(null);
    }
  };

  const upcoming = bookings.filter(b => b.status === "CONFIRMED");
  const past = bookings.filter(b => b.status === "CANCELLED");

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: 48, letterSpacing: 3, marginBottom: 8
        }}>MY <span style={{ color: "var(--accent)" }}>BOOKINGS</span></h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 32 }}>
          Manage all your venue reservations
        </p>

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div className="spinner" style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", margin: "0 auto 16px" }} />
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>📅</p>
            <p style={{ color: "var(--text-muted)", fontSize: 16, marginBottom: 20 }}>No bookings yet</p>
            <button onClick={() => router.push("/venues")} style={{
              background: "var(--accent)", color: "#000",
              padding: "12px 28px", borderRadius: 12, border: "none",
              fontWeight: 700, fontSize: 14, cursor: "pointer"
            }}>Browse Venues →</button>
          </div>
        ) : (
          <>
            {/* Upcoming */}
            {upcoming.length > 0 && (
              <>
                <h2 style={{ fontSize: 13, color: "var(--text-muted)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>
                  Upcoming ({upcoming.length})
                </h2>
                {upcoming.map(b => {
                  const color = SPORT_COLORS[b.venue?.sport] || "var(--accent)";
                  return (
                    <div key={b.id} className="fade-up" style={{
                      background: "var(--surface)",
                      borderRadius: "var(--radius)", border: `1px solid ${color}35`,
                      padding: "20px", marginBottom: 14,
                      display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap"
                    }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                        background: `${color}20`, display: "flex",
                        alignItems: "center", justifyContent: "center", fontSize: 26
                      }}>
                        {SPORT_EMOJI[b.venue?.sport] || "🏟️"}
                      </div>
                      <div style={{ flex: 1, minWidth: 180 }}>
                        <p style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{b.venue?.name}</p>
                        <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
                          📅 {b.slot?.date} &nbsp;·&nbsp;
                          🕐 {b.slot?.startTime?.slice(0,5)} – {b.slot?.endTime?.slice(0,5)}
                        </p>
                        <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
                          📍 {b.venue?.location} &nbsp;·&nbsp;
                          <span style={{ color, fontWeight: 700 }}>₹{b.totalPrice}</span>
                        </p>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                        <span style={{
                          background: `${color}20`, color,
                          padding: "4px 12px", borderRadius: 20,
                          fontSize: 12, fontWeight: 700,
                          border: `1px solid ${color}40`
                        }}>Confirmed</span>
                        <button
                          onClick={() => handleCancel(b.id)}
                          disabled={cancelling === b.id}
                          style={{
                            background: "none", border: "1px solid #ff444440",
                            color: "#ff4444", padding: "5px 14px",
                            borderRadius: 8, fontSize: 12, fontWeight: 600,
                            cursor: "pointer", transition: "all 0.2s"
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#ff444420")}
                          onMouseLeave={e => (e.currentTarget.style.background = "none")}
                        >
                          {cancelling === b.id ? "Cancelling..." : "Cancel"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* Cancelled */}
            {past.length > 0 && (
              <>
                <h2 style={{ fontSize: 13, color: "var(--text-muted)", letterSpacing: 1, textTransform: "uppercase", margin: "28px 0 14px" }}>
                  Cancelled ({past.length})
                </h2>
                {past.map(b => (
                  <div key={b.id} style={{
                    background: "var(--surface2)", borderRadius: "var(--radius)",
                    border: "1px solid var(--border)", padding: "18px 20px",
                    marginBottom: 12, display: "flex", gap: 14, alignItems: "center",
                    opacity: 0.6
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                      background: "var(--border)", display: "flex",
                      alignItems: "center", justifyContent: "center", fontSize: 22
                    }}>
                      {SPORT_EMOJI[b.venue?.sport] || "🏟️"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{b.venue?.name}</p>
                      <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
                        {b.slot?.date} · {b.slot?.startTime?.slice(0,5)} · ₹{b.totalPrice}
                      </p>
                    </div>
                    <span style={{ color: "#ff4444", fontSize: 12, fontWeight: 700 }}>Cancelled</span>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
