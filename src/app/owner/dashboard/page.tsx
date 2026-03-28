"use client";
// src/app/owner/dashboard/page.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { ownerApi } from "@/lib/api";
import { Venue, Booking } from "@/types";
import { useAuth } from "@/lib/AuthContext";

const SPORT_COLORS: Record<string, string> = {
  Badminton: "#00E5A0", Football: "#FF6B35", Tennis: "#FFD700",
  Basketball: "#FF4081", Cricket: "#7C6AF7", Volleyball: "#00B4D8",
};

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([ownerApi.getMyVenues(), ownerApi.getMyBookings()])
      .then(([v, b]) => { setVenues(v.data); setBookings(b.data); })
      .finally(() => setLoading(false));
  }, []);

  const confirmedBookings = bookings.filter(b => b.status === "CONFIRMED");
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const stats = [
    { label: "Total Venues", value: venues.length, icon: "🏟️", color: "#00E5A0" },
    { label: "Total Bookings", value: bookings.length, icon: "📅", color: "#FF6B35" },
    { label: "Active Bookings", value: confirmedBookings.length, icon: "✅", color: "#7C6AF7" },
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: "💰", color: "#FFD700" },
  ];

  return (
    <div style={{ padding: "40px 32px", maxWidth: 1000 }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 42, letterSpacing: 2, margin: 0 }}>
          WELCOME BACK<br />
          <span style={{ color: "var(--accent)" }}>{user?.name?.toUpperCase()}! 👋</span>
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: 8, fontSize: 15 }}>
          Here's an overview of your venues
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 40 }}>
        {stats.map(s => (
          <div key={s.label} className="fade-up" style={{
            background: "var(--surface)", borderRadius: 16,
            padding: "20px", border: `1px solid ${s.color}25`
          }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
            <p style={{ color: s.color, fontFamily: "var(--font-display)", fontSize: 32, letterSpacing: 2, margin: 0 }}>
              {loading ? "—" : s.value}
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: 13, margin: "4px 0 0" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* My Venues */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>My Venues</h2>
          <Link href="/owner/venues/new" style={{
            background: "var(--accent)", color: "#000",
            padding: "8px 20px", borderRadius: 10,
            fontSize: 13, fontWeight: 700, textDecoration: "none"
          }}>+ Add Venue</Link>
        </div>

        {loading ? (
          <div style={{ color: "var(--text-muted)", padding: 20 }}>Loading...</div>
        ) : venues.length === 0 ? (
          <div style={{
            background: "var(--surface)", borderRadius: 16,
            border: "1px dashed var(--border2)", padding: "40px",
            textAlign: "center"
          }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>🏟️</p>
            <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>No venues yet</p>
            <Link href="/owner/venues/new" style={{
              background: "var(--accent)", color: "#000",
              padding: "10px 24px", borderRadius: 10,
              fontSize: 14, fontWeight: 700, textDecoration: "none", display: "inline-block"
            }}>Add Your First Venue →</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {venues.map(v => {
              const color = SPORT_COLORS[v.sport] || "var(--accent)";
              return (
                <div key={v.id} style={{
                  background: "var(--surface)", borderRadius: 16,
                  border: `1px solid ${color}30`, padding: 20
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <div>
                      <p style={{ fontWeight: 800, fontSize: 15, margin: 0 }}>{v.name}</p>
                      <p style={{ color, fontSize: 12, fontWeight: 700, margin: "3px 0 0" }}>{v.sport} · {v.location}</p>
                    </div>
                    <p style={{ color, fontWeight: 900, fontSize: 18, margin: 0 }}>₹{v.pricePerHour}</p>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <Link href={`/owner/venues/${v.id}/slots`} style={{
                      flex: 1, background: `${color}15`, color,
                      padding: "7px 0", borderRadius: 8,
                      fontSize: 12, fontWeight: 700, textAlign: "center",
                      textDecoration: "none", border: `1px solid ${color}30`
                    }}>Manage Slots</Link>
                    <Link href={`/owner/venues/${v.id}/edit`} style={{
                      flex: 1, background: "var(--surface2)", color: "var(--text-muted)",
                      padding: "7px 0", borderRadius: 8,
                      fontSize: 12, fontWeight: 600, textAlign: "center",
                      textDecoration: "none", border: "1px solid var(--border2)"
                    }}>Edit</Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Bookings */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Recent Bookings</h2>
          <Link href="/owner/bookings" style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600 }}>View All →</Link>
        </div>

        {loading ? (
          <div style={{ color: "var(--text-muted)" }}>Loading...</div>
        ) : bookings.length === 0 ? (
          <div style={{
            background: "var(--surface)", borderRadius: 16,
            border: "1px dashed var(--border2)", padding: "32px",
            textAlign: "center", color: "var(--text-muted)"
          }}>No bookings yet</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {bookings.slice(0, 5).map(b => {
              const color = SPORT_COLORS[b.venue?.sport] || "var(--accent)";
              return (
                <div key={b.id} style={{
                  background: "var(--surface)", borderRadius: 14,
                  border: `1px solid ${b.status === "CONFIRMED" ? color + "30" : "var(--border)"}`,
                  padding: "14px 18px",
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>{b.venue?.name}</p>
                    <p style={{ color: "var(--text-muted)", fontSize: 12, margin: "3px 0 0" }}>
                      {b.user?.name} · {b.slot?.date} · {b.slot?.startTime?.slice(0, 5)}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color, fontWeight: 800, fontSize: 15, margin: 0 }}>₹{b.totalPrice}</p>
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      color: b.status === "CONFIRMED" ? color : "var(--text-dim)"
                    }}>{b.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
