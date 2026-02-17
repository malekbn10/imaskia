"use client";

import { useTranslation } from "@/lib/i18n/context";
import QiblaCompass from "@/components/qibla/QiblaCompass";

export default function QiblaPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold text-gold">{t("qibla.title")}</h1>
      <QiblaCompass />
    </div>
  );
}
