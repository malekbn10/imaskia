"use client";

import { useEffect, useState } from "react";
import { PrayerTimings } from "@/types";
import { getActivePrayer } from "@/lib/prayer-utils";
import PrayerTimesGrid from "./PrayerTimesGrid";

interface ActivePrayerHighlightProps {
  timings: PrayerTimings;
}

export default function ActivePrayerHighlight({ timings }: ActivePrayerHighlightProps) {
  const [activePrayer, setActivePrayer] = useState(() => getActivePrayer(timings).current);

  useEffect(() => {
    const update = () => {
      setActivePrayer(getActivePrayer(timings).current);
    };

    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, [timings]);

  return <PrayerTimesGrid timings={timings} activePrayer={activePrayer} />;
}
