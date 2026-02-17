"use client";

import { useEffect, useRef, useCallback } from "react";
import { PrayerTimings } from "@/types";
import { getCountdownTarget, getSecondsUntil, formatCountdown } from "@/lib/prayer-utils";
import { useTranslation } from "@/lib/i18n/context";

interface CountdownCircleProps {
  timings: PrayerTimings;
}

const CIRCLE_RADIUS = 110;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

export default function CountdownCircle({ timings }: CountdownCircleProps) {
  const hoursRef = useRef<HTMLSpanElement>(null);
  const minutesRef = useRef<HTMLSpanElement>(null);
  const secondsRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const rafRef = useRef<number>(0);
  const { t } = useTranslation();

  const update = useCallback(() => {
    const target = getCountdownTarget(timings);
    const totalSeconds = getSecondsUntil(target.time);
    const { hours, minutes, seconds } = formatCountdown(Math.max(0, totalSeconds));

    // Direct DOM updates — zero React re-renders
    if (hoursRef.current) hoursRef.current.textContent = hours;
    if (minutesRef.current) minutesRef.current.textContent = minutes;
    if (secondsRef.current) secondsRef.current.textContent = seconds;

    if (labelRef.current) {
      labelRef.current.textContent =
        target.label === "imsak"
          ? t("home.timeUntilImsak")
          : t("home.timeUntilIftar");
    }

    // Update SVG circle progress
    if (circleRef.current) {
      // Max countdown is roughly 18 hours (64800 seconds)
      const maxSeconds = 18 * 60 * 60;
      const progress = Math.max(0, Math.min(1, totalSeconds / maxSeconds));
      const offset = CIRCUMFERENCE * (1 - progress);
      circleRef.current.style.strokeDashoffset = String(offset);
    }

    rafRef.current = requestAnimationFrame(update);
  }, [timings, t]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, [update]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Label */}
      <span
        ref={labelRef}
        className="text-sm font-medium text-slate-gray"
      />

      {/* SVG Circle */}
      <div className="relative flex items-center justify-center">
        <svg
          width="260"
          height="260"
          viewBox="0 0 260 260"
          className="animate-glow"
        >
          {/* Background circle */}
          <circle
            cx="130"
            cy="130"
            r={CIRCLE_RADIUS}
            fill="none"
            stroke="rgba(212, 168, 67, 0.1)"
            strokeWidth="6"
          />
          {/* Progress circle */}
          <circle
            ref={circleRef}
            cx="130"
            cy="130"
            r={CIRCLE_RADIUS}
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={0}
            transform="rotate(-90 130 130)"
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4A843" />
              <stop offset="100%" stopColor="#E8C874" />
            </linearGradient>
          </defs>
        </svg>

        {/* Time display inside circle */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex items-baseline gap-1 font-mono text-4xl font-bold text-off-white" dir="ltr">
            <span ref={hoursRef}>00</span>
            <span className="text-gold">:</span>
            <span ref={minutesRef}>00</span>
            <span className="text-gold">:</span>
            <span ref={secondsRef} className="text-2xl text-slate-gray">00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
