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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.register(form);
      const { token } = res.data;
      login(token, { name: form.name, email: form.email });
      toast.success("Account created! Let's find your court 🎉");
      router.push("/venues");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof typeof form, label: string, type = "text", placeholder = "") => (
    <div>
      <label style={{ color: "var(--text-muted)", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
        {label}
      </label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        required={key !== "phone"}
        style={{
          width: "100%", background: "var(--surface2)",
          border: "1px solid var(--border2)", borderRadius: "var(--radius-sm)",
          padding: "12px 16px", color: "var(--text)", fontSize: 14,
          outline: "none", transition: "border-color 0.2s"
        }}
        onFocus={e => e.target.style.borderColor = "var(--accent)"}
        onBlur={e => e.target.style.borderColor = "var(--border2)"}
      />
    </div>
  );

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
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Create account</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Start booking sports venues today</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {field("name", "Full Name", "text", "Arjun Singh")}
          {field("email", "Email", "email", "arjun@email.com")}
          {field("password", "Password", "password", "min 6 characters")}
          {field("phone", "Phone (optional)", "tel", "9876543210")}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8,
              background: loading ? "var(--surface2)" : "var(--accent)",
              color: loading ? "var(--text-dim)" : "#000",
              border: "none", borderRadius: "var(--radius-sm)",
              padding: "14px", fontWeight: 800, fontSize: 15,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "all 0.2s"
            }}
          >
            {loading
              ? <><span className="spinner" style={{ display: "inline-block", width: 18, height: 18, border: "2px solid #555", borderTopColor: "var(--accent)", borderRadius: "50%" }} /> Creating...</>
              : "Create Account →"}
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
