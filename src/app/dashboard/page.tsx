"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Check, Flame, Share2, BarChart3 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import {
  toggleWorshipItem,
  getDayItems,
  getStreak,
  getWeeklyStats,
} from "@/lib/storage";
import GlassCard from "@/components/ui/GlassCard";

const WORSHIP_ITEMS = [
  { id: "fajr_ontime", emoji: "🕌" },
  { id: "quran_juz", emoji: "📖" },
  { id: "morning_adhkar", emoji: "🌅" },
  { id: "sadaqa", emoji: "💝" },
  { id: "fasted", emoji: "🌙" },
  { id: "evening_adhkar", emoji: "🌇" },
  { id: "tarawih", emoji: "🤲" },
] as const;

const ITEM_IDS = WORSHIP_ITEMS.map((i) => i.id);

function todayKey(): string {
  return new Date().toISOString().split("T")[0];
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState<Record<string, boolean>>({});
  const [streak, setStreak] = useState(0);
  const [weeklyStats, setWeeklyStats] = useState<Record<string, number>>({});
  const [showStats, setShowStats] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(() => {
    const today = todayKey();
    setItems(getDayItems(today));
    setStreak(getStreak(ITEM_IDS));
    setWeeklyStats(getWeeklyStats(ITEM_IDS));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleToggle = (id: string) => {
    const today = todayKey();
    toggleWorshipItem(today, id);
    refresh();
  };

  const checkedCount = Object.values(items).filter(Boolean).length;
  const progress = Math.round((checkedCount / WORSHIP_ITEMS.length) * 100);
  const allDone = checkedCount === WORSHIP_ITEMS.length;

  const handleShare = async () => {
    if (!shareRef.current) return;
    try {
      const { toBlob } = await import("html-to-image");
      const blob = await toBlob(shareRef.current, {
        backgroundColor: "#0A0E1A",
        pixelRatio: 2,
      });
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `imsakia-dashboard-${todayKey()}.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      // Silently fail
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gold">{t("dashboard.title")}</h1>
        <button
          onClick={() => setShowStats(!showStats)}
          className="flex items-center gap-1 rounded-lg bg-card-lighter px-3 py-1.5 text-xs text-slate-gray hover:text-off-white"
        >
          <BarChart3 size={14} />
          {t("dashboard.weeklyStats")}
        </button>
      </div>

      {/* Shareable card */}
      <div ref={shareRef}>
        {/* Streak */}
        <GlassCard className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
              <Flame size={24} className="text-warning" />
            </div>
            <div>
              <p className="text-sm text-slate-gray">{t("dashboard.streak")}</p>
              <p className="text-2xl font-bold text-warning">
                {streak}{" "}
                <span className="text-sm font-normal">
                  {t("dashboard.streakDays")}
                </span>
              </p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-gray">{t("dashboard.progress")}</p>
            <p
              className={`text-2xl font-bold ${allDone ? "text-mint" : "text-gold"}`}
            >
              {progress}%
            </p>
          </div>
        </GlassCard>

        {/* Progress bar */}
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-card-lighter">
          <div
            className={`h-full rounded-full transition-all duration-500 ${allDone ? "bg-mint" : "bg-gold"}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Worship items */}
        <div className="mt-4 space-y-2">
          {WORSHIP_ITEMS.map(({ id, emoji }) => {
            const checked = items[id] ?? false;
            return (
              <button
                key={id}
                onClick={() => handleToggle(id)}
                className={`flex w-full items-center gap-3 rounded-xl p-3.5 text-sm transition-all ${
                  checked
                    ? "bg-mint/10 text-mint"
                    : "bg-card/50 text-off-white hover:bg-card-lighter"
                }`}
              >
                <span className="text-lg">{emoji}</span>
                <span className="flex-1 text-start">
                  {t(`dashboard.items.${id}`)}
                </span>
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
                    checked ? "border-mint bg-mint" : "border-slate-gray/30"
                  }`}
                >
                  {checked && <Check size={14} className="text-night-blue" />}
                </div>
              </button>
            );
          })}
        </div>

        {allDone && (
          <div className="mt-4 rounded-xl bg-mint/10 p-3 text-center text-sm font-semibold text-mint animate-fade-in">
            {t("dashboard.allComplete")}
          </div>
        )}
      </div>

      {/* Share button */}
      <button
        onClick={handleShare}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-gold-dim bg-card-lighter px-4 py-3 text-sm text-off-white transition-colors hover:bg-gold-dim"
      >
        <Share2 size={16} />
        {t("dashboard.shareProgress")}
      </button>

      {/* Weekly stats */}
      {showStats && (
        <GlassCard className="space-y-3 p-5 animate-fade-in">
          <h2 className="text-sm font-semibold text-off-white">
            {t("dashboard.weeklyStats")}
          </h2>
          {WORSHIP_ITEMS.map(({ id, emoji }) => {
            const count = weeklyStats[id] ?? 0;
            const pct = Math.round((count / 7) * 100);
            return (
              <div key={id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-gray">
                    {emoji} {t(`dashboard.items.${id}`)}
                  </span>
                  <span className="text-off-white">{count}/7</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-card-lighter">
                  <div
                    className="h-full rounded-full bg-gold transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </GlassCard>
      )}
    </div>
  );
}
