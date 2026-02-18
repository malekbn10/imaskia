import { Coordinates } from "@/types";

const KEYS = {
  COORDS: "imsakia_coords",
  LANG: "imsakia_lang",
  CITY_ID: "imsakia_city_id",
  INSTALL_COUNT: "imsakia_install_count",
  THEME: "imsakia_theme",
  SADAQA: "imsakia_sadaqa",
  DASHBOARD: "imsakia_dashboard",
} as const;

function getItem<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage full or unavailable
  }
}

export function getCoords(): Coordinates | null {
  return getItem<Coordinates>(KEYS.COORDS);
}

export function setCoords(coords: Coordinates): void {
  setItem(KEYS.COORDS, coords);
}

export function getLang(): "ar" | "fr" {
  return getItem<"ar" | "fr">(KEYS.LANG) ?? "ar";
}

export function setLang(lang: "ar" | "fr"): void {
  setItem(KEYS.LANG, lang);
}

export function getCityId(): string | null {
  return getItem<string>(KEYS.CITY_ID);
}

export function setCityId(cityId: string): void {
  setItem(KEYS.CITY_ID, cityId);
}

export function getInstallCount(): number {
  return getItem<number>(KEYS.INSTALL_COUNT) ?? 0;
}

export function incrementInstallCount(): number {
  const count = getInstallCount() + 1;
  setItem(KEYS.INSTALL_COUNT, count);
  return count;
}

export function getTheme(): string | null {
  return getItem<string>(KEYS.THEME);
}

export function setTheme(themeId: string): void {
  setItem(KEYS.THEME, themeId);
}

// ── Sadaqa Tracking ──────────────────────────

export interface SadaqaDonation {
  amount: number;
  note: string;
  date: string; // ISO date string
}

interface SadaqaData {
  donations: SadaqaDonation[];
  total: number;
}

export function getSadaqa(): SadaqaData {
  return getItem<SadaqaData>(KEYS.SADAQA) ?? { donations: [], total: 0 };
}

export function addSadaqa(amount: number, note: string): SadaqaData {
  const data = getSadaqa();
  data.donations.unshift({ amount, note, date: new Date().toISOString() });
  data.total += amount;
  setItem(KEYS.SADAQA, data);
  return data;
}

export function clearSadaqa(): void {
  setItem(KEYS.SADAQA, { donations: [], total: 0 });
}

// ── Dashboard / Worship Tracker ──────────────

export interface DashboardData {
  days: Record<string, Record<string, boolean>>;
}

export function getDashboard(): DashboardData {
  return getItem<DashboardData>(KEYS.DASHBOARD) ?? { days: {} };
}

/** Toggle a worship item for a given date (YYYY-MM-DD) */
export function toggleWorshipItem(date: string, itemId: string): boolean {
  const data = getDashboard();
  if (!data.days[date]) data.days[date] = {};
  const newValue = !data.days[date][itemId];
  data.days[date][itemId] = newValue;
  setItem(KEYS.DASHBOARD, data);
  return newValue;
}

/** Get day data for a specific date */
export function getDayItems(date: string): Record<string, boolean> {
  const data = getDashboard();
  return data.days[date] ?? {};
}

/** Calculate streak: consecutive days where ALL items are checked */
export function getStreak(itemIds: string[]): number {
  const data = getDashboard();
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const dayData = data.days[key];

    if (!dayData) break;

    const allDone = itemIds.every((id) => dayData[id] === true);
    if (!allDone) break;
    streak++;
  }

  return streak;
}

/** Get weekly stats: count of each item checked in last 7 days */
export function getWeeklyStats(itemIds: string[]): Record<string, number> {
  const data = getDashboard();
  const stats: Record<string, number> = {};
  itemIds.forEach((id) => (stats[id] = 0));

  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const dayData = data.days[key];
    if (!dayData) continue;
    itemIds.forEach((id) => {
      if (dayData[id]) stats[id]++;
    });
  }

  return stats;
}
