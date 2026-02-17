import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  parseTime,
  timeToMinutes,
  timeToDate,
  getActivePrayer,
  getNextPrayer,
  getSecondsUntil,
  formatCountdown,
  formatDuration,
  getFastingDuration,
  getRamadanDay,
  isImsakAlert,
  getCountdownTarget,
} from "../prayer-utils";
import { PrayerTimings } from "@/types";

const mockTimings: PrayerTimings = {
  Imsak: "04:30 (CET)",
  Fajr: "04:45 (CET)",
  Sunrise: "06:30 (CET)",
  Dhuhr: "12:30 (CET)",
  Asr: "15:45 (CET)",
  Maghrib: "18:30 (CET)",
  Isha: "20:00 (CET)",
  Midnight: "00:00 (CET)",
};

describe("parseTime", () => {
  it("parses time with timezone annotation", () => {
    expect(parseTime("04:30 (CET)")).toEqual({ hours: 4, minutes: 30 });
  });

  it("parses time without timezone", () => {
    expect(parseTime("12:45")).toEqual({ hours: 12, minutes: 45 });
  });

  it("parses midnight", () => {
    expect(parseTime("00:00")).toEqual({ hours: 0, minutes: 0 });
  });
});

describe("timeToMinutes", () => {
  it("converts time to minutes from midnight", () => {
    expect(timeToMinutes("04:30 (CET)")).toBe(270);
  });

  it("converts noon", () => {
    expect(timeToMinutes("12:00")).toBe(720);
  });

  it("converts midnight", () => {
    expect(timeToMinutes("00:00")).toBe(0);
  });
});

describe("formatCountdown", () => {
  it("formats seconds into HH:MM:SS", () => {
    expect(formatCountdown(3661)).toEqual({
      hours: "01",
      minutes: "01",
      seconds: "01",
    });
  });

  it("pads single digits", () => {
    expect(formatCountdown(5)).toEqual({
      hours: "00",
      minutes: "00",
      seconds: "05",
    });
  });

  it("handles zero", () => {
    expect(formatCountdown(0)).toEqual({
      hours: "00",
      minutes: "00",
      seconds: "00",
    });
  });
});

describe("formatDuration", () => {
  it("formats 14h 30min", () => {
    expect(formatDuration(870)).toBe("14h 30min");
  });

  it("formats exact hours", () => {
    expect(formatDuration(720)).toBe("12h 00min");
  });
});

describe("getFastingDuration", () => {
  it("calculates duration between Imsak and Maghrib", () => {
    const result = getFastingDuration("04:30", "18:30");
    expect(result.durationMinutes).toBe(840); // 14 hours
    expect(result.duration).toBe("14h 00min");
  });

  it("handles typical Ramadan Tunis timing", () => {
    const result = getFastingDuration("04:15", "18:45");
    expect(result.durationMinutes).toBe(870);
  });
});

describe("getRamadanDay", () => {
  it("parses valid day", () => {
    expect(getRamadanDay("15")).toBe(15);
  });

  it("defaults to 1 for invalid input", () => {
    expect(getRamadanDay("")).toBe(1);
  });

  it("defaults to 1 for NaN", () => {
    expect(getRamadanDay("abc")).toBe(1);
  });
});

describe("getActivePrayer", () => {
  it("returns Isha before Imsak (e.g. 3 AM)", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 2, 1, 3, 0)); // 3:00 AM
    const result = getActivePrayer(mockTimings);
    expect(result.current).toBe("Isha");
    expect(result.next).toBe("Imsak");
    vi.useRealTimers();
  });

  it("returns Imsak after 4:30", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 2, 1, 4, 35));
    const result = getActivePrayer(mockTimings);
    expect(result.current).toBe("Imsak");
    expect(result.next).toBe("Fajr");
    vi.useRealTimers();
  });

  it("returns Dhuhr at midday", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 2, 1, 13, 0));
    const result = getActivePrayer(mockTimings);
    expect(result.current).toBe("Dhuhr");
    expect(result.next).toBe("Asr");
    vi.useRealTimers();
  });

  it("returns Isha after 20:00", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 2, 1, 21, 0));
    const result = getActivePrayer(mockTimings);
    expect(result.current).toBe("Isha");
    expect(result.next).toBe("Imsak");
    vi.useRealTimers();
  });
});

describe("getCountdownTarget", () => {
  it("shows Imsak before dawn", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 2, 1, 3, 0));
    const result = getCountdownTarget(mockTimings);
    expect(result.key).toBe("Imsak");
    expect(result.label).toBe("imsak");
    vi.useRealTimers();
  });

  it("shows Maghrib during the day", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 2, 1, 12, 0));
    const result = getCountdownTarget(mockTimings);
    expect(result.key).toBe("Maghrib");
    expect(result.label).toBe("iftar");
    vi.useRealTimers();
  });

  it("shows Imsak after Maghrib (evening)", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 2, 1, 19, 0));
    const result = getCountdownTarget(mockTimings);
    expect(result.key).toBe("Imsak");
    expect(result.label).toBe("imsak");
    vi.useRealTimers();
  });
});
