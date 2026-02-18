"use client";

import { useState, useRef } from "react";
import { Download, Share2, Image } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { RAMADAN_START, RAMADAN_DAYS } from "@/lib/prayer-utils";
import { dailyDuas } from "@/data/daily-duas";
import GlassCard from "@/components/ui/GlassCard";

// ── Templates ────────────────────────────────

interface Template {
  id: string;
  labelKey: string;
  bg: string;
  textColor: string;
  accentColor: string;
  decorClass: string;
}

const TEMPLATES: Template[] = [
  {
    id: "lantern",
    labelKey: "cards.templates.lantern",
    bg: "bg-gradient-to-b from-amber-900/90 via-amber-800/80 to-yellow-900/90",
    textColor: "text-amber-100",
    accentColor: "text-yellow-300",
    decorClass: "before:content-['🏮'] before:absolute before:top-4 before:right-4 before:text-4xl after:content-['🏮'] after:absolute after:top-4 after:left-4 after:text-4xl",
  },
  {
    id: "mosque",
    labelKey: "cards.templates.mosque",
    bg: "bg-gradient-to-b from-teal-900/90 via-emerald-900/80 to-teal-950/90",
    textColor: "text-emerald-100",
    accentColor: "text-emerald-300",
    decorClass: "before:content-['🕌'] before:absolute before:top-4 before:left-1/2 before:-translate-x-1/2 before:text-5xl",
  },
  {
    id: "calligraphy",
    labelKey: "cards.templates.calligraphy",
    bg: "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900",
    textColor: "text-slate-100",
    accentColor: "text-gold",
    decorClass: "",
  },
  {
    id: "stars",
    labelKey: "cards.templates.stars",
    bg: "bg-gradient-to-b from-indigo-950 via-purple-950 to-indigo-950",
    textColor: "text-purple-100",
    accentColor: "text-purple-300",
    decorClass: "before:content-['✨'] before:absolute before:top-3 before:right-6 before:text-2xl after:content-['🌙'] after:absolute after:top-6 after:left-8 after:text-3xl",
  },
];

type Tab = "daily" | "iftar" | "generator";

// ── Utility ──────────────────────────────────

function getRamadanDay(): number {
  const today = new Date();
  const diff = Math.floor((today.getTime() - RAMADAN_START.getTime()) / 86400000);
  return Math.max(1, Math.min(RAMADAN_DAYS, diff + 1));
}

export default function CardsPage() {
  const { t, lang } = useTranslation();
  const [tab, setTab] = useState<Tab>("daily");
  const [template, setTemplate] = useState<Template>(TEMPLATES[0]);
  const [customText, setCustomText] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  const ramadanDay = getRamadanDay();
  const todayDua = dailyDuas[(ramadanDay - 1) % 30];

  const captureCard = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
      backgroundColor: "#0A0E1A",
      logging: false,
      useCORS: true,
    });
    return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  };

  const handleDownload = async () => {
    try {
      const blob = await captureCard();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `imsakia-card-${Date.now()}.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      // Silently fail
    }
  };

  const handleWhatsApp = async () => {
    try {
      const blob = await captureCard();
      if (!blob) return;

      // Try sharing file via Web Share API
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], "imsakia-card.png", { type: "image/png" });
        const shareData = { files: [file], title: t("cards.title") };
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      }

      // Fallback: download then open WhatsApp
      await handleDownload();
      const text = encodeURIComponent(`${t("app.name")} — ${t("cards.title")}`);
      window.open(`https://wa.me/?text=${text}`, "_blank");
    } catch {
      // User cancelled or error
    }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "daily", label: t("cards.dailyCard") },
    { key: "iftar", label: t("cards.iftarCard") },
    { key: "generator", label: t("cards.generator") },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold text-gold">{t("cards.title")}</h1>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
              tab === key ? "bg-gold text-night-blue" : "bg-card-lighter text-slate-gray hover:text-off-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Card preview */}
      <div
        ref={cardRef}
        className={`relative overflow-hidden rounded-2xl p-8 ${template.bg} ${template.decorClass} min-h-[400px] flex flex-col items-center justify-center text-center`}
      >
        {/* Logo */}
        <p className={`mb-6 text-sm font-semibold opacity-60 ${template.textColor}`}>
          إمساكية 🌙
        </p>

        {tab === "daily" && (
          <>
            <p className={`mb-2 text-xs opacity-70 ${template.textColor}`}>
              {t("cards.todaysDua")} — {t("home.day")} {ramadanDay}
            </p>
            <p className={`font-[var(--font-amiri)] text-xl leading-relaxed ${template.accentColor}`}>
              {todayDua.ar}
            </p>
            <p className={`mt-4 text-sm opacity-80 ${template.textColor}`}>
              {todayDua.fr}
            </p>
          </>
        )}

        {tab === "iftar" && (
          <>
            <p className={`mb-2 text-sm opacity-70 ${template.textColor}`}>
              {t("cards.iftarIn")}
            </p>
            <p className={`text-4xl font-bold ${template.accentColor}`}>
              18:42
            </p>
            <p className={`mt-2 text-sm opacity-80 ${template.textColor}`}>
              {t("home.day")} {ramadanDay} {t("home.ramadan")}
            </p>
          </>
        )}

        {tab === "generator" && (
          <p className={`font-[var(--font-amiri)] text-xl leading-relaxed ${template.accentColor}`}>
            {customText || "رمضان كريم ✨"}
          </p>
        )}

        {/* Footer */}
        <p className={`mt-8 text-[10px] opacity-40 ${template.textColor}`}>
          imsakia.tn
        </p>
      </div>

      {/* Template picker */}
      <div>
        <p className="mb-2 text-sm text-slate-gray">{t("cards.chooseTemplate")}</p>
        <div className="grid grid-cols-4 gap-2">
          {TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => setTemplate(tmpl)}
              className={`rounded-xl p-3 text-center text-[11px] transition-all ${tmpl.bg} ${
                template.id === tmpl.id ? "ring-2 ring-gold scale-105" : "opacity-70 hover:opacity-100"
              }`}
            >
              <span className={tmpl.accentColor}>{t(tmpl.labelKey)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom text input (for generator tab) */}
      {tab === "generator" && (
        <div>
          <label className="mb-2 block text-sm text-slate-gray">{t("cards.customText")}</label>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="رمضان كريم"
            rows={3}
            className="w-full rounded-xl border border-gold-dim bg-card-lighter px-4 py-3 text-sm text-off-white outline-none focus:border-gold"
            dir={lang === "ar" ? "rtl" : "ltr"}
          />
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold px-4 py-3 font-semibold text-night-blue transition-colors hover:bg-gold-light"
        >
          <Download size={16} />
          {t("cards.download")}
        </button>
        <button
          onClick={handleWhatsApp}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-mint/30 bg-mint/10 px-4 py-3 font-semibold text-mint transition-colors hover:bg-mint/20"
        >
          <Share2 size={16} />
          {t("cards.shareOnWhatsapp")}
        </button>
      </div>
    </div>
  );
}
