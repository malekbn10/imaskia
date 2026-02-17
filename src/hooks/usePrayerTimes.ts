"use client";

import { useState, useEffect, useRef } from "react";
import { Coordinates, PrayerTimings } from "@/types";
import { getRamadanDay } from "@/lib/prayer-utils";
import { getCached, setCache } from "@/lib/cache";

interface PrayerTimesData {
  timings: PrayerTimings;
  ramadanDay: number;
}

interface UsePrayerTimesResult {
  data: PrayerTimesData | null;
  error: string | null;
  isLoading: boolean;
  isStale: boolean;
}

export function usePrayerTimes(coords: Coordinates | null): UsePrayerTimesResult {
  const [data, setData] = useState<PrayerTimesData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStale, setIsStale] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!coords) {
      setIsLoading(false);
      return;
    }

    const cacheKey = `prayer_${coords.lat}_${coords.lng}`;

    // Try cache first (stale-while-revalidate)
    const cached = getCached<PrayerTimesData>(cacheKey);
    if (cached) {
      setData(cached.data);
      setIsStale(cached.stale);
      if (!cached.stale) {
        setIsLoading(false);
        return;
      }
    }

    // Fetch fresh data
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(!cached);

    fetch(`/api/prayer-times?lat=${coords.lat}&lng=${coords.lng}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((json) => {
        const timings = json.data.timings as PrayerTimings;
        const hijriDay = json.data.date?.hijri?.day || "1";
        const ramadanDay = getRamadanDay(hijriDay);
        const freshData = { timings, ramadanDay };

        setData(freshData);
        setIsStale(false);
        setError(null);
        setCache(cacheKey, freshData);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        // If we have cached data, keep showing it
        if (!cached) {
          setError(err.message);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [coords?.lat, coords?.lng]);

  return { data, error, isLoading, isStale };
}
