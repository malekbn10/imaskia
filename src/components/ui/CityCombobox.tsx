"use client";

import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { City } from "@/types";
import { searchCitiesAsync } from "@/lib/geo";
import { useTranslation } from "@/lib/i18n/context";

interface CityComboboxProps {
  onSelect: (city: City) => void;
}

export default function CityCombobox({ onSelect }: CityComboboxProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<City[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { lang, t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Load initial cities on mount
  useEffect(() => {
    searchCitiesAsync("").then((cities) => setResults(cities.slice(0, 15)));
  }, []);

  // Debounced search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setIsSearching(true);
      searchCitiesAsync(query).then((cities) => {
        setResults(cities.slice(0, 15));
        setActiveIndex(0);
        setIsSearching(false);
      });
    }, 200);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      e.preventDefault();
      onSelect(results[activeIndex]);
      setIsOpen(false);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (listRef.current && isOpen) {
      const active = listRef.current.children[activeIndex] as HTMLElement;
      active?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, isOpen]);

  return (
    <div className="relative w-full">
      <div className="relative">
        {isSearching ? (
          <Loader2
            size={18}
            className="absolute top-1/2 -translate-y-1/2 animate-spin text-gold ltr:left-3 rtl:right-3"
          />
        ) : (
          <Search
            size={18}
            className="absolute top-1/2 -translate-y-1/2 text-slate-gray ltr:left-3 rtl:right-3"
          />
        )}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={t("home.searchCity")}
          className="w-full rounded-xl border border-gold-dim bg-card/80 py-3 text-off-white placeholder:text-slate-gray focus:border-gold focus:outline-none ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="city-list"
          aria-activedescendant={isOpen ? `city-${activeIndex}` : undefined}
        />
      </div>

      {isOpen && results.length > 0 && (
        <ul
          ref={listRef}
          id="city-list"
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-gold-dim bg-card shadow-lg"
        >
          {results.map((city, idx) => (
            <li
              key={`${city.id}-${idx}`}
              id={`city-${idx}`}
              role="option"
              aria-selected={idx === activeIndex}
              className={`flex cursor-pointer items-center gap-2 px-4 py-3 transition-colors ${
                idx === activeIndex
                  ? "bg-card-lighter text-gold"
                  : "text-off-white hover:bg-card-lighter"
              }`}
              onClick={() => {
                onSelect(city);
                setIsOpen(false);
              }}
            >
              <MapPin size={16} className="shrink-0 text-gold" />
              <span>{lang === "ar" ? city.nameAr : city.nameFr}</span>
              <span className="text-xs text-slate-gray">
                {lang === "ar" ? city.nameFr : city.nameAr}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
