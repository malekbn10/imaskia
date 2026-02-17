"use client";

import { useState, useEffect, useCallback } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Coordinates, City } from "@/types";
import { getCoords, setCoords, getCityId, setCityId } from "@/lib/storage";
import { findNearestCity, getCityById, getCityCoords } from "@/lib/geo";
import { useTranslation } from "@/lib/i18n/context";
import CityCombobox from "@/components/ui/CityCombobox";
import GlassCard from "@/components/ui/GlassCard";

interface LocationGateProps {
  children: (coords: Coordinates, cityName: string) => React.ReactNode;
}

export default function LocationGate({ children }: LocationGateProps) {
  const [coords, setLocalCoords] = useState<Coordinates | null>(null);
  const [cityName, setCityName] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const { lang, t } = useTranslation();

  useEffect(() => {
    const stored = getCoords();
    const storedCityId = getCityId();
    if (stored) {
      setLocalCoords(stored);
      // Use stored city ID for direct lookup, fallback to nearest city
      const city = (storedCityId ? getCityById(storedCityId) : undefined) ?? findNearestCity(stored.lat, stored.lng);
      setCityName(lang === "ar" ? city.nameAr : city.nameFr);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [lang]);

  const requestGeolocation = useCallback(() => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCoords(newCoords);
        setLocalCoords(newCoords);
        const city = findNearestCity(newCoords.lat, newCoords.lng);
        setCityId(city.id);
        setCityName(lang === "ar" ? city.nameAr : city.nameFr);
        setLoading(false);
      },
      () => {
        setLoading(false);
        setShowPicker(true);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }, [lang]);

  const handleCitySelect = useCallback(
    (city: City) => {
      const newCoords = getCityCoords(city);
      setCoords(newCoords);
      setCityId(city.id);
      setLocalCoords(newCoords);
      setCityName(lang === "ar" ? city.nameAr : city.nameFr);
      setShowPicker(false);
    },
    [lang]
  );

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!coords) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6">
        <GlassCard className="w-full max-w-sm p-6 text-center">
          <MapPin className="mx-auto mb-4 h-12 w-12 text-gold" />
          <p className="mb-6 text-off-white">{t("home.locationRequired")}</p>

          <button
            onClick={requestGeolocation}
            className="mb-4 w-full rounded-xl bg-gold px-6 py-3 font-semibold text-night-blue transition-colors hover:bg-gold-light"
          >
            {t("home.allowLocation")}
          </button>

          <button
            onClick={() => setShowPicker(true)}
            className="w-full rounded-xl border border-gold-dim bg-transparent px-6 py-3 font-medium text-gold transition-colors hover:bg-card-lighter"
          >
            {t("home.chooseCity")}
          </button>
        </GlassCard>

        {showPicker && (
          <GlassCard className="w-full max-w-sm p-4">
            <CityCombobox onSelect={handleCitySelect} />
          </GlassCard>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* City name + change button */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-gold" />
          <span className="text-sm font-medium text-off-white">{cityName}</span>
        </div>
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="text-xs text-slate-gray transition-colors hover:text-gold"
        >
          {t("home.chooseCity")}
        </button>
      </div>

      {showPicker && (
        <div className="mb-4">
          <GlassCard className="p-3">
            <CityCombobox onSelect={handleCitySelect} />
          </GlassCard>
        </div>
      )}

      {children(coords, cityName)}
    </div>
  );
}
