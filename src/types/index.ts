export interface City {
  id: string;
  nameAr: string;
  nameFr: string;
  lat: number;
  lng: number;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PrayerTimings {
  Imsak: string;
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Midnight: string;
}

export interface HijriDate {
  date: string;
  day: string;
  month: { number: number; en: string; ar: string };
  year: string;
  designation: { abbreviated: string; expanded: string };
}

export interface GregorianDate {
  date: string;
  day: string;
  month: { number: number; en: string };
  year: string;
}

export interface DayInfo {
  timings: PrayerTimings;
  date: {
    hijri: HijriDate;
    gregorian: GregorianDate;
  };
}

export interface AladhanDayResponse {
  code: number;
  status: string;
  data: DayInfo;
}

export interface AladhanMonthResponse {
  code: number;
  status: string;
  data: DayInfo[];
}

export type PrayerKey = keyof PrayerTimings;

export interface ActivePrayer {
  current: PrayerKey;
  next: PrayerKey;
  nextTime: string;
}

export interface FastingInfo {
  duration: string;
  durationMinutes: number;
  ramadanDay: number;
  totalDays: number;
}

export interface StoredPreferences {
  coords: Coordinates | null;
  lang: "ar" | "fr";
  cityId: string | null;
}

export type DuaCategory = "iftar" | "suhoor" | "morning" | "evening" | "postPrayer" | "sleep" | "general" | "laylatalQadr";

export interface Dua {
  id: string;
  titleAr: string;
  titleFr: string;
  textAr: string;
  transliteration: string;
  translationFr: string;
  source: string;
  category: DuaCategory;
  repeatCount?: number;
  premium?: boolean;
}
