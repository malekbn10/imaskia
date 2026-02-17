"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { getInstallCount, incrementInstallCount } from "@/lib/storage";
import { useTranslation } from "@/lib/i18n/context";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const { lang } = useTranslation();

  useEffect(() => {
    const count = incrementInstallCount();
    // Only show on 2nd+ visit
    if (count < 2) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-lg animate-slide-up">
      <div className="glass-card flex items-center gap-3 p-4">
        <Download size={24} className="shrink-0 text-gold" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-off-white">
            {lang === "ar" ? "أضف إمساكية لشاشتك" : "Installer Imsakia"}
          </p>
          <p className="text-xs text-slate-gray">
            {lang === "ar"
              ? "للوصول السريع بدون متصفح"
              : "Accès rapide sans navigateur"}
          </p>
        </div>
        <button
          onClick={handleInstall}
          className="shrink-0 rounded-lg bg-gold px-3 py-1.5 text-xs font-bold text-night-blue"
        >
          {lang === "ar" ? "تثبيت" : "Installer"}
        </button>
        <button
          onClick={() => setShowBanner(false)}
          className="shrink-0 text-slate-gray hover:text-off-white"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
