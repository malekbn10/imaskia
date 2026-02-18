import { PrayerTimings, PrayerKey, ActivePrayer, FastingInfo } from "@/types";
import { MAIN_PRAYERS } from "@/lib/i18n/prayer-names";

/**
 * Official Ramadan 2026 start date for Tunisia (19 February 2026).
 * The AlAdhan API (astronomical) says 18 Feb, but the Tunisian Ministry
 * of Religious Affairs declares 19 Feb — we use the official date.
 */
export const RAMADAN_START = new Date(2026, 1, 19); // months are 0-indexed
export const RAMADAN_DAYS = 30;

/**
 * Parse AlAdhan time string "HH:MM (TZ)" → { hours, minutes } in 24h
 */
export function parseTime(timeStr: string): { hours: number; minutes: number } {
  const clean = timeStr.replace(/\s*\(.*\)/, "").trim();
  const [h, m] = clean.split(":").map(Number);
  return { hours: h, minutes: m };
}

/**
 * Convert time string to total minutes from midnight
 */
export function timeToMinutes(timeStr: string): number {
  const { hours, minutes } = parseTime(timeStr);
  return hours * 60 + minutes;
}

/**
 * Convert time string to a Date object for today
 */
export function timeToDate(timeStr: string, baseDate?: Date): Date {
  const { hours, minutes } = parseTime(timeStr);
  const d = baseDate ? new Date(baseDate) : new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
}

/**
 * Get the active prayer (current time period) and next prayer
 */
export function getActivePrayer(timings: PrayerTimings): ActivePrayer {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const prayerTimes = MAIN_PRAYERS.map((key) => ({
    key,
    minutes: timeToMinutes(timings[key]),
  }));

  // Find the last prayer that has passed
  let currentIdx = -1;
  for (let i = prayerTimes.length - 1; i >= 0; i--) {
    if (nowMinutes >= prayerTimes[i].minutes) {
      currentIdx = i;
      break;
    }
  }

  if (currentIdx === -1) {
    // Before Imsak — current is Isha (from yesterday), next is Imsak
    return {
      current: "Isha",
      next: MAIN_PRAYERS[0],
      nextTime: timings[MAIN_PRAYERS[0]],
    };
  }

  const nextIdx = (currentIdx + 1) % MAIN_PRAYERS.length;
  return {
    current: MAIN_PRAYERS[currentIdx],
    next: MAIN_PRAYERS[nextIdx],
    nextTime: timings[MAIN_PRAYERS[nextIdx]],
  };
}

/**
 * Get next prayer info for countdown
 */
export function getNextPrayer(timings: PrayerTimings): { key: PrayerKey; time: string } {
  const active = getActivePrayer(timings);
  return { key: active.next, time: active.nextTime };
}

/**
 * Get seconds until a specific time today
 */
export function getSecondsUntil(timeStr: string): number {
  const target = timeToDate(timeStr);
  const now = new Date();
  let diff = Math.floor((target.getTime() - now.getTime()) / 1000);
  if (diff < 0) {
    // Time has passed today, so it's tomorrow
    diff += 24 * 60 * 60;
  }
  return diff;
}

/**
 * Format seconds into HH:MM:SS
 */
export function formatCountdown(totalSeconds: number): { hours: string; minutes: string; seconds: string } {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return {
    hours: String(h).padStart(2, "0"),
    minutes: String(m).padStart(2, "0"),
    seconds: String(s).padStart(2, "0"),
  };
}

/**
 * Format duration in minutes to "Xh YYmin"
 */
export function formatDuration(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${String(m).padStart(2, "0")}min`;
}

/**
 * Get fasting duration from Imsak to Maghrib
 */
export function getFastingDuration(imsak: string, maghrib: string): { duration: string; durationMinutes: number } {
  const imsakMin = timeToMinutes(imsak);
  const maghribMin = timeToMinutes(maghrib);
  const durationMinutes = maghribMin - imsakMin;
  return {
    duration: formatDuration(durationMinutes),
    durationMinutes,
  };
}

/**
 * Get the Ramadan day number (1-30) based on the official start date.
 * Returns 0 if Ramadan hasn't started yet, capped at RAMADAN_DAYS.
 * The hijriDay parameter is kept for backward compatibility but ignored.
 */
export function getRamadanDay(_hijriDay?: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(RAMADAN_START);
  start.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - start.getTime()) / 86400000);
  if (diff < 0) return 0;
  return Math.min(diff + 1, RAMADAN_DAYS);
}

/**
 * Check if we're in the "imsak alert" period (< 30 min before Imsak)
 */
export function isImsakAlert(imsak: string): boolean {
  const seconds = getSecondsUntil(imsak);
  return seconds > 0 && seconds <= 30 * 60;
}

/**
 * Determine if the countdown should show Imsak or Iftar (Maghrib)
 */
export function getCountdownTarget(timings: PrayerTimings): { key: "Imsak" | "Maghrib"; time: string; label: "imsak" | "iftar" } {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const imsakMinutes = timeToMinutes(timings.Imsak);
  const maghribMinutes = timeToMinutes(timings.Maghrib);

  if (nowMinutes < imsakMinutes) {
    return { key: "Imsak", time: timings.Imsak, label: "imsak" };
  } else if (nowMinutes < maghribMinutes) {
    return { key: "Maghrib", time: timings.Maghrib, label: "iftar" };
  } else {
    // After Maghrib — show tomorrow's Imsak (add 24h worth)
    return { key: "Imsak", time: timings.Imsak, label: "imsak" };
  }
}
