"use client";

import { Check, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "@/lib/theme-context";
import { useTranslation } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth-utils";
import GlassCard from "@/components/ui/GlassCard";

export default function ThemePicker() {
  const { themeId, setTheme, themes } = useTheme();
  const { lang, t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/subscription/status")
      .then((r) => r.json())
      .then((data) => {
        setIsPremium(data.plan === "premium" || data.plan === "vip");
      })
      .catch(() => {});
  }, [isAuthenticated]);

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-slate-gray">
        {t("settings.theme")}
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {themes.map((theme) => {
          const isActive = themeId === theme.id;
          const isLocked = theme.premium && !isPremium;

          return (
            <button
              key={theme.id}
              onClick={() => !isLocked && setTheme(theme.id)}
              className={`relative overflow-hidden rounded-xl border-2 p-3 text-start transition-all ${
                isActive
                  ? "border-gold"
                  : isLocked
                    ? "border-gold-dim/30 opacity-60"
                    : "border-gold-dim/50 hover:border-gold/50"
              }`}
            >
              {/* Color preview */}
              <div className="mb-2 flex gap-1">
                {Object.values(theme.colors).slice(0, 4).map((color, i) => (
                  <div
                    key={i}
                    className="h-6 w-6 rounded-full border border-white/10"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <p className="text-sm font-medium text-off-white">
                {lang === "ar" ? theme.nameAr : theme.nameFr}
              </p>

              {isActive && (
                <Check size={16} className="absolute top-2 end-2 text-gold" />
              )}
              {isLocked && (
                <Lock size={14} className="absolute top-2 end-2 text-gold" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
