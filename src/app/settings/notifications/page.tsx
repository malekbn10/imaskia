"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, BellOff } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth-utils";
import { subscribeToPush, unsubscribeToPush, isPushSubscribed } from "@/lib/push";
import GlassCard from "@/components/ui/GlassCard";

const PRAYERS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
const DELAYS = [5, 10, 15, 30, 45, 60] as const;

export default function NotificationsPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    isPushSubscribed().then(setSubscribed);
  }, []);

  const handleToggle = useCallback(async () => {
    setLoading(true);
    if (subscribed) {
      const success = await unsubscribeToPush();
      if (success) setSubscribed(false);
    } else {
      const sub = await subscribeToPush();
      if (sub) setSubscribed(true);
    }
    setLoading(false);
  }, [subscribed]);

  if (!isAuthenticated) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-xl font-bold text-gold">{t("notifications.title")}</h1>
        <GlassCard className="p-6 text-center">
          <BellOff className="mx-auto mb-3 h-8 w-8 text-slate-gray" />
          <p className="mb-4 text-sm text-slate-gray">{t("auth.signIn")}</p>
          <a
            href="/auth/signin"
            className="inline-block rounded-xl bg-gold px-6 py-2.5 text-sm font-semibold text-night-blue transition-colors hover:bg-gold-light"
          >
            {t("auth.signIn")}
          </a>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold text-gold">{t("notifications.title")}</h1>

      {/* Master toggle */}
      <GlassCard className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {subscribed ? (
            <Bell size={20} className="text-gold" />
          ) : (
            <BellOff size={20} className="text-slate-gray" />
          )}
          <div>
            <p className="text-sm font-medium text-off-white">{t("notifications.enable")}</p>
            <p className="text-xs text-slate-gray">{t("notifications.enableDesc")}</p>
          </div>
        </div>
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            subscribed ? "bg-gold" : "bg-card-lighter"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
              subscribed ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </GlassCard>

      {subscribed && (
        <>
          {/* Prayer toggles */}
          <GlassCard className="divide-y divide-gold-dim/50 overflow-hidden">
            {PRAYERS.map((prayer) => (
              <div key={prayer} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-off-white">{t(`notifications.${prayer}`)}</span>
                <span className={`text-xs ${prayer === "maghrib" ? "text-gold" : "text-slate-gray"}`}>
                  {prayer === "maghrib" ? t("notifications.freeLimit").split(":")[0] : ""}
                </span>
              </div>
            ))}
          </GlassCard>

          {/* Delay selector */}
          <GlassCard className="p-4">
            <p className="mb-3 text-sm font-medium text-off-white">{t("notifications.delay")}</p>
            <div className="flex flex-wrap gap-2">
              {DELAYS.map((delay) => (
                <button
                  key={delay}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                    delay === 15
                      ? "bg-gold text-night-blue"
                      : "bg-card-lighter text-slate-gray"
                  }`}
                >
                  {delay} {t("notifications.minutes")}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Info */}
          <p className="text-center text-xs text-slate-gray">{t("notifications.freeLimit")}</p>
        </>
      )}
    </div>
  );
}
