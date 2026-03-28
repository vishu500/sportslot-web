"use client";
// src/app/owner/venues/[id]/slots/page.tsx
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ownerApi, venueApi } from "@/lib/api";
import { Venue, Slot } from "@/types";
import { format, addDays } from "date-fns";

const SLOT_TIMES = [
  "05:00:00", "06:00:00", "07:00:00", "08:00:00", "09:00:00",
  "10:00:00", "11:00:00", "14:00:00", "15:00:00",
  "16:00:00", "17:00:00", "18:00:00", "19:00:00", "20:00:00", "21:00:00",
];

export default function ManageSlotsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedDate, setSelectedDate] = useState(0);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [newSlot, setNewSlot] = useState({ startTime: "06:00:00", endTime: "07:00:00" });

  const dates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));
  const dateStr = format(dates[selectedDate], "yyyy-MM-dd");

  useEffect(() => {
    venueApi.getById(Number(id)).then(r => setVenue(r.data)).catch(() => router.back());
  }, [id]);

  useEffect(() => {
    venueApi.getSlots(Number(id), dateStr).then(r => setSlots(r.data)).catch(() => setSlots([]));
  }, [id, dateStr]);

  const handleAddSlot = async () => {
    setAdding(true);
    try {
      await ownerApi.addSlot(Number(id), {
        date: dateStr,
        startTime: newSlot.startTime,
        endTime: newSlot.endTime,
      });
      toast.success("Slot added! ✅");
      venueApi.getSlots(Number(id), dateStr).then(r => setSlots(r.data));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add slot");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteSlot = async (slotId: number) => {
    setDeleting(slotId);
    try {
      await ownerApi.deleteSlot(Number(id), slotId);
      setSlots(prev => prev.filter(s => s.id !== slotId));
      toast.success("Slot deleted");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Cannot delete booked slot");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div style={{ padding: "40px 32px", maxWidth: 800 }}>
      <div style={{ marginBottom: 32 }}>
        <Link href="/owner/venues" style={{ color: "var(--text-muted)", fontSize: 13, fontWeight: 600 }}>
          ← Back to Venues
        </Link>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 42, letterSpacing: 2, margin: "16px 0 8px" }}>
          MANAGE <span style={{ color: "var(--accent)" }}>SLOTS</span>
        </h1>
        {venue && <p style={{ color: "var(--text-muted)", fontSize: 15 }}>{venue.name}</p>}
      </div>

      {/* Date Selector */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ color: "var(--text-muted)", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>
          Select Date
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {dates.map((d, i) => (
            <button key={i} onClick={() => setSelectedDate(i)} style={{
              padding: "8px 16px", borderRadius: 10,
              background: selectedDate === i ? "var(--accent)" : "var(--surface)",
              color: selectedDate === i ? "#000" : "var(--text-muted)",
              fontWeight: selectedDate === i ? 700 : 500,
              border: selectedDate === i ? "none" : "1px solid var(--border2)",
              fontSize: 13, cursor: "pointer", fontFamily: "inherit"
            }}>
              {i === 0 ? "Today" : i === 1 ? "Tomorrow" : format(d, "EEE dd")}
            </button>
          ))}
        </div>
      </div>

      {/* Add Slot */}
      <div style={{
        background: "var(--surface)", borderRadius: 16,
        border: "1px solid rgba(0,229,160,0.3)", padding: "20px 24px",
        marginBottom: 28
      }}>
        <p style={{ color: "var(--text)", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
          ➕ Add New Slot for {format(dates[selectedDate], "EEEE, MMM dd")}
        </p>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div>
            <label style={{ color: "var(--text-muted)", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 8 }}>
              Start Time
            </label>
            <select
              value={newSlot.startTime}
              onChange={e => setNewSlot({ ...newSlot, startTime: e.target.value })}
              style={{
                background: "var(--surface2)", border: "1px solid var(--border2)",
                borderRadius: 10, padding: "10px 14px", color: "var(--text)",
                fontSize: 14, outline: "none", cursor: "pointer", fontFamily: "inherit"
              }}
            >
              {SLOT_TIMES.map(t => (
                <option key={t} value={t}>{t.slice(0, 5)}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ color: "var(--text-muted)", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 8 }}>
              End Time
            </label>
            <select
              value={newSlot.endTime}
              onChange={e => setNewSlot({ ...newSlot, endTime: e.target.value })}
              style={{
                background: "var(--surface2)", border: "1px solid var(--border2)",
                borderRadius: 10, padding: "10px 14px", color: "var(--text)",
                fontSize: 14, outline: "none", cursor: "pointer", fontFamily: "inherit"
              }}
            >
              {SLOT_TIMES.map(t => (
                <option key={t} value={t}>{t.slice(0, 5)}</option>
              ))}
            </select>
          </div>
          <button onClick={handleAddSlot} disabled={adding} style={{
            background: adding ? "var(--surface2)" : "var(--accent)",
            color: adding ? "var(--text-dim)" : "#000",
            border: "none", borderRadius: 10,
            padding: "10px 24px", fontWeight: 800,
            fontSize: 14, cursor: adding ? "not-allowed" : "pointer",
            fontFamily: "inherit"
          }}>
            {adding ? "Adding..." : "Add Slot"}
          </button>
        </div>
      </div>

      {/* Existing Slots */}
      <div>
        <p style={{ color: "var(--text-muted)", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>
          Slots on {format(dates[selectedDate], "EEEE, MMM dd")} ({slots.length} total)
        </p>

        {slots.length === 0 ? (
          <div style={{
            background: "var(--surface)", borderRadius: 14,
            border: "1px dashed var(--border2)", padding: "32px",
            textAlign: "center", color: "var(--text-muted)"
          }}>No slots for this date. Add some above!</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
            {slots.map(slot => {
              const isBooked = slot.status === "BOOKED";
              return (
                <div key={slot.id} style={{
                  background: isBooked ? "var(--surface2)" : "var(--surface)",
                  borderRadius: 12, padding: "14px 16px",
                  border: `1px solid ${isBooked ? "var(--border)" : "rgba(0,229,160,0.3)"}`,
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <div>
                    <p style={{
                      fontWeight: 700, fontSize: 15, margin: 0,
                      color: isBooked ? "var(--text-dim)" : "var(--text)"
                    }}>
                      {slot.startTime?.slice(0, 5)}
                    </p>
                    <p style={{ color: "var(--text-muted)", fontSize: 11, margin: "2px 0 0" }}>
                      → {slot.endTime?.slice(0, 5)}
                    </p>
                    <span style={{
                      fontSize: 10, fontWeight: 700, marginTop: 4, display: "block",
                      color: isBooked ? "#ff4444" : "var(--accent)"
                    }}>{isBooked ? "BOOKED" : "AVAILABLE"}</span>
                  </div>
                  {!isBooked && (
                    <button
                      onClick={() => handleDeleteSlot(slot.id)}
                      disabled={deleting === slot.id}
                      style={{
                        background: "none", border: "none",
                        color: deleting === slot.id ? "var(--text-dim)" : "#ff4444",
                        cursor: "pointer", fontSize: 18, padding: 4
                      }}
                    >🗑️</button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
