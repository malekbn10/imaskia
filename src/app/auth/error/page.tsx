"use client";

import { AlertTriangle } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import GlassCard from "@/components/ui/GlassCard";

export default function AuthErrorPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[60vh] items-center justify-center animate-fade-in">
      <GlassCard className="w-full max-w-sm p-8 text-center">
        <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-warning" />
        <h1 className="mb-3 text-xl font-bold text-off-white">{t("auth.errorTitle")}</h1>
        <p className="mb-6 text-sm text-slate-gray">{t("auth.errorMessage")}</p>
        <a
          href="/auth/signin"
          className="inline-block rounded-xl bg-gold px-6 py-2.5 text-sm font-semibold text-night-blue transition-colors hover:bg-gold-light"
        >
          {t("auth.backToSignIn")}
        </a>
      </GlassCard>
    </div>
  );
}
