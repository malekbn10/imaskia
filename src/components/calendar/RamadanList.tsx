"use client";

import { useEffect, useRef } from "react";
import { DayInfo } from "@/types";
import { parseTime, getFastingDuration } from "@/lib/prayer-utils";
import { useTranslation } from "@/lib/i18n/context";

interface RamadanListProps {
  days: DayInfo[];
}

function getTodayDDMMYYYY(): string {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
}

export default function RamadanList({ days }: RamadanListProps) {
  const { t } = useTranslation();
  const todayStr = getTodayDDMMYYYY();
  const todayRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to today's row on mount
  useEffect(() => {
    if (todayRef.current) {
      todayRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  return (
    <div className="space-y-2">
      {days.map((day, idx) => {
        // idx+1 = Ramadan day number (based on official start, not API hijri)
        const ramadanDay = idx + 1;
        const isToday = day.date.gregorian.date === todayStr;
        const isLastTen = ramadanDay >= 21;
        const isNight27 = ramadanDay === 27;

        const imsakTime = parseTime(day.timings.Imsak);
        const maghribTime = parseTime(day.timings.Maghrib);
        const { duration } = getFastingDuration(day.timings.Imsak, day.timings.Maghrib);

        const imsakStr = `${String(imsakTime.hours).padStart(2, "0")}:${String(imsakTime.minutes).padStart(2, "0")}`;
        const maghribStr = `${String(maghribTime.hours).padStart(2, "0")}:${String(maghribTime.minutes).padStart(2, "0")}`;

        return (
          <div
            key={idx}
            ref={isToday ? todayRef : undefined}
            className={`rounded-xl border px-4 py-3 transition-colors ${
              isToday
                ? "border-gold/50 bg-gold/10 ring-1 ring-gold/30"
                : isLastTen
                ? "border-islamic-green/20 bg-islamic-green/5"
                : "border-gold-dim/30 bg-card/40"
            }`}
          >
            {/* Row 1: Day number + date + today badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-off-white">
                  {ramadanDay}
                </span>
                <span className="text-xs text-slate-gray" dir="ltr">
                  {day.date.gregorian.day}/{day.date.gregorian.month.number}
                </span>
                {isToday && (
                  <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-night-blue">
                    {t("calendar.today")}
                  </span>
                )}
                {isNight27 && (
                  <span className="text-sm" title={t("calendar.laylatAlQadr")}>
                    ✨
                  </span>
                )}
                {isLastTen && !isNight27 && (
                  <span className="h-1.5 w-1.5 rounded-full bg-islamic-green" />
                )}
              </div>
              <span className="font-mono text-xs text-gold">{duration}</span>
            </div>

            {/* Row 2: Imsak + Maghrib */}
            <div className="mt-1.5 flex items-center gap-4 text-xs">
              <span className="text-slate-gray">
                {t("calendar.imsakTime")}:{" "}
                <span className="font-mono text-danger" dir="ltr">{imsakStr}</span>
              </span>
              <span className="text-slate-gray">
                {t("calendar.maghribTime")}:{" "}
                <span className="font-mono text-warning" dir="ltr">{maghribStr}</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
