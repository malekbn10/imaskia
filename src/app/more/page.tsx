"use client";

import Link from "next/link";
import {
  BookOpen,
  Calculator,
  Image,
  Crown,
  Settings,
  Info,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import GlassCard from "@/components/ui/GlassCard";

const menuItems = [
  { href: "/adhkar", icon: BookOpen, labelKey: "nav.adhkar", color: "text-mint" },
  { href: "/zakat", icon: Calculator, labelKey: "zakat.title", color: "text-gold" },
  { href: "/cards", icon: Image, labelKey: "cards.title", color: "text-purple-400" },
  { href: "/premium", icon: Crown, labelKey: "premium.title", color: "text-warning" },
  { href: "/settings", icon: Settings, labelKey: "settings.title", color: "text-slate-gray" },
  { href: "/about", icon: Info, labelKey: "about.title", color: "text-slate-gray" },
];

export default function MorePage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-xl font-bold text-gold">{t("nav.more")}</h1>

      <div className="space-y-2">
        {menuItems.map(({ href, icon: Icon, labelKey, color }) => (
          <Link key={href} href={href}>
            <GlassCard hover className="flex items-center gap-4 p-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-card-lighter ${color}`}>
                <Icon size={20} />
              </div>
              <span className="font-medium text-off-white">{t(labelKey)}</span>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
