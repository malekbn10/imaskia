"use client";

import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth-utils";
import { subscribeToPush, isPushSubscribed } from "@/lib/push";

export default function NotificationPrompt() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (typeof Notification === "undefined") return;
    if (Notification.permission === "granted") return;
    if (Notification.permission === "denied") return;

    // Check if already subscribed
    isPushSubscribed().then((subscribed) => {
      if (!subscribed) {
        // Show prompt after 10 seconds
        const timer = setTimeout(() => setShow(true), 10000);
        return () => clearTimeout(timer);
      }
    });
  }, [isAuthenticated]);

  const handleAccept = async () => {
    setShow(false);
    await subscribeToPush();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-x-4 bottom-20 z-50 mx-auto max-w-lg animate-slide-up">
      <div className="glass-card flex items-start gap-3 p-4">
        <Bell size={24} className="mt-0.5 shrink-0 text-gold" />
        <div className="flex-1">
          <p className="text-sm font-medium text-off-white">{t("notifications.enable")}</p>
          <p className="mt-1 text-xs text-slate-gray">{t("notifications.enableDesc")}</p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleAccept}
              className="rounded-lg bg-gold px-4 py-1.5 text-xs font-semibold text-night-blue"
            >
              {t("notifications.enable")}
            </button>
            <button
              onClick={() => setShow(false)}
              className="rounded-lg bg-card-lighter px-4 py-1.5 text-xs text-slate-gray"
            >
              {t("common.close")}
            </button>
          </div>
        </div>
        <button onClick={() => setShow(false)} className="shrink-0 text-slate-gray">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
