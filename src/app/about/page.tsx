"use client";

import { Heart, Calculator, Database } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import GlassCard from "@/components/ui/GlassCard";

export default function AboutPage() {
  const { t } = useTranslation();

  const sections = [
    {
      icon: Heart,
      titleKey: "about.mission",
      textKey: "about.missionText",
      color: "text-danger",
    },
    {
      icon: Calculator,
      titleKey: "about.calculationMethod",
      textKey: "about.calculationText",
      color: "text-gold",
    },
    {
      icon: Database,
      titleKey: "about.credits",
      textKey: "about.creditsText",
      color: "text-mint",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold text-gold">{t("about.title")}</h1>

      <div className="space-y-4">
        {sections.map(({ icon: Icon, titleKey, textKey, color }) => (
          <GlassCard key={titleKey} className="p-5">
            <div className="mb-3 flex items-center gap-3">
              <Icon size={20} className={color} />
              <h2 className="font-semibold text-off-white">{t(titleKey)}</h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-gray">{t(textKey)}</p>
          </GlassCard>
        ))}
      </div>

      {/* Version info */}
      <div className="text-center text-xs text-slate-gray/60">
        <p>Imsakia.tn v1.0.0</p>
        <p className="mt-1">Made with ❤️ in Tunisia</p>
      </div>
    </div>
  );
}
