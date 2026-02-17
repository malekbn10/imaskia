import { PrayerKey } from "@/types";

export const prayerNamesAr: Record<string, string> = {
  Imsak: "الإمساك",
  Fajr: "الفجر",
  Sunrise: "الشروق",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
  Midnight: "منتصف الليل",
};

export const prayerIcons: Record<string, string> = {
  Imsak: "🌙",
  Fajr: "🌅",
  Sunrise: "☀️",
  Dhuhr: "🌤️",
  Asr: "⛅",
  Maghrib: "🌇",
  Isha: "🌃",
};

export const MAIN_PRAYERS: PrayerKey[] = [
  "Imsak",
  "Fajr",
  "Sunrise",
  "Dhuhr",
  "Asr",
  "Maghrib",
  "Isha",
];
