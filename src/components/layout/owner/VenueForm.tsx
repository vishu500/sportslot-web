"use client";
// src/components/owner/VenueForm.tsx
import { useState } from "react";

const SPORTS = ["Badminton", "Football", "Tennis", "Basketball", "Cricket", "Volleyball"];
const AMENITY_OPTIONS = ["Parking", "Changing Room", "Shower", "Cafeteria", "Equipment Rental",
  "Coaching", "Floodlights", "WiFi", "First Aid"];

interface VenueFormData {
  name: string;
  sport: string;
  location: string;
  address: string;
  description: string;
  pricePerHour: number | string;
  amenities: string;
}

interface Props {
  initialData?: Partial<VenueFormData>;
  onSubmit: (data: VenueFormData) => Promise<void>;
  submitLabel: string;
  loading: boolean;
}

export default function VenueForm({ initialData, onSubmit, submitLabel, loading }: Props) {
  const [form, setForm] = useState<VenueFormData>({
    name: initialData?.name || "",
    sport: initialData?.sport || "Badminton",
    location: initialData?.location || "",
    address: initialData?.address || "",
    description: initialData?.description || "",
    pricePerHour: initialData?.pricePerHour || "",
    amenities: initialData?.amenities || "",
  });

  const selectedAmenities = form.amenities ? form.amenities.split(",").map(a => a.trim()).filter(Boolean) : [];

  const toggleAmenity = (a: string) => {
    const current = selectedAmenities;
    const updated = current.includes(a) ? current.filter(x => x !== a) : [...current, a];
    setForm({ ...form, amenities: updated.join(",") });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  const inputStyle = {
    width: "100%", background: "var(--surface2)",
    border: "1px solid var(--border2)", borderRadius: 10,
    padding: "12px 16px", color: "var(--text)", fontSize: 14,
    outline: "none", fontFamily: "inherit"
  };

  const labelStyle = {
    color: "var(--text-muted)", fontSize: 13,
    fontWeight: 600 as const, display: "block" as const, marginBottom: 8
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Name */}
      <div>
        <label style={labelStyle}>Venue Name *</label>
        <input
          style={inputStyle}
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="Arena Badminton Complex"
          required
          onFocus={e => e.target.style.borderColor = "var(--accent)"}
          onBlur={e => e.target.style.borderColor = "var(--border2)"}
        />
      </div>

      {/* Sport */}
      <div>
        <label style={labelStyle}>Sport *</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {SPORTS.map(s => (
            <button key={s} type="button" onClick={() => setForm({ ...form, sport: s })} style={{
              padding: "8px 16px", borderRadius: 20,
              background: form.sport === s ? "var(--accent)" : "var(--surface2)",
              color: form.sport === s ? "#000" : "var(--text-muted)",
              fontWeight: form.sport === s ? 700 : 500,
              border: form.sport === s ? "none" : "1px solid var(--border2)",
              fontSize: 13, cursor: "pointer", fontFamily: "inherit"
            }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Location + Address */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={labelStyle}>Location / Area *</label>
          <input
            style={inputStyle}
            value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })}
            placeholder="Koramangala"
            required
            onFocus={e => e.target.style.borderColor = "var(--accent)"}
            onBlur={e => e.target.style.borderColor = "var(--border2)"}
          />
        </div>
        <div>
          <label style={labelStyle}>Full Address</label>
          <input
            style={inputStyle}
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            placeholder="5th Block, Koramangala, Bengaluru"
            onFocus={e => e.target.style.borderColor = "var(--accent)"}
            onBlur={e => e.target.style.borderColor = "var(--border2)"}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label style={labelStyle}>Description</label>
        <textarea
          style={{ ...inputStyle, minHeight: 80, resize: "vertical" as const }}
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          placeholder="Describe your venue..."
          onFocus={e => e.target.style.borderColor = "var(--accent)"}
          onBlur={e => e.target.style.borderColor = "var(--border2)"}
        />
      </div>

      {/* Price */}
      <div>
        <label style={labelStyle}>Price Per Hour (₹) *</label>
        <input
          style={{ ...inputStyle, maxWidth: 200 }}
          type="number"
          value={form.pricePerHour}
          onChange={e => setForm({ ...form, pricePerHour: e.target.value })}
          placeholder="400"
          min={1}
          required
          onFocus={e => e.target.style.borderColor = "var(--accent)"}
          onBlur={e => e.target.style.borderColor = "var(--border2)"}
        />
      </div>

      {/* Amenities */}
      <div>
        <label style={labelStyle}>Amenities</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {AMENITY_OPTIONS.map(a => {
            const selected = selectedAmenities.includes(a);
            return (
              <button key={a} type="button" onClick={() => toggleAmenity(a)} style={{
                padding: "7px 14px", borderRadius: 8,
                background: selected ? "rgba(0,229,160,0.12)" : "var(--surface2)",
                color: selected ? "var(--accent)" : "var(--text-muted)",
                fontWeight: selected ? 700 : 500,
                border: selected ? "1px solid rgba(0,229,160,0.4)" : "1px solid var(--border2)",
                fontSize: 12, cursor: "pointer", fontFamily: "inherit"
              }}>
                {selected ? "✓ " : ""}{a}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      <button type="submit" disabled={loading} style={{
        background: loading ? "var(--surface2)" : "var(--accent)",
        color: loading ? "var(--text-dim)" : "#000",
        border: "none", borderRadius: 12,
        padding: "14px", fontWeight: 800, fontSize: 15,
        cursor: loading ? "not-allowed" : "pointer",
        fontFamily: "inherit", marginTop: 8
      }}>
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
