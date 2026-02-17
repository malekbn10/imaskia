import { Coordinates } from "@/types";

const KEYS = {
  COORDS: "imsakia_coords",
  LANG: "imsakia_lang",
  CITY_ID: "imsakia_city_id",
  INSTALL_COUNT: "imsakia_install_count",
  THEME: "imsakia_theme",
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
