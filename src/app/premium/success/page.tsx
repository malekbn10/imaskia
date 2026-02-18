"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Loader2, AlertTriangle } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import GlassCard from "@/components/ui/GlassCard";

export default function PremiumSuccessPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // ClicToPay may append orderId to returnUrl, or we read from sessionStorage
    const orderId =
      searchParams.get("orderId") ??
      sessionStorage.getItem("clictopay_orderId");
    const plan =
      searchParams.get("plan") ??
      sessionStorage.getItem("clictopay_plan");

    // Clean up sessionStorage
    sessionStorage.removeItem("clictopay_orderId");
    sessionStorage.removeItem("clictopay_plan");

    if (!orderId || !plan) {
      setStatus("error");
      setErrorMsg("Missing payment information");
      return;
    }

    fetch("/api/subscription/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, plan }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.verified) {
          setStatus("success");
          setTimeout(() => router.push("/"), 3000);
        } else {
          setStatus("error");
          setErrorMsg(data.error || "Payment verification failed");
        }
      })
      .catch(() => {
        setStatus("error");
        setErrorMsg("Network error during verification");
      });
  }, [searchParams, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center animate-fade-in">
      <GlassCard className="w-full max-w-sm p-8 text-center">
        {status === "verifying" && (
          <>
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-gold" />
            <h1 className="mb-3 text-xl font-bold text-gold">
              {t("premium.success.verifying") ?? "Vérification..."}
            </h1>
            <p className="text-sm text-slate-gray">
              {t("premium.success.pleaseWait") ?? "Confirmation du paiement en cours"}
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-mint/20">
              <Check className="h-8 w-8 text-mint" />
            </div>
            <h1 className="mb-3 text-xl font-bold text-gold">{t("premium.success.title")}</h1>
            <p className="mb-4 text-sm text-slate-gray">{t("premium.success.message")}</p>
            <p className="text-xs text-slate-gray animate-pulse">{t("premium.success.redirecting")}</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger/20">
              <AlertTriangle className="h-8 w-8 text-danger" />
            </div>
            <h1 className="mb-3 text-xl font-bold text-danger">
              {t("premium.success.errorTitle") ?? "Erreur de paiement"}
            </h1>
            <p className="mb-4 text-sm text-slate-gray">{errorMsg}</p>
            <button
              onClick={() => router.push("/premium")}
              className="rounded-xl bg-gold px-6 py-2 text-sm font-semibold text-night-blue"
            >
              {t("premium.success.retry") ?? "Réessayer"}
            </button>
          </>
        )}
      </GlassCard>
    </div>
  );
}
