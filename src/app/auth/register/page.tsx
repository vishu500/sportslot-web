"use client";
// src/app/auth/register/page.tsx
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authApi } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [role, setRole] = useState<"USER" | "VENUE_OWNER">("USER");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.register({ ...form, role });
      const { token } = res.data;
      login(token, { name: form.name, email: form.email, role });
      toast.success("Account created! 🎉");
      if (role === "VENUE_OWNER") {
        router.push("/owner/dashboard");
      } else {
        router.push("/venues");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      padding: "24px",
      background: "radial-gradient(ellipse at top, #0d1a12 0%, var(--bg) 60%)"
    }}>
      <div className="fade-up" style={{
        width: "100%", maxWidth: 440,
        background: "var(--surface)", borderRadius: 24,
        border: "1px solid var(--border)",
        padding: "40px 36px",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6)"
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ display: "inline-block", marginBottom: 20 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: 3 }}>
              SPORT<span style={{ color: "var(--accent)" }}>SLOT</span>
            </span>
          </Link>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Create account</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Join SportSlot today</p>
        </div>

        {/* Role Selector */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {[
            { value: "USER", label: "🏃 I'm a Player", desc: "Book venues & play" },
            { value: "VENUE_OWNER", label: "🏟️ I own a Venue", desc: "List & manage venues" },
          ].map(r => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRole(r.value as "USER" | "VENUE_OWNER")}
              style={{
                flex: 1, padding: "14px 12px", borderRadius: 14,
                border: `2px solid ${role === r.value ? "var(--accent)" : "var(--border2)"}`,
                background: role === r.value ? "rgba(0,229,160,0.08)" : "var(--surface2)",
                cursor: "pointer", textAlign: "center", transition: "all 0.2s"
              }}
            >
              <div style={{ fontSize: 20, marginBottom: 4 }}>{r.label.split(" ")[0]}</div>
              <div style={{ color: role === r.value ? "var(--accent)" : "var(--text)", fontWeight: 700, fontSize: 13 }}>
                {r.label.slice(2)}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: 11, marginTop: 2 }}>{r.desc}</div>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { key: "name", label: "Full Name", type: "text", placeholder: "Arjun Singh" },
            { key: "email", label: "Email", type: "email", placeholder: "arjun@email.com" },
            { key: "password", label: "Password", type: "password", placeholder: "min 6 characters" },
            { key: "phone", label: "Phone (optional)", type: "tel", placeholder: "9876543210" },
          ].map(f => (
            <div key={f.key}>
              <label style={{ color: "var(--text-muted)", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                {f.label}
              </label>
              <input
                type={f.type}
                value={form[f.key as keyof typeof form]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                required={f.key !== "phone"}
                style={{
                  width: "100%", background: "var(--surface2)",
                  border: "1px solid var(--border2)", borderRadius: "var(--radius-sm)",
                  padding: "12px 16px", color: "var(--text)", fontSize: 14, outline: "none"
                }}
                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                onBlur={e => e.target.style.borderColor = "var(--border2)"}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={{
            marginTop: 8, background: loading ? "var(--surface2)" : "var(--accent)",
            color: loading ? "var(--text-dim)" : "#000",
            border: "none", borderRadius: "var(--radius-sm)",
            padding: "14px", fontWeight: 800, fontSize: 15,
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8
          }}>
            {loading
              ? <><span className="spinner" style={{ display: "inline-block", width: 18, height: 18, border: "2px solid #555", borderTopColor: "var(--accent)", borderRadius: "50%" }} /> Creating...</>
              : `Create ${role === "VENUE_OWNER" ? "Owner" : ""} Account →`}
          </button>
        </form>

        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 14, marginTop: 24 }}>
          Already have an account?{" "}
          <Link href="/auth/login" style={{ color: "var(--accent)", fontWeight: 700 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
