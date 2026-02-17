"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Lock } from "lucide-react";
import { Dua } from "@/types";
import { useTranslation } from "@/lib/i18n/context";
import GlassCard from "@/components/ui/GlassCard";
import RepetitionCounter from "@/components/adhkar/RepetitionCounter";

interface DuaCardProps {
  dua: Dua;
  locked?: boolean;
}

export default function DuaCard({ dua, locked = false }: DuaCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { lang, t } = useTranslation();

  return (
    <GlassCard className="overflow-hidden">
      {/* Header — always visible */}
      <button
        onClick={() => !locked && setExpanded(!expanded)}
        className={`flex w-full items-center justify-between p-4 text-start transition-colors ${
          locked ? "opacity-60" : "hover:bg-card-lighter/50"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-off-white">
            {lang === "ar" ? dua.titleAr : dua.titleFr}
          </span>
          {locked && <Lock size={14} className="shrink-0 text-gold" />}
        </div>
        {!locked &&
          (expanded ? (
            <ChevronUp size={20} className="shrink-0 text-gold" />
          ) : (
            <ChevronDown size={20} className="shrink-0 text-gold" />
          ))}
      </button>

      {/* Expandable content */}
      {expanded && !locked && (
        <div className="animate-slide-up space-y-4 border-t border-gold-dim px-4 pb-4 pt-3">
          {/* Arabic text */}
          <p className="text-arabic text-xl leading-loose text-off-white">
            {dua.textAr}
          </p>

          {/* Transliteration */}
          <div>
            <p className="mb-1 text-xs font-medium text-gold">{t("adhkar.transliteration")}</p>
            <p className="text-sm italic text-slate-gray" dir="ltr">
              {dua.transliteration}
            </p>
          </div>

          {/* Translation */}
          <div>
            <p className="mb-1 text-xs font-medium text-gold">{t("adhkar.translation")}</p>
            <p className="text-sm text-slate-gray" dir="ltr">
              {dua.translationFr}
            </p>
          </div>

          {/* Repetition counter */}
          {dua.repeatCount && dua.repeatCount > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-gray">{t("adhkar.repeat")}</p>
              <RepetitionCounter total={dua.repeatCount} />
            </div>
          )}

          {/* Source */}
          <div className="rounded-lg bg-card-lighter/50 px-3 py-2">
            <p className="text-xs text-slate-gray">
              <span className="font-medium text-gold">{t("adhkar.source")} : </span>
              {dua.source}
            </p>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
