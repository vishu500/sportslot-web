"use client";
// src/app/owner/bookings/page.tsx
import { useState, useEffect } from "react";
import { ownerApi } from "@/lib/api";
import { Booking } from "@/types";

const SPORT_COLORS: Record<string, string> = {
  Badminton: "#00E5A0", Football: "#FF6B35", Tennis: "#FFD700",
  Basketball: "#FF4081", Cricket: "#7C6AF7", Volleyball: "#00B4D8",
};

export default function OwnerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "CONFIRMED" | "CANCELLED">("ALL");

  useEffect(() => {
    ownerApi.getMyBookings()
      .then(r => setBookings(r.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = bookings.filter(b => filter === "ALL" || b.status === filter);
  const revenue = bookings
    .filter(b => b.status === "CONFIRMED")
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  return (
    <div style={{ padding: "40px 32px", maxWidth: 900 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 42, letterSpacing: 2, margin: 0 }}>
          BOOKINGS <span style={{ color: "var(--accent)" }}>& REVENUE</span>
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: 8 }}>All bookings across your venues</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total Bookings", value: bookings.length, color: "#00E5A0" },
          { label: "Confirmed", value: bookings.filter(b => b.status === "CONFIRMED").length, color: "#7C6AF7" },
          { label: "Revenue", value: `₹${revenue.toLocaleString()}`, color: "#FFD700" },
        ].map(s => (
          <div key={s.label} style={{
            background: "var(--surface)", borderRadius: 16,
            padding: "20px 24px", border: `1px solid ${s.color}25`
          }}>
            <p style={{ color: s.color, fontFamily: "var(--font-display)", fontSize: 32, letterSpacing: 2, margin: 0 }}>
              {loading ? "—" : s.value}
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: 13, margin: "4px 0 0" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {(["ALL", "CONFIRMED", "CANCELLED"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "7px 18px", borderRadius: 20,
            background: filter === f ? "var(--accent)" : "var(--surface)",
            color: filter === f ? "#000" : "var(--text-muted)",
            fontWeight: filter === f ? 700 : 500,
            border: filter === f ? "none" : "1px solid var(--border2)",
            fontSize: 13, cursor: "pointer", fontFamily: "inherit"
          }}>{f}</button>
        ))}
      </div>

      {/* Bookings Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <div className="spinner" style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", margin: "0 auto" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          background: "var(--surface)", borderRadius: 16,
          border: "1px dashed var(--border2)", padding: "40px",
          textAlign: "center", color: "var(--text-muted)"
        }}>No bookings found</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(b => {
            const color = SPORT_COLORS[b.venue?.sport] || "var(--accent)";
            const confirmed = b.status === "CONFIRMED";
            return (
              <div key={b.id} className="fade-up" style={{
                background: "var(--surface)", borderRadius: 14,
                border: `1px solid ${confirmed ? color + "30" : "var(--border)"}`,
                padding: "16px 20px",
                display: "flex", gap: 16, alignItems: "center",
                opacity: confirmed ? 1 : 0.6
              }}>
                {/* Venue color indicator */}
                <div style={{
                  width: 4, height: 48, borderRadius: 4,
                  background: confirmed ? color : "var(--border2)",
                  flexShrink: 0
                }} />

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <p style={{ fontWeight: 800, fontSize: 15, margin: 0 }}>{b.venue?.name}</p>
                    <p style={{ color, fontWeight: 900, fontSize: 16, margin: 0 }}>₹{b.totalPrice}</p>
                  </div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <span style={{ color: "var(--text-muted)", fontSize: 12 }}>
                      👤 {b.user?.name}
                    </span>
                    <span style={{ color: "var(--text-muted)", fontSize: 12 }}>
                      📅 {b.slot?.date}
                    </span>
                    <span style={{ color: "var(--text-muted)", fontSize: 12 }}>
                      🕐 {b.slot?.startTime?.slice(0, 5)} – {b.slot?.endTime?.slice(0, 5)}
                    </span>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "2px 8px",
                      borderRadius: 6,
                      background: confirmed ? `${color}20` : "#1e1e1e",
                      color: confirmed ? color : "var(--text-dim)",
                      border: `1px solid ${confirmed ? color + "40" : "var(--border2)"}`
                    }}>{b.status}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
