"use client";
// src/app/auth/login/page.tsx
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authApi } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login(form);
      const { token, name, email, role } = res.data;
      login(token, { name, email, role });
      toast.success(`Welcome back, ${name}! 🎉`);

      // Redirect based on role
      if (role === "VENUE_OWNER" || role === "ADMIN") {
        router.push("/owner/dashboard");
      } else {
        router.push("/venues");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid credentials. Please try again.");
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
        width: "100%", maxWidth: 420,
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
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Welcome back</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Login to your account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { key: "email", label: "Email", type: "email", placeholder: "arjun@email.com" },
            { key: "password", label: "Password", type: "password", placeholder: "••••••••" },
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
                required
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
              ? <><span className="spinner" style={{ display: "inline-block", width: 18, height: 18, border: "2px solid #555", borderTopColor: "var(--accent)", borderRadius: "50%" }} /> Logging in...</>
              : "Login →"}
          </button>
        </form>

        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 14, marginTop: 24 }}>
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" style={{ color: "var(--accent)", fontWeight: 700 }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
