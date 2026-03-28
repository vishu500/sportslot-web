"use client";
// src/components/layout/Navbar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function Navbar() {
  const { isLoggedIn, isOwner, user, logout } = useAuth();
  const path = usePathname();

  const navLink = (href: string, label: string) => (
    <Link href={href} style={{
      color: path === href ? "var(--accent)" : "var(--text-muted)",
      fontWeight: 600, fontSize: 14, letterSpacing: "0.5px",
      transition: "color 0.2s", padding: "6px 0",
      borderBottom: path === href ? "2px solid var(--accent)" : "2px solid transparent",
    }}>{label}</Link>
  );

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(8,8,8,0.85)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--border)",
      padding: "0 32px", height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 22 }}>🏟️</span>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 24, letterSpacing: 2, color: "var(--text)" }}>
          SPORT<span style={{ color: "var(--accent)" }}>SLOT</span>
        </span>
      </Link>

      <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
        {navLink("/venues", "Venues")}
        {isLoggedIn && !isOwner && navLink("/bookings", "My Bookings")}
        {isOwner && navLink("/owner/dashboard", "Dashboard")}
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {isLoggedIn ? (
          <>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "var(--surface)", borderRadius: 20,
              padding: "6px 14px 6px 8px", border: "1px solid var(--border2)"
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "linear-gradient(135deg, var(--accent), var(--accent-dim))",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#000", fontWeight: 800, fontSize: 13
              }}>{user?.name?.[0]?.toUpperCase()}</div>
              <div>
                <span style={{ color: "var(--text)", fontSize: 13, fontWeight: 600 }}>{user?.name}</span>
                {isOwner && (
                  <span style={{
                    marginLeft: 6, background: "rgba(0,229,160,0.15)",
                    color: "var(--accent)", fontSize: 10, fontWeight: 700,
                    padding: "1px 6px", borderRadius: 4, border: "1px solid rgba(0,229,160,0.3)"
                  }}>OWNER</span>
                )}
              </div>
            </div>
            <button onClick={logout} style={{
              background: "none", border: "1px solid var(--border2)",
              color: "var(--text-muted)", padding: "7px 16px",
              borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer"
            }}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/auth/login" style={{
              color: "var(--text-muted)", fontSize: 14, fontWeight: 600,
              padding: "7px 16px", borderRadius: 20,
              border: "1px solid var(--border2)"
            }}>Login</Link>
            <Link href="/auth/register" style={{
              background: "var(--accent)", color: "#000",
              fontSize: 14, fontWeight: 700,
              padding: "7px 18px", borderRadius: 20
            }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
