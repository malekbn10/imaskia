"use client";

import GlassCard from "@/components/ui/GlassCard";

export default function QiblaError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <GlassCard className="max-w-sm p-6 text-center">
        <p className="mb-2 text-lg font-semibold text-danger">
          حدث خطأ في القبلة
        </p>
        <p className="mb-4 text-sm text-slate-gray">
          {error.message}
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-gold px-6 py-2.5 text-sm font-semibold text-night-blue transition-colors hover:bg-gold-light"
        >
          إعادة المحاولة
        </button>
      </GlassCard>
    </div>
  );
}
