"use client";

import { PrayerTimings } from "@/types";
import { getFastingDuration } from "@/lib/prayer-utils";
import { useTranslation } from "@/lib/i18n/context";
import GlassCard from "@/components/ui/GlassCard";

interface FastingCardProps {
  timings: PrayerTimings;
  ramadanDay: number;
  totalDays?: number;
}

export default function FastingCard({ timings, ramadanDay, totalDays = 30 }: FastingCardProps) {
  const { duration } = getFastingDuration(timings.Imsak, timings.Maghrib);
  const progress = Math.min((ramadanDay / totalDays) * 100, 100);
  const { t } = useTranslation();

  return (
    <GlassCard className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-gray">{t("home.fasting")}</span>
        <span className="font-mono text-lg font-bold text-gold" dir="ltr">
          {duration}
        </span>
      </div>

      {/* Ramadan day progress */}
      <div className="mb-2 flex items-center justify-between text-xs text-slate-gray">
        <span>
          {t("home.day")} {ramadanDay} {t("home.of")} {totalDays}
        </span>
        <span>{Math.round(progress)}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-card-lighter">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </GlassCard>
  );
}
