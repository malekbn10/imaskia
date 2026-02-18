import { forwardRef } from "react";
import { PrayerTimings } from "@/types";
import { MAIN_PRAYERS } from "@/lib/i18n/prayer-names";
import { parseTime } from "@/lib/prayer-utils";

interface ShareCardProps {
  timings: PrayerTimings;
  ramadanDay: number;
  cityName?: string;
}

/**
 * Off-screen card rendered at 600x900px for html2canvas capture.
 * Uses inline styles to ensure consistent rendering.
 */
const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  ({ timings, ramadanDay, cityName }, ref) => {
    const prayerLabels: Record<string, { ar: string; fr: string }> = {
      Imsak: { ar: "الإمساك", fr: "Imsak" },
      Fajr: { ar: "الفجر", fr: "Fajr" },
      Sunrise: { ar: "الشروق", fr: "Lever du soleil" },
      Dhuhr: { ar: "الظهر", fr: "Dhuhr" },
      Asr: { ar: "العصر", fr: "Asr" },
      Maghrib: { ar: "المغرب", fr: "Maghrib" },
      Isha: { ar: "العشاء", fr: "Isha" },
    };

    return (
      <div
        ref={ref}
        style={{
          width: 600,
          height: 900,
          background: "linear-gradient(180deg, #0A0E1A 0%, #111827 100%)",
          color: "#F1F5F9",
          fontFamily: "system-ui, sans-serif",
          padding: 40,
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: -1,
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 36, color: "#D4A843", fontWeight: 700, margin: 0 }}>
            إمساكية
          </h1>
          <p style={{ fontSize: 16, color: "#94A3B8", marginTop: 8 }}>
            Imsakia.tn
          </p>
        </div>

        {/* Day info */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <p style={{ fontSize: 20, color: "#D4A843" }}>
            رمضان — اليوم {ramadanDay}
          </p>
          {cityName && (
            <p style={{ fontSize: 14, color: "#94A3B8", marginTop: 4 }}>
              {cityName}
            </p>
          )}
        </div>

        {/* Prayer times */}
        <div style={{ flex: 1 }}>
          {MAIN_PRAYERS.map((key) => {
            const time = timings[key];
            const { hours, minutes } = parseTime(time);
            const timeStr = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
            const label = prayerLabels[key];

            return (
              <div
                key={key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 20px",
                  marginBottom: 8,
                  background: "rgba(17, 24, 39, 0.6)",
                  borderRadius: 12,
                  border: "1px solid rgba(212, 168, 67, 0.1)",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: 18, fontWeight: 600 }}>{label.ar}</span>
                  <span style={{ fontSize: 12, color: "#94A3B8" }}>{label.fr}</span>
                </div>
                <span style={{ fontSize: 24, fontWeight: 700, color: "#D4A843", fontFamily: "monospace" }}>
                  {timeStr}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 24, color: "#94A3B8", fontSize: 12 }}>
          imsakia.tn
        </div>
      </div>
    );
  }
);

ShareCard.displayName = "ShareCard";
export default ShareCard;
