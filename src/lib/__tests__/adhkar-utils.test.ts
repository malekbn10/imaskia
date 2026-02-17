import { describe, it, expect, vi } from "vitest";
import { getContextualCategory, ADHKAR_CATEGORIES } from "../adhkar-utils";
import { PrayerTimings } from "@/types";

const mockTimings: PrayerTimings = {
  Imsak: "04:30",
  Fajr: "04:45",
  Sunrise: "06:30",
  Dhuhr: "12:30",
  Asr: "15:45",
  Maghrib: "18:30",
  Isha: "20:00",
  Midnight: "00:00",
};

describe("getContextualCategory", () => {
  it("returns suhoor before Fajr", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 2, 1, 3, 30));
    expect(getContextualCategory(mockTimings, 15)).toBe("suhoor");
    vi.useRealTimers();
  });

  it("returns morning after Fajr", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 2, 1, 5, 0));
    expect(getContextualCategory(mockTimings, 15)).toBe("morning");
    vi.useRealTimers();
  });

  it("returns evening after Asr", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 2, 1, 16, 0));
    expect(getContextualCategory(mockTimings, 15)).toBe("evening");
    vi.useRealTimers();
  });

  it("returns iftar around Maghrib", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 2, 1, 18, 25));
    expect(getContextualCategory(mockTimings, 15)).toBe("iftar");
    vi.useRealTimers();
  });

  it("returns sleep after Isha", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 2, 1, 22, 0));
    expect(getContextualCategory(mockTimings, 15)).toBe("sleep");
    vi.useRealTimers();
  });

  it("returns laylatalQadr during last 10 nights after Isha", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 2, 1, 21, 0));
    expect(getContextualCategory(mockTimings, 27)).toBe("laylatalQadr");
    vi.useRealTimers();
  });

  it("does NOT return laylatalQadr during day even in last 10", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 2, 1, 12, 0));
    expect(getContextualCategory(mockTimings, 27)).not.toBe("laylatalQadr");
    vi.useRealTimers();
  });

  it("returns general when no timings provided", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 2, 1, 12, 0));
    expect(getContextualCategory(null, 15)).toBe("general");
    vi.useRealTimers();
  });
});

describe("ADHKAR_CATEGORIES", () => {
  it("contains all expected categories", () => {
    expect(ADHKAR_CATEGORIES).toContain("iftar");
    expect(ADHKAR_CATEGORIES).toContain("suhoor");
    expect(ADHKAR_CATEGORIES).toContain("morning");
    expect(ADHKAR_CATEGORIES).toContain("laylatalQadr");
  });

  it("has 8 categories", () => {
    expect(ADHKAR_CATEGORIES.length).toBe(8);
  });
});
