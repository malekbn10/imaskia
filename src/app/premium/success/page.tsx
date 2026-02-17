"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import GlassCard from "@/components/ui/GlassCard";

export default function PremiumSuccessPage() {
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center animate-fade-in">
      <GlassCard className="w-full max-w-sm p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-mint/20">
          <Check className="h-8 w-8 text-mint" />
        </div>
        <h1 className="mb-3 text-xl font-bold text-gold">{t("premium.success.title")}</h1>
        <p className="mb-4 text-sm text-slate-gray">{t("premium.success.message")}</p>
        <p className="text-xs text-slate-gray animate-pulse">{t("premium.success.redirecting")}</p>
      </GlassCard>
    </div>
  );
}
