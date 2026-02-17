"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Compass, AlertCircle } from "lucide-react";
import { getQiblaAngle, getDistanceToMecca } from "@/lib/qibla";
import { getCoords } from "@/lib/storage";
import { useTranslation } from "@/lib/i18n/context";
import GlassCard from "@/components/ui/GlassCard";

export default function QiblaCompass() {
  const [qiblaAngle, setQiblaAngle] = useState(0);
  const [distance, setDistance] = useState(0);
  const [heading, setHeading] = useState(0);
  const [permissionState, setPermissionState] = useState<"prompt" | "granted" | "denied" | "unsupported">("prompt");
  const { t } = useTranslation();
  const headingRef = useRef(0);

  useEffect(() => {
    const coords = getCoords();
    if (coords) {
      setQiblaAngle(getQiblaAngle(coords.lat, coords.lng));
      setDistance(getDistanceToMecca(coords.lat, coords.lng));
    }
  }, []);

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    // Use webkitCompassHeading for iOS, alpha for Android
    const compassHeading =
      (event as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading ??
      (event.alpha ? 360 - event.alpha : 0);

    headingRef.current = compassHeading;
    setHeading(compassHeading);
  }, []);

  const requestPermission = useCallback(async () => {
    // Check if DeviceOrientationEvent is supported
    if (!("DeviceOrientationEvent" in window)) {
      setPermissionState("unsupported");
      return;
    }

    // iOS 13+ requires explicit permission
    const DOE = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };

    if (typeof DOE.requestPermission === "function") {
      try {
        const permission = await DOE.requestPermission();
        if (permission === "granted") {
          setPermissionState("granted");
          window.addEventListener("deviceorientation", handleOrientation, true);
        } else {
          setPermissionState("denied");
        }
      } catch {
        setPermissionState("denied");
      }
    } else {
      // Android / non-iOS — just start listening
      setPermissionState("granted");
      window.addEventListener("deviceorientation", handleOrientation, true);
    }
  }, [handleOrientation]);

  useEffect(() => {
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, [handleOrientation]);

  const needleRotation = qiblaAngle - heading;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Compass SVG */}
      <div className="relative">
        <svg
          width="280"
          height="280"
          viewBox="0 0 280 280"
          className="animate-fade-in"
        >
          {/* Outer ring */}
          <circle
            cx="140"
            cy="140"
            r="130"
            fill="none"
            stroke="rgba(212, 168, 67, 0.2)"
            strokeWidth="2"
          />
          <circle
            cx="140"
            cy="140"
            r="120"
            fill="rgba(17, 24, 39, 0.6)"
            stroke="rgba(212, 168, 67, 0.1)"
            strokeWidth="1"
          />

          {/* Cardinal directions */}
          <text x="140" y="30" textAnchor="middle" fill="#94A3B8" fontSize="14" fontWeight="bold">N</text>
          <text x="260" y="145" textAnchor="middle" fill="#94A3B8" fontSize="14">E</text>
          <text x="140" y="265" textAnchor="middle" fill="#94A3B8" fontSize="14">S</text>
          <text x="20" y="145" textAnchor="middle" fill="#94A3B8" fontSize="14">W</text>

          {/* Tick marks */}
          {Array.from({ length: 72 }).map((_, i) => {
            const angle = (i * 5 * Math.PI) / 180;
            const r1 = i % 6 === 0 ? 112 : 117;
            const r2 = 122;
            return (
              <line
                key={i}
                x1={140 + r1 * Math.sin(angle)}
                y1={140 - r1 * Math.cos(angle)}
                x2={140 + r2 * Math.sin(angle)}
                y2={140 - r2 * Math.cos(angle)}
                stroke={i % 6 === 0 ? "#D4A843" : "rgba(148, 163, 184, 0.3)"}
                strokeWidth={i % 6 === 0 ? 2 : 1}
              />
            );
          })}

          {/* Qibla needle */}
          <g
            transform={`rotate(${needleRotation} 140 140)`}
            className="transition-transform duration-300 ease-out"
          >
            {/* Needle body */}
            <path
              d="M140 40 L148 140 L140 130 L132 140 Z"
              fill="#1B5E3B"
              stroke="#34D399"
              strokeWidth="1"
            />
            {/* Kaaba icon at tip */}
            <rect
              x="134"
              y="32"
              width="12"
              height="12"
              rx="2"
              fill="#D4A843"
              stroke="#E8C874"
              strokeWidth="1"
            />
            <text
              x="140"
              y="42"
              textAnchor="middle"
              fill="#0A0E1A"
              fontSize="8"
              fontWeight="bold"
            >
              🕋
            </text>
          </g>

          {/* Center dot */}
          <circle cx="140" cy="140" r="4" fill="#D4A843" />
        </svg>
      </div>

      {/* Info cards */}
      <div className="flex w-full gap-3">
        <GlassCard className="flex-1 p-3 text-center">
          <p className="text-xs text-slate-gray">{t("qibla.angle")}</p>
          <p className="font-mono text-lg font-bold text-gold" dir="ltr">
            {qiblaAngle.toFixed(1)}°
          </p>
        </GlassCard>
        <GlassCard className="flex-1 p-3 text-center">
          <p className="text-xs text-slate-gray">{t("qibla.distance")}</p>
          <p className="font-mono text-lg font-bold text-gold" dir="ltr">
            {distance.toLocaleString()} {t("qibla.km")}
          </p>
        </GlassCard>
      </div>

      {/* Permission button */}
      {permissionState === "prompt" && (
        <button
          onClick={requestPermission}
          className="flex items-center gap-2 rounded-xl bg-islamic-green px-6 py-3 font-semibold text-off-white transition-colors hover:bg-islamic-green-light"
        >
          <Compass size={20} />
          {t("qibla.enableCompass")}
        </button>
      )}

      {permissionState === "denied" && (
        <div className="flex items-center gap-2 text-sm text-danger">
          <AlertCircle size={16} />
          {t("qibla.permissionNeeded")}
        </div>
      )}

      {permissionState === "unsupported" && (
        <div className="flex items-center gap-2 text-sm text-slate-gray">
          <AlertCircle size={16} />
          {t("qibla.notSupported")}
        </div>
      )}
    </div>
  );
}
