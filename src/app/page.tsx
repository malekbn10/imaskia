"use client";

import { Loader2 } from "lucide-react";
import { Coordinates } from "@/types";
import { useTranslation } from "@/lib/i18n/context";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import LocationGate from "@/components/home/LocationGate";
import CountdownCircle from "@/components/home/CountdownCircle";
import ActivePrayerHighlight from "@/components/home/ActivePrayerHighlight";
import FastingCard from "@/components/home/FastingCard";
import GlassCard from "@/components/ui/GlassCard";
import ShareButton from "@/components/home/ShareButton";

function HomeContent({ coords }: { coords: Coordinates; cityName: string }) {
  const { data, error, isLoading, isStale } = usePrayerTimes(coords);
  const { t } = useTranslation();

  if (error && !data) {
    return (
      <GlassCard className="p-6 text-center">
        <p className="text-danger">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-card-lighter px-4 py-2 text-sm text-off-white hover:bg-gold-dim"
        >
          {t("common.retry")}
        </button>
      </GlassCard>
    );
  }

  if (isLoading && !data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stale data indicator */}
      {isStale && (
        <div className="text-center text-xs text-slate-gray">
          {t("common.loading")}
        </div>
      )}

      {/* Countdown Circle */}
      <section>
        <CountdownCircle timings={data.timings} />
      </section>

      {/* Fasting Card */}
      <section>
        <FastingCard
          timings={data.timings}
          ramadanDay={data.ramadanDay}
        />
      </section>

      {/* Prayer Times Grid */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-slate-gray">
            {t("home.prayerTimes")}
          </h2>
          <ShareButton timings={data.timings} ramadanDay={data.ramadanDay} />
        </div>
        <GlassCard className="p-3">
          <ActivePrayerHighlight timings={data.timings} />
        </GlassCard>
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <LocationGate>
      {(coords, cityName) => (
        <HomeContent coords={coords} cityName={cityName} />
      )}
    </LocationGate>
  );
}
