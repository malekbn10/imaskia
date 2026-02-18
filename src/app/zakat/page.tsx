"use client";

import Link from "next/link";
import { Calculator, HandCoins, Heart } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import GlassCard from "@/components/ui/GlassCard";

const sections = [
  { href: "/zakat/fitr", icon: HandCoins, labelKey: "zakat.fitr", color: "text-mint" },
  { href: "/zakat/mal", icon: Calculator, labelKey: "zakat.mal", color: "text-gold" },
  { href: "/zakat/sadaqa", icon: Heart, labelKey: "zakat.sadaqa", color: "text-warning" },
];

export default function ZakatPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold text-gold">{t("zakat.title")}</h1>

      <div className="space-y-3">
        {sections.map(({ href, icon: Icon, labelKey, color }) => (
          <Link key={href} href={href}>
            <GlassCard hover className="flex items-center gap-4 p-5">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-card-lighter ${color}`}>
                <Icon size={24} />
              </div>
              <div>
                <h2 className="font-semibold text-off-white">{t(labelKey)}</h2>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
