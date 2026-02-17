"use client";

import { useState, useMemo } from "react";
import { Lock, Sparkles } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { duas } from "@/data/adhkar";
import { getContextualCategory } from "@/lib/adhkar-utils";
import { DuaCategory } from "@/types";
import DuaCard from "@/components/adhkar/DuaCard";
import CategoryTabs from "@/components/adhkar/CategoryTabs";
import GlassCard from "@/components/ui/GlassCard";

export default function AdhkarPage() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<DuaCategory | "all">("all");

  // Contextual suggestion (no timings available client-side here, use time-based heuristic)
  const contextualCategory = useMemo(() => {
    return getContextualCategory(null, new Date().getDate());
  }, []);

  const filteredDuas = useMemo(() => {
    if (selectedCategory === "all") return duas;
    return duas.filter((d) => d.category === selectedCategory);
  }, [selectedCategory]);

  const freeDuas = filteredDuas.filter((d) => !d.premium);
  const premiumDuas = filteredDuas.filter((d) => d.premium);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold text-gold">{t("adhkar.title")}</h1>

      {/* Contextual suggestion */}
      <button
        onClick={() => setSelectedCategory(contextualCategory)}
        className="flex w-full items-center gap-2 rounded-xl bg-gold/10 px-4 py-3 text-start transition-colors hover:bg-gold/20"
      >
        <Sparkles size={18} className="shrink-0 text-gold" />
        <div>
          <p className="text-xs text-slate-gray">{t("adhkar.contextual")}</p>
          <p className="text-sm font-medium text-gold">
            {t(`adhkar.categories.${contextualCategory}`)}
          </p>
        </div>
      </button>

      {/* Category tabs */}
      <CategoryTabs selected={selectedCategory} onSelect={setSelectedCategory} />

      {/* Free duas */}
      {freeDuas.length > 0 && (
        <div className="space-y-3">
          {freeDuas.map((dua) => (
            <DuaCard key={dua.id} dua={dua} />
          ))}
        </div>
      )}

      {/* Premium duas */}
      {premiumDuas.length > 0 && (
        <div className="space-y-3">
          {premiumDuas.map((dua) => (
            <DuaCard key={dua.id} dua={dua} locked />
          ))}
        </div>
      )}

      {/* No results */}
      {filteredDuas.length === 0 && (
        <p className="py-8 text-center text-sm text-slate-gray">
          {t("adhkar.noResults")}
        </p>
      )}

      {/* Premium teaser (only if there are locked duas) */}
      {premiumDuas.length > 0 && (
        <GlassCard className="p-6 text-center">
          <Lock className="mx-auto mb-3 h-8 w-8 text-gold" />
          <p className="mb-4 text-sm text-slate-gray">{t("adhkar.premium")}</p>
          <a
            href="/premium"
            className="inline-block rounded-xl bg-gold px-6 py-2.5 text-sm font-semibold text-night-blue transition-colors hover:bg-gold-light"
          >
            {t("adhkar.unlockMore")}
          </a>
        </GlassCard>
      )}
    </div>
  );
}
