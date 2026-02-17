"use client";

import { WifiOff, RefreshCw } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import GlassCard from "@/components/ui/GlassCard";

export default function OfflinePage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[60vh] items-center justify-center animate-fade-in">
      <GlassCard className="max-w-sm p-8 text-center">
        <WifiOff className="mx-auto mb-4 h-16 w-16 text-slate-gray" />
        <h1 className="mb-2 text-xl font-bold text-off-white">
          {t("offline.title")}
        </h1>
        <p className="mb-6 text-sm text-slate-gray">
          {t("offline.message")}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 font-semibold text-night-blue transition-colors hover:bg-gold-light"
        >
          <RefreshCw size={18} />
          {t("offline.retry")}
        </button>
      </GlassCard>
    </div>
  );
}
