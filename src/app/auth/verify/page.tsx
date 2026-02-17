"use client";

import { Mail } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import GlassCard from "@/components/ui/GlassCard";

export default function VerifyPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[60vh] items-center justify-center animate-fade-in">
      <GlassCard className="w-full max-w-sm p-8 text-center">
        <Mail className="mx-auto mb-4 h-12 w-12 text-gold" />
        <h1 className="mb-3 text-xl font-bold text-gold">{t("auth.verifyTitle")}</h1>
        <p className="text-sm text-slate-gray">{t("auth.verifyMessage")}</p>
      </GlassCard>
    </div>
  );
}
