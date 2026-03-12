"use client";
// src/app/page.tsx — Landing page
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

const sports = [
  { emoji: "🏸", name: "Badminton" },
  { emoji: "⚽", name: "Football" },
  { emoji: "🎾", name: "Tennis" },
  { emoji: "🏀", name: "Basketball" },
  { emoji: "🏏", name: "Cricket" },
  { emoji: "🏐", name: "Volleyball" },
];

const stats = [
  { value: "50+", label: "Venues" },
  { value: "10K+", label: "Bookings" },
  { value: "4.8★", label: "Avg Rating" },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "60px 24px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Background glow */}
        <div style={{
          position: "absolute", width: 600, height: 600,
          borderRadius: "50%", background: "var(--accent)",
          opacity: 0.04, filter: "blur(120px)",
          top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          pointerEvents: "none"
        }} />

        <div className="fade-up" style={{ animationDelay: "0s" }}>
          <span style={{
            background: "var(--surface)", border: "1px solid var(--border2)",
            color: "var(--accent)", padding: "6px 16px", borderRadius: 20,
            fontSize: 13, fontWeight: 600, letterSpacing: 1
          }}>📍 Your City, Your Court</span>
        </div>

        <h1 className="fade-up" style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(56px, 10vw, 110px)",
          letterSpacing: 4, lineHeight: 0.9,
          marginTop: 28, animationDelay: "0.1s"
        }}>
          BOOK YOUR<br />
          <span style={{ color: "var(--accent)" }}>PERFECT</span><br />
          COURT
        </h1>

        <p className="fade-up" style={{
          color: "var(--text-muted)", fontSize: 18, maxWidth: 480,
          marginTop: 24, lineHeight: 1.6, animationDelay: "0.2s"
        }}>
          Find and book sports venues in seconds. No calls, no hassle —
          just pick your sport, choose a slot, and play.
        </p>

        <div className="fade-up" style={{
          display: "flex", gap: 14, marginTop: 36, animationDelay: "0.3s"
        }}>
          <Link href="/venues" style={{
            background: "var(--accent)", color: "#000",
            padding: "14px 32px", borderRadius: 14,
            fontSize: 15, fontWeight: 800, letterSpacing: "0.5px",
            transition: "opacity 0.2s", display: "block"
          }}>Browse Venues →</Link>
          <Link href="/auth/register" style={{
            background: "var(--surface)", color: "var(--text)",
            padding: "14px 32px", borderRadius: 14,
            border: "1px solid var(--border2)",
            fontSize: 15, fontWeight: 700, display: "block"
          }}>Create Account</Link>
        </div>

        {/* Stats */}
        <div className="fade-up" style={{
          display: "flex", gap: 48, marginTop: 64, animationDelay: "0.4s"
        }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <p style={{
                fontFamily: "var(--font-display)",
                fontSize: 36, color: "var(--accent)", letterSpacing: 2
              }}>{s.value}</p>
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sports Section */}
      <section style={{
        padding: "80px 48px",
        borderTop: "1px solid var(--border)"
      }}>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: 48, letterSpacing: 3, textAlign: "center", marginBottom: 40
        }}>PICK YOUR SPORT</h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 16, maxWidth: 900, margin: "0 auto"
        }}>
          {sports.map((s, i) => (
            <Link
              key={s.name}
              href={`/venues?sport=${s.name}`}
              className="fade-up"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "28px 16px",
                textAlign: "center",
                transition: "all 0.25s",
                animationDelay: `${i * 0.07}s`,
                display: "block"
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
                (e.currentTarget as HTMLElement).style.background = "rgba(0,229,160,0.06)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLElement).style.background = "var(--surface)";
                (e.currentTarget as HTMLElement).style.transform = "none";
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 10 }}>{s.emoji}</div>
              <p style={{ fontWeight: 700, fontSize: 15 }}>{s.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "28px 48px",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <span style={{
          fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: 2
        }}>SPORT<span style={{ color: "var(--accent)" }}>SLOT</span></span>
        <p style={{ color: "var(--text-dim)", fontSize: 13 }}>
          Built with ☕ Java + Spring Boot + Next.js
        </p>
      </footer>
    </div>
  );
}
