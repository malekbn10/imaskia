"use client";

import { useTranslation } from "@/lib/i18n/context";

export default function LanguageToggle() {
  const { lang, setLang } = useTranslation();

  return (
    <button
      onClick={() => setLang(lang === "ar" ? "fr" : "ar")}
      className="flex items-center gap-1.5 rounded-full bg-card/60 px-3 py-1.5 text-sm font-medium text-slate-gray transition-colors hover:bg-card-lighter hover:text-off-white"
      aria-label={lang === "ar" ? "Switch to French" : "التبديل إلى العربية"}
    >
      <span className={lang === "ar" ? "text-gold" : "text-slate-gray"}>عربي</span>
      <span className="text-gold-dim">|</span>
      <span className={lang === "fr" ? "text-gold" : "text-slate-gray"}>FR</span>
    </button>
  );
}
