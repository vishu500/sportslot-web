"use client";
// src/app/owner/layout.tsx
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

const navItems = [
  { href: "/owner/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/owner/venues", label: "My Venues", icon: "🏟️" },
  { href: "/owner/bookings", label: "Bookings", icon: "📅" },
];

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isOwner, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoggedIn) { router.replace("/auth/login"); return; }
    if (!isOwner) { router.replace("/venues"); return; }
  }, [isLoggedIn, isOwner]);

  if (!isLoggedIn || !isOwner) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column",
        position: "fixed", top: 0, left: 0, height: "100vh",
        padding: "24px 0", zIndex: 100
      }}>
        {/* Logo */}
        <div style={{ padding: "0 20px 28px", borderBottom: "1px solid var(--border)" }}>
          <Link href="/">
            <span style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: 2 }}>
              SPORT<span style={{ color: "var(--accent)" }}>SLOT</span>
            </span>
          </Link>
          <div style={{
            marginTop: 12, background: "rgba(0,229,160,0.1)",
            border: "1px solid rgba(0,229,160,0.3)",
            borderRadius: 8, padding: "6px 10px",
            display: "inline-block"
          }}>
            <span style={{ color: "var(--accent)", fontSize: 12, fontWeight: 700 }}>
              🏟️ Venue Owner
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: "20px 12px" }}>
          {navItems.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 12px", borderRadius: 10, marginBottom: 4,
                background: active ? "rgba(0,229,160,0.12)" : "none",
                color: active ? "var(--accent)" : "var(--text-muted)",
                fontWeight: active ? 700 : 500, fontSize: 14,
                border: active ? "1px solid rgba(0,229,160,0.25)" : "1px solid transparent",
                transition: "all 0.2s", textDecoration: "none"
              }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent), var(--accent-dim))",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#000", fontWeight: 800, fontSize: 14, flexShrink: 0
            }}>{user?.name?.[0]?.toUpperCase()}</div>
            <div style={{ overflow: "hidden" }}>
              <p style={{ color: "var(--text)", fontWeight: 600, fontSize: 13, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</p>
              <p style={{ color: "var(--text-muted)", fontSize: 11, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.email}</p>
            </div>
          </div>
          <button onClick={logout} style={{
            width: "100%", padding: "8px", borderRadius: 8,
            border: "1px solid rgba(255,68,68,0.3)", background: "none",
            color: "#ff4444", fontSize: 13, fontWeight: 600, cursor: "pointer",
            transition: "all 0.2s"
          }}>Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: 240, flex: 1, minHeight: "100vh" }}>
        {children}
      </main>
    </div>
  );
}
