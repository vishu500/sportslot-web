"use client";
// src/app/owner/venues/page.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ownerApi } from "@/lib/api";
import { Venue } from "@/types";

const SPORT_COLORS: Record<string, string> = {
  Badminton: "#00E5A0", Football: "#FF6B35", Tennis: "#FFD700",
  Basketball: "#FF4081", Cricket: "#7C6AF7", Volleyball: "#00B4D8",
};
const SPORT_EMOJI: Record<string, string> = {
  Badminton: "🏸", Football: "⚽", Tennis: "🎾",
  Basketball: "🏀", Cricket: "🏏", Volleyball: "🏐",
};

export default function OwnerVenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    ownerApi.getMyVenues()
      .then(r => setVenues(r.data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This will also delete all its slots.`)) return;
    setDeleting(id);
    try {
      await ownerApi.deleteVenue(id);
      setVenues(prev => prev.filter(v => v.id !== id));
      toast.success("Venue deleted");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div style={{ padding: "40px 32px", maxWidth: 1000 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 42, letterSpacing: 2, margin: 0 }}>
            MY <span style={{ color: "var(--accent)" }}>VENUES</span>
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: 8 }}>
            Manage all your sports venues
          </p>
        </div>
        <Link href="/owner/venues/new" style={{
          background: "var(--accent)", color: "#000",
          padding: "12px 24px", borderRadius: 12,
          fontSize: 14, fontWeight: 800, textDecoration: "none",
          display: "inline-block", marginTop: 8
        }}>+ Add New Venue</Link>
      </div>

      {/* Venues */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div className="spinner" style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", margin: "0 auto 16px" }} />
        </div>
      ) : venues.length === 0 ? (
        <div style={{
          background: "var(--surface)", borderRadius: 20,
          border: "1px dashed var(--border2)", padding: "60px",
          textAlign: "center"
        }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>🏟️</p>
          <p style={{ color: "var(--text-muted)", fontSize: 16, marginBottom: 24 }}>You haven't added any venues yet</p>
          <Link href="/owner/venues/new" style={{
            background: "var(--accent)", color: "#000",
            padding: "12px 28px", borderRadius: 12,
            fontSize: 15, fontWeight: 800, textDecoration: "none", display: "inline-block"
          }}>Add Your First Venue →</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {venues.map(v => {
            const color = SPORT_COLORS[v.sport] || "var(--accent)";
            return (
              <div key={v.id} className="fade-up" style={{
                background: "var(--surface)", borderRadius: 18,
                border: `1px solid ${color}30`, overflow: "hidden"
              }}>
                <div style={{
                  display: "flex", gap: 18, alignItems: "center",
                  padding: "20px 24px",
                  background: `linear-gradient(135deg, ${color}10, transparent)`
                }}>
                  {/* Emoji */}
                  <div style={{
                    width: 56, height: 56, borderRadius: 16, flexShrink: 0,
                    background: `${color}20`, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: 28, border: `1px solid ${color}40`
                  }}>{SPORT_EMOJI[v.sport] || "🏟️"}</div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>{v.name}</h3>
                    <div style={{ display: "flex", gap: 10, marginTop: 4, flexWrap: "wrap" }}>
                      <span style={{ color, fontSize: 12, fontWeight: 700 }}>{v.sport}</span>
                      <span style={{ color: "var(--text-dim)" }}>•</span>
                      <span style={{ color: "var(--text-muted)", fontSize: 12 }}>📍 {v.location}</span>
                      {v.address && <>
                        <span style={{ color: "var(--text-dim)" }}>•</span>
                        <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{v.address}</span>
                      </>}
                    </div>
                    {v.amenities && (
                      <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                        {v.amenities.split(",").map(a => (
                          <span key={a} style={{
                            background: "var(--surface2)", color: "var(--text-muted)",
                            padding: "2px 8px", borderRadius: 6, fontSize: 11,
                            border: "1px solid var(--border2)"
                          }}>✓ {a.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ color, fontWeight: 900, fontSize: 22, margin: 0 }}>₹{v.pricePerHour}</p>
                    <p style={{ color: "var(--text-dim)", fontSize: 11, margin: 0 }}>/hr</p>
                  </div>
                </div>

                {/* Actions */}
                <div style={{
                  display: "flex", gap: 10, padding: "12px 24px",
                  borderTop: `1px solid ${color}20`,
                  background: "var(--surface2)"
                }}>
                  <Link href={`/owner/venues/${v.id}/slots`} style={{
                    flex: 1, background: `${color}15`, color,
                    padding: "9px 0", borderRadius: 10, textAlign: "center",
                    fontSize: 13, fontWeight: 700, textDecoration: "none",
                    border: `1px solid ${color}30`
                  }}>📅 Manage Slots</Link>

                  <Link href={`/owner/venues/${v.id}/edit`} style={{
                    flex: 1, background: "var(--surface)", color: "var(--text-muted)",
                    padding: "9px 0", borderRadius: 10, textAlign: "center",
                    fontSize: 13, fontWeight: 600, textDecoration: "none",
                    border: "1px solid var(--border2)"
                  }}>✏️ Edit</Link>

                  <button
                    onClick={() => handleDelete(v.id, v.name)}
                    disabled={deleting === v.id}
                    style={{
                      flex: 1, background: "none",
                      color: deleting === v.id ? "var(--text-dim)" : "#ff4444",
                      padding: "9px 0", borderRadius: 10,
                      fontSize: 13, fontWeight: 600, cursor: "pointer",
                      border: "1px solid rgba(255,68,68,0.3)"
                    }}
                  >{deleting === v.id ? "Deleting..." : "🗑️ Delete"}</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
