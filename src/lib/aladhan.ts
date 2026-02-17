import { AladhanDayResponse, AladhanMonthResponse } from "@/types";

const BASE_URL = "https://api.aladhan.com/v1";

// Method 16 = Ministry of Religious Affairs, Tunisia
const DEFAULT_PARAMS = {
  method: "16",
  school: "0", // Shafi'i
} as const;

export async function fetchDayTimings(
  lat: number,
  lng: number,
  date?: string
): Promise<AladhanDayResponse> {
  const dateStr = date || formatDate(new Date());
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    ...DEFAULT_PARAMS,
  });

  const res = await fetch(`${BASE_URL}/timings/${dateStr}?${params}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`AlAdhan API error: ${res.status}`);
  }

  return res.json();
}

export async function fetchMonthCalendar(
  lat: number,
  lng: number,
  month: number,
  year: number
): Promise<AladhanMonthResponse> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    month: month.toString(),
    year: year.toString(),
    ...DEFAULT_PARAMS,
  });

  const res = await fetch(`${BASE_URL}/calendar?${params}`, {
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    throw new Error(`AlAdhan API error: ${res.status}`);
  }

  return res.json();
}

function formatDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}
