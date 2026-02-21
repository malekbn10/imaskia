"use client";

import { useState, useEffect } from "react";
import { Check, X, Crown, Star, Zap } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth-utils";
import GlassCard from "@/components/ui/GlassCard";

type Plan = "free" | "premium" | "vip";

const PLAN_ORDER: Record<Plan, number> = { free: 0, premium: 1, vip: 2 };

interface PlanFeature {
  labelKey: string;
  free: boolean;
  premium: boolean;
  vip: boolean;
}

const features: PlanFeature[] = [
  { labelKey: "premium.features.prayerTimes", free: true, premium: true, vip: true },
  { labelKey: "premium.features.countdown", free: true, premium: true, vip: true },
  { labelKey: "premium.features.calendar", free: true, premium: true, vip: true },
  { labelKey: "premium.features.qibla", free: true, premium: true, vip: true },
  { labelKey: "premium.features.basicAdhkar", free: true, premium: true, vip: true },
  { labelKey: "premium.features.allAdhkar", free: false, premium: true, vip: true },
  { labelKey: "premium.features.notifications", free: false, premium: true, vip: true },
  { labelKey: "premium.features.noAds", free: false, premium: true, vip: true },
  { labelKey: "premium.features.widgets", free: false, premium: false, vip: true },
  { labelKey: "premium.features.customThemes", free: false, premium: false, vip: true },
];

function FeatureIcon({ available }: { available: boolean }) {
  return available ? (
    <Check size={16} className="text-mint" />
  ) : (
    <X size={16} className="text-slate-gray/40" />
  );
}

export default function PremiumPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<Plan>("free");

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/subscription/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.plan && data.active) {
          setCurrentPlan(data.plan as Plan);
        }
      })
      .catch(() => {});
  }, [isAuthenticated]);

  const canUpgrade = (targetPlan: Plan) =>
    PLAN_ORDER[targetPlan] > PLAN_ORDER[currentPlan];

  const isCurrentPlan = (plan: Plan) => currentPlan === plan;

  const handleSubscribe = async (plan: "premium" | "vip") => {
    if (!isAuthenticated) {
      window.location.href = "/auth/signin";
      return;
    }

    if (!canUpgrade(plan)) return;

    setLoading(plan);
    setError(null);
    try {
      const res = await fetch("/api/subscription/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        // Save orderId for verification after ClicToPay redirect
        sessionStorage.setItem("clictopay_orderId", data.orderId);
        sessionStorage.setItem("clictopay_plan", plan);
        window.location.href = data.url;
      } else {
        setError(data.error || t("errors.generic"));
      }
    } catch {
      setError(t("errors.generic"));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold text-gold">{t("premium.title")}</h1>

      {/* Plans grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* Free */}
        <GlassCard className={`p-4 text-center ${isCurrentPlan("free") ? "border-mint/50 ring-1 ring-mint/30" : ""}`}>
          <Zap className="mx-auto mb-2 h-6 w-6 text-slate-gray" />
          <h3 className="text-sm font-bold text-off-white">{t("premium.free")}</h3>
          <p className="mt-1 text-xs text-slate-gray">0 TND</p>
          {isCurrentPlan("free") && (
            <span className="mt-2 inline-block rounded-full bg-mint/20 px-2 py-0.5 text-[10px] font-semibold text-mint">
              {t("premium.activePlan")}
            </span>
          )}
        </GlassCard>

        {/* Premium */}
        <GlassCard className={`relative p-4 text-center ${isCurrentPlan("premium") ? "border-gold/50 ring-1 ring-gold/30" : "border-gold/30"}`}>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-night-blue">
            ⭐
          </div>
          <Star className="mx-auto mb-2 h-6 w-6 text-gold" />
          <h3 className="text-sm font-bold text-gold">{t("premium.premiumPlan")}</h3>
          <p className="mt-1 text-xs text-slate-gray">4.9 TND/mois</p>
          {isCurrentPlan("premium") && (
            <span className="mt-2 inline-block rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-semibold text-gold">
              {t("premium.activePlan")}
            </span>
          )}
        </GlassCard>

        {/* VIP */}
        <GlassCard className={`p-4 text-center ${isCurrentPlan("vip") ? "border-warning/50 ring-1 ring-warning/30" : ""}`}>
          <Crown className="mx-auto mb-2 h-6 w-6 text-warning" />
          <h3 className="text-sm font-bold text-off-white">{t("premium.vip")}</h3>
          <p className="mt-1 text-xs text-slate-gray">9.9 TND/mois</p>
          {isCurrentPlan("vip") && (
            <span className="mt-2 inline-block rounded-full bg-warning/20 px-2 py-0.5 text-[10px] font-semibold text-warning">
              {t("premium.activePlan")}
            </span>
          )}
        </GlassCard>
      </div>

      {/* Features table */}
      <GlassCard className="overflow-hidden">
        <div className="divide-y divide-gold-dim/50">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center px-4 py-3 text-sm">
              <span className="flex-1 text-off-white">{t(feature.labelKey)}</span>
              <div className="flex w-24 justify-around">
                <FeatureIcon available={feature.free} />
                <FeatureIcon available={feature.premium} />
                <FeatureIcon available={feature.vip} />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-danger/10 border border-danger/30 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {/* CTAs */}
      <div className="space-y-3">
        {canUpgrade("premium") ? (
          <button
            onClick={() => handleSubscribe("premium")}
            disabled={loading !== null}
            className="w-full rounded-xl bg-gold px-6 py-3 text-center font-semibold text-night-blue transition-colors hover:bg-gold-light disabled:opacity-50"
          >
            {loading === "premium" ? t("common.loading") : `${t("premium.premiumPlan")} — 4.9 TND`}
          </button>
        ) : (
          <button
            disabled
            className="w-full rounded-xl bg-gold/20 px-6 py-3 text-center font-semibold text-gold/50 cursor-not-allowed"
          >
            {isCurrentPlan("premium") ? t("premium.currentPlan") : `${t("premium.premiumPlan")} — 4.9 TND`}
          </button>
        )}

        {canUpgrade("vip") ? (
          <button
            onClick={() => handleSubscribe("vip")}
            disabled={loading !== null}
            className="w-full rounded-xl border border-warning/30 bg-warning/10 px-6 py-3 text-center font-semibold text-warning transition-colors hover:bg-warning/20 disabled:opacity-50"
          >
            {loading === "vip" ? t("common.loading") : `${t("premium.vip")} — 9.9 TND`}
          </button>
        ) : (
          <button
            disabled
            className="w-full rounded-xl border border-warning/10 bg-warning/5 px-6 py-3 text-center font-semibold text-warning/50 cursor-not-allowed"
          >
            {isCurrentPlan("vip") ? t("premium.currentPlan") : `${t("premium.vip")} — 9.9 TND`}
          </button>
        )}
      </div>
    </div>
  );
}
