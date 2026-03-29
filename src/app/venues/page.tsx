"use client";
// src/app/venues/page.tsx
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { venueApi } from "@/lib/api";
import { Venue } from "@/types";

const SPORTS = ["All", "Badminton", "Football", "Tennis", "Basketball", "Cricket", "Volleyball"];

const SPORT_COLORS: Record<string, string> = {
  Badminton: "#00E5A0", Football: "#FF6B35", Tennis: "#FFD700",
  Basketball: "#FF4081", Cricket: "#7C6AF7", Volleyball: "#00B4D8",
};

function StarRow({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map(s => (
        <svg key={s} width={13} height={13} viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? "#FFD700" : "#333"}>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

function VenuesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("query") || "");
  const [sport, setSport] = useState(searchParams.get("sport") || "All");

  const fetchVenues = useCallback(async () => {
    setLoading(true);
    try {
      const res = await venueApi.getAll({
        query: search || undefined,
        sport: sport === "All" ? undefined : sport,
      });
      setVenues(res.data);
    } catch {
      setVenues([]);
    } finally {
      setLoading(false);
    }
  }, [search, sport]);

  useEffect(() => { fetchVenues(); }, [fetchVenues]);

  const sportColor = (v: Venue) => SPORT_COLORS[v.sport] || "var(--accent)";

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: 52, letterSpacing: 3, lineHeight: 1
          }}>
            FIND A <span style={{ color: "var(--accent)" }}>VENUE</span>
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: 8, fontSize: 15 }}>
            Browse and book courts near you
          </p>
        </div>

        {/* Search + Filter */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          <div style={{
            flex: 1, minWidth: 240,
            display: "flex", alignItems: "center", gap: 10,
            background: "var(--surface)", borderRadius: "var(--radius-sm)",
            padding: "12px 16px", border: "1px solid var(--border2)"
          }}>
            <span>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search venue or area..."
              style={{
                background: "none", border: "none", outline: "none",
                color: "var(--text)", fontSize: 14, flex: 1
              }}
            />
          </div>
        </div>

        {/* Sport tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
          {SPORTS.map(s => (
            <button
              key={s}
              onClick={() => setSport(s)}
              style={{
                padding: "7px 18px", borderRadius: 20,
                background: sport === s ? "var(--accent)" : "var(--surface)",
                color: sport === s ? "#000" : "var(--text-muted)",
                fontWeight: sport === s ? 700 : 500,
                fontSize: 13, transition: "all 0.2s",
                border: sport === s ? "none" : "1px solid var(--border2)"
              } as React.CSSProperties}
            >{s}</button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div className="spinner" style={{
              width: 40, height: 40, border: "3px solid var(--border)",
              borderTopColor: "var(--accent)", borderRadius: "50%",
              margin: "0 auto 16px"
            }} />
            <p style={{ color: "var(--text-muted)" }}>Loading venues...</p>
          </div>
        ) : venues.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>🏟️</p>
            <p style={{ color: "var(--text-muted)", fontSize: 16 }}>No venues found. Try a different search.</p>
          </div>
        ) : (
          <>
            <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 20 }}>
              {venues.length} venue{venues.length !== 1 ? "s" : ""} found
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 20
            }}>
              {venues.map((v, i) => {
                const color = sportColor(v);
                return (
                  <Link
                    key={v.id}
                    href={`/venues/${v.id}`}
                    className="fade-up"
                    style={{
                      background: "var(--surface)",
                      borderRadius: "var(--radius)",
                      border: "1px solid var(--border)",
                      overflow: "hidden", display: "block",
                      transition: "all 0.25s",
                      animationDelay: `${i * 0.06}s`
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = color;
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px ${color}20`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                      (e.currentTarget as HTMLElement).style.transform = "none";
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    }}
                  >
                    {/* Card top band */}
                    <div style={{
                      background: `linear-gradient(135deg, ${color}18, ${color}06)`,
                      borderBottom: `1px solid ${color}25`,
                      padding: "20px 20px 16px",
                      display: "flex", gap: 14, alignItems: "flex-start"
                    }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                        background: `${color}20`, display: "flex",
                        alignItems: "center", justifyContent: "center",
                        fontSize: 26, border: `1px solid ${color}35`
                      }}>
                        {v.sport === "Badminton" ? "🏸" : v.sport === "Football" ? "⚽" :
                         v.sport === "Tennis" ? "🎾" : v.sport === "Basketball" ? "🏀" :
                         v.sport === "Cricket" ? "🏏" : "🏐"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>{v.name}</h3>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span style={{ color, fontSize: 12, fontWeight: 700 }}>{v.sport}</span>
                          <span style={{ color: "var(--text-dim)" }}>•</span>
                          <span style={{ color: "var(--text-muted)", fontSize: 12 }}>📍 {v.location}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ color, fontWeight: 800, fontSize: 18 }}>₹{v.pricePerHour}</p>
                        <p style={{ color: "var(--text-dim)", fontSize: 11 }}>/hr</p>
                      </div>
                    </div>

                    {/* Card bottom */}
                    <div style={{ padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <StarRow rating={v.avgRating} />
                        <span style={{ fontWeight: 700, fontSize: 13 }}>{v.avgRating?.toFixed(1)}</span>
                        <span style={{ color: "var(--text-dim)", fontSize: 12 }}>({v.totalReviews})</span>
                      </div>
                      <span style={{
                        background: `${color}15`, color,
                        fontSize: 12, fontWeight: 700,
                        padding: "4px 12px", borderRadius: 20,
                        border: `1px solid ${color}30`
                      }}>Book →</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function VenuesPage() {
  return (
    <Suspense fallback={<div style={{ background: "var(--bg)", minHeight: "100vh" }} />}>
      <VenuesContent />
    </Suspense>
  );
}