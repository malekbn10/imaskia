"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { DayInfo } from "@/types";
import { useTranslation } from "@/lib/i18n/context";
import { getCoords } from "@/lib/storage";
import { RAMADAN_START, RAMADAN_DAYS } from "@/lib/prayer-utils";
import GlassCard from "@/components/ui/GlassCard";
import RamadanList from "@/components/calendar/RamadanList";

/** Build the set of DD-MM-YYYY strings for the 30 Ramadan days */
function getRamadanDateSet(): Set<string> {
  const dates = new Set<string>();
  for (let i = 0; i < RAMADAN_DAYS; i++) {
    const d = new Date(RAMADAN_START);
    d.setDate(d.getDate() + i);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    dates.add(`${dd}-${mm}-${d.getFullYear()}`);
  }
  return dates;
}

export default function CalendarPage() {
  const [days, setDays] = useState<DayInfo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    async function fetchRamadanDays() {
      const coords = getCoords();
      if (!coords) {
        setError(t("home.locationRequired"));
        return;
      }

      try {
        // Ramadan 2026 spans February + March
        const [resFeb, resMar] = await Promise.all([
          fetch(`/api/calendar?lat=${coords.lat}&lng=${coords.lng}&month=2&year=2026`),
          fetch(`/api/calendar?lat=${coords.lat}&lng=${coords.lng}&month=3&year=2026`),
        ]);

        if (!resFeb.ok || !resMar.ok) throw new Error("Failed");

        const febJson = await resFeb.json();
        const marJson = await resMar.json();

        const allDays: DayInfo[] = [
          ...(febJson.data as DayInfo[]),
          ...(marJson.data as DayInfo[]),
        ];

        // Filter by official Ramadan dates (not Hijri month)
        const ramadanDates = getRamadanDateSet();
        const ramadanDays = allDays.filter((d) =>
          ramadanDates.has(d.date.gregorian.date)
        );

        setDays(ramadanDays);
      } catch {
        setError(t("common.error"));
      }
    }
    fetchRamadanDays();
  }, [t]);

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-xl font-bold text-gold">{t("calendar.title")}</h1>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-gray">
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm bg-gold/20 border border-gold/40" />
          {t("calendar.today")}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-islamic-green" />
          {t("calendar.lastTenNights")}
        </span>
        <span className="flex items-center gap-1">
          ✨ {t("calendar.laylatAlQadr")}
        </span>
      </div>

      {error && (
        <GlassCard className="p-6 text-center">
          <p className="text-danger">{error}</p>
        </GlassCard>
      )}

      {!days && !error && (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      )}

      {days && <RamadanList days={days} />}
    </div>
  );
}
