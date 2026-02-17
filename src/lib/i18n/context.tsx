"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import arTranslations from "./ar.json";
import frTranslations from "./fr.json";
import { getLang, setLang as storeLang } from "@/lib/storage";

type Lang = "ar" | "fr";
type Translations = typeof arTranslations;

interface I18nContextType {
  lang: Lang;
  t: (key: string) => string;
  setLang: (lang: Lang) => void;
  dir: "rtl" | "ltr";
}

const translations: Record<Lang, Translations> = {
  ar: arTranslations,
  fr: frTranslations,
};

const I18nContext = createContext<I18nContextType | null>(null);

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === "string" ? current : path;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    const stored = getLang();
    if (stored) setLangState(stored);
  }, []);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    storeLang(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const t = useCallback(
    (key: string): string => {
      return getNestedValue(translations[lang] as unknown as Record<string, unknown>, key);
    },
    [lang]
  );

  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <I18nContext.Provider value={{ lang, t, setLang, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within I18nProvider");
  }
  return context;
}
