"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { DayInfo } from "@/types";
import { useTranslation } from "@/lib/i18n/context";
import { getCoords } from "@/lib/storage";
import RamadanTable from "@/components/calendar/RamadanTable";
import GlassCard from "@/components/ui/GlassCard";

export default function CalendarPage() {
  const [days, setDays] = useState<DayInfo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchCalendar() {
      const coords = getCoords();
      if (!coords) {
        setError("يرجى تحديد موقعك أولاً من الصفحة الرئيسية");
        return;
      }

      try {
        const now = new Date();
        const res = await fetch(
          `/api/calendar?lat=${coords.lat}&lng=${coords.lng}&month=${now.getMonth() + 1}&year=${now.getFullYear()}`
        );
        if (!res.ok) throw new Error("Failed");
        const json = await res.json();
        setDays(json.data as DayInfo[]);
      } catch {
        setError(t("common.error"));
      }
    }
    fetchCalendar();
  }, [t]);

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-xl font-bold text-gold">{t("calendar.title")}</h1>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-gray">
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm bg-gold/10 border border-gold/30" />
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

      {days && <RamadanTable days={days} />}
    </div>
  );
}
