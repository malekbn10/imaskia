"use client";

import { useState, useCallback } from "react";
import { RotateCcw } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";

interface RepetitionCounterProps {
  total: number;
}

export default function RepetitionCounter({ total }: RepetitionCounterProps) {
  const [count, setCount] = useState(0);
  const { t } = useTranslation();
  const done = count >= total;

  const handleTap = useCallback(() => {
    if (count < total) {
      setCount((c) => c + 1);
      // Haptic feedback
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  }, [count, total]);

  const handleReset = useCallback(() => {
    setCount(0);
  }, []);

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleTap}
        disabled={done}
        className={`flex h-10 min-w-[80px] items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-semibold transition-all ${
          done
            ? "bg-mint/20 text-mint"
            : "bg-gold/20 text-gold active:scale-95"
        }`}
      >
        <span className="font-mono">{count}</span>
        <span className="text-xs opacity-70">/ {total}</span>
      </button>

      {count > 0 && (
        <button
          onClick={handleReset}
          className="text-slate-gray transition-colors hover:text-off-white"
          title={t("adhkar.reset")}
        >
          <RotateCcw size={16} />
        </button>
      )}
    </div>
  );
}
