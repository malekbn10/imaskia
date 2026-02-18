"use client";

import { useRef, useState, useCallback } from "react";
import { Share2 } from "lucide-react";
import { PrayerTimings } from "@/types";
import { useTranslation } from "@/lib/i18n/context";
import ShareCard from "./ShareCard";

interface ShareButtonProps {
  timings: PrayerTimings;
  ramadanDay: number;
  cityName?: string;
}

export default function ShareButton({ timings, ramadanDay, cityName }: ShareButtonProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleShare = useCallback(async () => {
    if (!cardRef.current || loading) return;
    setLoading(true);

    try {
      // Temporarily make visible for html2canvas capture
      const el = cardRef.current;
      el.style.opacity = "1";

      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: "#0A0E1A",
        logging: false,
        useCORS: true,
        width: 600,
        height: 900,
      });

      // Hide again
      el.style.opacity = "0";

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );

      if (!blob) throw new Error("Failed to create image");

      // Try Web Share API first (mobile)
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], "imsakia-prayer-times.png", { type: "image/png" });
        const shareData = { files: [file], title: t("share.title") };

        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          setLoading(false);
          return;
        }
      }

      // Fallback: download the image
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "imsakia-prayer-times.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // User cancelled share or other error — silently ignore
    } finally {
      setLoading(false);
    }
  }, [loading, t]);

  return (
    <>
      <button
        onClick={handleShare}
        disabled={loading}
        className="flex items-center gap-1.5 rounded-lg bg-card-lighter px-3 py-1.5 text-xs text-slate-gray transition-colors hover:bg-gold-dim hover:text-gold disabled:opacity-50"
      >
        <Share2 size={14} />
        {t("share.button")}
      </button>

      {/* Off-screen render target for html2canvas */}
      <ShareCard
        ref={cardRef}
        timings={timings}
        ramadanDay={ramadanDay}
        cityName={cityName}
      />
    </>
  );
}
