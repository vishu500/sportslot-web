"use client";
// src/app/venues/[id]/page.tsx
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { venueApi, bookingApi, reviewApi } from "@/lib/api";
import { Venue, Slot, Review } from "@/types";
import { useAuth } from "@/lib/AuthContext";
import toast from "react-hot-toast";
import { format, addDays } from "date-fns";

const SPORT_COLORS: Record<string, string> = {
  Badminton: "#00E5A0", Football: "#FF6B35", Tennis: "#FFD700",
  Basketball: "#FF4081", Cricket: "#7C6AF7", Volleyball: "#00B4D8",
};
const SPORT_EMOJI: Record<string, string> = {
  Badminton: "🏸", Football: "⚽", Tennis: "🎾",
  Basketball: "🏀", Cricket: "🏏", Volleyball: "🏐",
};

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map(s => (
        <svg key={s} width={size} height={size} viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? "#FFD700" : "#333"}>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

function ClickableStars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {[1,2,3,4,5].map(s => (
        <svg key={s} width={28} height={28} viewBox="0 0 24 24"
          fill={(hover || value) >= s ? "#FFD700" : "#2a2a2a"}
          style={{ cursor: "pointer", transition: "transform 0.1s", transform: hover === s ? "scale(1.25)" : "scale(1)" }}
          onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

export default function VenueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const [venue, setVenue] = useState<Venue | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [tab, setTab] = useState<"book" | "reviews">("book");
  const [booking, setBooking] = useState(false);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const dates = Array.from({ length: 5 }, (_, i) => addDays(new Date(), i));
  const dateStr = format(dates[selectedDate], "yyyy-MM-dd");
  const color = venue ? (SPORT_COLORS[venue.sport] || "var(--accent)") : "var(--accent)";

  useEffect(() => {
    if (!id) return;
    venueApi.getById(Number(id)).then(r => setVenue(r.data)).catch(() => router.push("/venues"));
    reviewApi.getByVenue(Number(id)).then(r => setReviews(r.data)).catch(() => {});
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setSelectedSlot(null);
    venueApi.getSlots(Number(id), dateStr).then(r => setSlots(r.data)).catch(() => setSlots([]));
  }, [id, dateStr]);

  const handleBook = async () => {
    if (!isLoggedIn) { toast.error("Please login to book"); router.push("/auth/login"); return; }
    if (!selectedSlot) return;
    setBooking(true);
    try {
      await bookingApi.create({ venueId: Number(id), slotId: selectedSlot.id });
      toast.success("Booking confirmed! 🎉");
      setSelectedSlot(null);
      venueApi.getSlots(Number(id), dateStr).then(r => setSlots(r.data));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  const handleReview = async () => {
    if (!isLoggedIn) { toast.error("Please login to review"); return; }
    if (!myRating) { toast.error("Please select a rating"); return; }
    setSubmittingReview(true);
    try {
      await reviewApi.add({ venueId: Number(id), rating: myRating, comment: myComment });
      toast.success("Review submitted! ⭐");
      setMyRating(0); setMyComment("");
      reviewApi.getByVenue(Number(id)).then(r => setReviews(r.data));
      venueApi.getById(Number(id)).then(r => setVenue(r.data));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!venue) return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex", justifyContent: "center", padding: "100px 0" }}>
        <div className="spinner" style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%" }} />
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>

        {/* Back */}
        <button onClick={() => router.back()} style={{
          background: "none", border: "1px solid var(--border2)", color: "var(--text-muted)",
          padding: "7px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 28
        }}>← Back</button>

        {/* Venue Hero */}
        <div style={{
          background: `linear-gradient(135deg, ${color}18, var(--surface))`,
          borderRadius: "var(--radius)", border: `1px solid ${color}30`,
          padding: "28px 32px", marginBottom: 28,
          display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap"
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20, flexShrink: 0,
            background: `${color}25`, border: `2px solid ${color}50`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34
          }}>
            {SPORT_EMOJI[venue.sport] || "🏟️"}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>{venue.name}</h1>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ color, fontWeight: 700, fontSize: 13 }}>{venue.sport}</span>
              <span style={{ color: "var(--text-dim)" }}>•</span>
              <span style={{ color: "var(--text-muted)", fontSize: 13 }}>📍 {venue.location}</span>
              {venue.address && <><span style={{ color: "var(--text-dim)" }}>•</span>
              <span style={{ color: "var(--text-muted)", fontSize: 13 }}>{venue.address}</span></>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
              <Stars rating={venue.avgRating} size={15} />
              <span style={{ fontWeight: 700 }}>{venue.avgRating?.toFixed(1)}</span>
              <span style={{ color: "var(--text-dim)", fontSize: 13 }}>({venue.totalReviews} reviews)</span>
            </div>
            {venue.amenities && (
              <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                {venue.amenities.split(",").map(a => (
                  <span key={a} style={{
                    background: "var(--surface2)", color: "var(--text-muted)",
                    padding: "4px 12px", borderRadius: 8, fontSize: 12,
                    border: `1px solid ${color}25`
                  }}>✓ {a.trim()}</span>
                ))}
              </div>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color, fontWeight: 900, fontSize: 28 }}>₹{venue.pricePerHour}</p>
            <p style={{ color: "var(--text-dim)", fontSize: 12 }}>per hour</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--border)", marginBottom: 28 }}>
          {(["book", "reviews"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "12px 24px", background: "none", border: "none",
              color: tab === t ? color : "var(--text-muted)",
              fontWeight: tab === t ? 700 : 500, fontSize: 14, cursor: "pointer",
              borderBottom: tab === t ? `2px solid ${color}` : "2px solid transparent",
              marginBottom: -1, transition: "all 0.2s", textTransform: "capitalize"
            }}>{t === "book" ? "📅 Book Slot" : `⭐ Reviews (${reviews.length})`}</button>
          ))}
        </div>

        {/* Book Tab */}
        {tab === "book" && (
          <div>
            {/* Date Picker */}
            <h3 style={{ fontSize: 13, color: "var(--text-muted)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Select Date</h3>
            <div style={{ display: "flex", gap: 10, marginBottom: 32, flexWrap: "wrap" }}>
              {dates.map((d, i) => (
                <button key={i} onClick={() => setSelectedDate(i)} style={{
                  padding: "10px 18px", borderRadius: 12,
                  background: selectedDate === i ? color : "var(--surface)",
                  color: selectedDate === i ? "#000" : "var(--text-muted)",
                  fontWeight: selectedDate === i ? 700 : 500, fontSize: 14,
                  border: selectedDate === i ? "none" : "1px solid var(--border2)",
                  transition: "all 0.2s"
                } as React.CSSProperties}>
                  {i === 0 ? "Today" : i === 1 ? "Tomorrow" : format(d, "EEE dd")}
                </button>
              ))}
            </div>

            {/* Slots Grid */}
            <h3 style={{ fontSize: 13, color: "var(--text-muted)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Available Slots</h3>
            {slots.length === 0 ? (
              <p style={{ color: "var(--text-dim)", padding: "32px 0" }}>No slots found for this date.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 12, marginBottom: 32 }}>
                {slots.map(slot => {
                  const isBooked = slot.status === "BOOKED";
                  const isSelected = selectedSlot?.id === slot.id;
                  return (
                    <button
                      key={slot.id}
                      onClick={() => !isBooked && setSelectedSlot(isSelected ? null : slot)}
                      style={{
                        padding: "14px 0", borderRadius: 12,
                        border: `1.5px solid ${isBooked ? "var(--border)" : isSelected ? color : "var(--border2)"}`,
                        background: isBooked ? "var(--surface2)" : isSelected ? `${color}18` : "var(--surface)",
                        color: isBooked ? "var(--text-dim)" : isSelected ? color : "var(--text-muted)",
                        fontWeight: isSelected ? 700 : 500, fontSize: 14,
                        cursor: isBooked ? "not-allowed" : "pointer",
                        textDecoration: isBooked ? "line-through" : "none",
                        transition: "all 0.2s"
                      }}
                    >
                      {slot.startTime?.slice(0, 5)}
                      {!isBooked && <div style={{ fontSize: 11, color: isSelected ? color : "var(--text-dim)", marginTop: 2 }}>
                        {slot.startTime?.slice(0,5)}–{slot.endTime?.slice(0,5)}
                      </div>}
                      {isBooked && <div style={{ fontSize: 11, marginTop: 2 }}>Booked</div>}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Confirm Button */}
            <button
              onClick={handleBook}
              disabled={!selectedSlot || booking}
              style={{
                width: "100%", padding: "16px", borderRadius: 14, border: "none",
                background: selectedSlot && !booking ? color : "var(--surface2)",
                color: selectedSlot && !booking ? "#000" : "var(--text-dim)",
                fontWeight: 800, fontSize: 16, transition: "all 0.3s",
                boxShadow: selectedSlot ? `0 8px 32px ${color}40` : "none",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8
              }}
            >
              {booking
                ? <><span className="spinner" style={{ display: "inline-block", width: 18, height: 18, border: "2px solid #555", borderTopColor: "#000", borderRadius: "50%" }} /> Confirming...</>
                : selectedSlot
                  ? `Confirm Booking · ${selectedSlot.startTime?.slice(0,5)} – ${selectedSlot.endTime?.slice(0,5)} · ₹${venue.pricePerHour}`
                  : "Select a slot to continue"}
            </button>
          </div>
        )}

        {/* Reviews Tab */}
        {tab === "reviews" && (
          <div>
            {/* Summary */}
            <div style={{
              background: "var(--surface)", borderRadius: "var(--radius)",
              border: "1px solid var(--border)", padding: "24px",
              display: "flex", gap: 28, alignItems: "center", marginBottom: 24
            }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ color, fontFamily: "var(--font-display)", fontSize: 52, letterSpacing: 2, lineHeight: 1 }}>
                  {venue.avgRating?.toFixed(1)}
                </p>
                <Stars rating={venue.avgRating} size={18} />
                <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 6 }}>{venue.totalReviews} reviews</p>
              </div>
              <div style={{ flex: 1 }}>
                {[5,4,3,2,1].map(s => {
                  const count = reviews.filter(r => Math.round(r.rating) === s).length;
                  const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={s} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ color: "var(--text-muted)", fontSize: 13, width: 10 }}>{s}</span>
                      <div style={{ flex: 1, height: 6, background: "var(--border2)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3, transition: "width 0.5s" }} />
                      </div>
                      <span style={{ color: "var(--text-dim)", fontSize: 12, width: 24 }}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Review list */}
            {reviews.map(r => (
              <div key={r.id} style={{
                background: "var(--surface)", borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)", padding: "16px 20px", marginBottom: 12
              }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                    background: `${color}25`, display: "flex", alignItems: "center",
                    justifyContent: "center", color, fontWeight: 800, fontSize: 15,
                    border: `1px solid ${color}40`
                  }}>{r.user?.name?.[0]?.toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{r.user?.name}</span>
                      <span style={{ color: "var(--text-dim)", fontSize: 12 }}>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Stars rating={r.rating} />
                    {r.comment && <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 8, lineHeight: 1.5 }}>{r.comment}</p>}
                  </div>
                </div>
              </div>
            ))}

            {/* Write review */}
            <div style={{
              background: "var(--surface)", borderRadius: "var(--radius)",
              border: `1px solid ${color}30`, padding: "24px", marginTop: 16
            }}>
              <h3 style={{ fontWeight: 800, fontSize: 15, marginBottom: 16 }}>Write a Review</h3>
              <ClickableStars value={myRating} onChange={setMyRating} />
              <textarea
                value={myComment}
                onChange={e => setMyComment(e.target.value)}
                placeholder="Share your experience at this venue..."
                rows={3}
                style={{
                  width: "100%", marginTop: 16,
                  background: "var(--surface2)", border: "1px solid var(--border2)",
                  borderRadius: 10, padding: "12px 14px",
                  color: "var(--text)", fontSize: 14, resize: "none", outline: "none"
                }}
              />
              <button
                onClick={handleReview}
                disabled={!myRating || submittingReview}
                style={{
                  marginTop: 14, padding: "12px 28px", borderRadius: 10, border: "none",
                  background: myRating && !submittingReview ? color : "var(--surface2)",
                  color: myRating && !submittingReview ? "#000" : "var(--text-dim)",
                  fontWeight: 700, fontSize: 14, transition: "all 0.2s"
                }}
              >
                {submittingReview ? "Submitting..." : "Submit Review ⭐"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
