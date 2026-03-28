"use client";
// src/app/owner/venues/new/page.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ownerApi } from "@/lib/api";
import VenueForm from "@/components/layout/owner/VenueForm";

export default function NewVenuePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      await ownerApi.createVenue({
        ...data,
        pricePerHour: Number(data.pricePerHour),
      });
      toast.success("Venue created! 🎉");
      router.push("/owner/venues");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create venue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px 32px", maxWidth: 700 }}>
      <div style={{ marginBottom: 32 }}>
        <Link href="/owner/venues" style={{ color: "var(--text-muted)", fontSize: 13, fontWeight: 600 }}>
          ← Back to Venues
        </Link>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 42, letterSpacing: 2, margin: "16px 0 8px" }}>
          ADD A <span style={{ color: "var(--accent)" }}>VENUE</span>
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
          Fill in the details below to list your venue
        </p>
      </div>

      <div style={{
        background: "var(--surface)", borderRadius: 20,
        border: "1px solid var(--border)", padding: "32px"
      }}>
        <VenueForm
          onSubmit={handleSubmit}
          submitLabel="Create Venue →"
          loading={loading}
        />
      </div>
    </div>
  );
}
