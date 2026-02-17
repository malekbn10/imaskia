import { DuaCategory, PrayerTimings } from "@/types";
import { timeToMinutes } from "@/lib/prayer-utils";

/**
 * Determine the contextual adhkar category based on current time,
 * prayer timings, and the hijri day of the month.
 *
 * Priority: laylatalQadr (nights 21-30) > time-based category > general
 */
export function getContextualCategory(
  timings: PrayerTimings | null,
  hijriDay: number
): DuaCategory {
  // Laylat al-Qadr takes priority during the last 10 nights
  if (hijriDay >= 21 && hijriDay <= 30) {
    // Only at night (after Isha)
    if (timings) {
      const now = new Date();
      const nowMin = now.getHours() * 60 + now.getMinutes();
      const ishaMin = timeToMinutes(timings.Isha);
      if (nowMin >= ishaMin || nowMin < timeToMinutes(timings.Fajr)) {
        return "laylatalQadr";
      }
    }
  }

  if (!timings) return "general";

  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();

  const fajrMin = timeToMinutes(timings.Fajr);
  const asrMin = timeToMinutes(timings.Asr);
  const maghribMin = timeToMinutes(timings.Maghrib);
  const ishaMin = timeToMinutes(timings.Isha);

  // Before Fajr → suhoor
  if (nowMin < fajrMin) {
    return "suhoor";
  }

  // After Fajr (+30min window) → morning
  if (nowMin >= fajrMin && nowMin < fajrMin + 30) {
    return "morning";
  }

  // Fajr+30 to Asr → morning (still daytime adhkar)
  if (nowMin >= fajrMin + 30 && nowMin < asrMin) {
    return "morning";
  }

  // After Asr → evening
  if (nowMin >= asrMin && nowMin < maghribMin - 30) {
    return "evening";
  }

  // Maghrib ±30min → iftar
  if (nowMin >= maghribMin - 30 && nowMin <= maghribMin + 30) {
    return "iftar";
  }

  // After Maghrib+30 to Isha → evening
  if (nowMin > maghribMin + 30 && nowMin < ishaMin) {
    return "evening";
  }

  // After Isha → sleep
  if (nowMin >= ishaMin) {
    return "sleep";
  }

  return "general";
}

/** All available categories in display order */
export const ADHKAR_CATEGORIES: DuaCategory[] = [
  "iftar",
  "suhoor",
  "morning",
  "evening",
  "postPrayer",
  "sleep",
  "general",
  "laylatalQadr",
];
