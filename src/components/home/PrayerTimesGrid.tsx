"use client";

import { PrayerTimings, PrayerKey } from "@/types";
import { MAIN_PRAYERS } from "@/lib/i18n/prayer-names";
import { parseTime } from "@/lib/prayer-utils";
import { useTranslation } from "@/lib/i18n/context";

interface PrayerTimesGridProps {
  timings: PrayerTimings;
  activePrayer?: PrayerKey;
}

const prayerColors: Record<string, string> = {
  Imsak: "text-danger",
  Fajr: "text-gold",
  Sunrise: "text-warning",
  Dhuhr: "text-off-white",
  Asr: "text-off-white",
  Maghrib: "text-warning",
  Isha: "text-off-white",
};

export default function PrayerTimesGrid({ timings, activePrayer }: PrayerTimesGridProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-2">
      {MAIN_PRAYERS.map((key) => {
        const time = timings[key];
        const { hours, minutes } = parseTime(time);
        const timeFormatted = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
        const isActive = activePrayer === key;

        return (
          <div
            key={key}
            className={`flex items-center justify-between rounded-xl px-4 py-3 transition-colors ${
              isActive
                ? "bg-mint-dim border border-mint/30"
                : "bg-card/40"
            }`}
          >
            <span className="font-medium text-off-white">
              {t(`prayers.${key.toLowerCase()}`)}
            </span>
            <span
              className={`font-mono text-lg font-semibold ${prayerColors[key] || "text-off-white"}`}
              dir="ltr"
            >
              {timeFormatted}
            </span>
          </div>
        );
      })}
    </div>
  );
}
