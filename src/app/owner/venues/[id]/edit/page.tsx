"use client";
// src/app/owner/venues/[id]/edit/page.tsx
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ownerApi, venueApi } from "@/lib/api";
import { Venue } from "@/types";
import VenueForm from "@/components/layout/owner/VenueForm";

export default function EditVenuePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    venueApi.getById(Number(id)).then(r => setVenue(r.data));
  }, [id]);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      await ownerApi.updateVenue(Number(id), {
        ...data,
        pricePerHour: Number(data.pricePerHour),
      });
      toast.success("Venue updated! ✅");
      router.push("/owner/venues");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update venue");
    } finally {
      setLoading(false);
    }
  };

  if (!venue) return (
    <div style={{ padding: "40px 32px" }}>
      <div className="spinner" style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%" }} />
    </div>
  );

  return (
    <div style={{ padding: "40px 32px", maxWidth: 700 }}>
      <div style={{ marginBottom: 32 }}>
        <Link href="/owner/venues" style={{ color: "var(--text-muted)", fontSize: 13, fontWeight: 600 }}>
          ← Back to Venues
        </Link>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 42, letterSpacing: 2, margin: "16px 0 8px" }}>
          EDIT <span style={{ color: "var(--accent)" }}>VENUE</span>
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 15 }}>{venue.name}</p>
      </div>

      <div style={{
        background: "var(--surface)", borderRadius: 20,
        border: "1px solid var(--border)", padding: "32px"
      }}>
        <VenueForm
          initialData={venue}
          onSubmit={handleSubmit}
          submitLabel="Save Changes →"
          loading={loading}
        />
      </div>
    </div>
  );
}
