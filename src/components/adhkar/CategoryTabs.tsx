"use client";

import { DuaCategory } from "@/types";
import { useTranslation } from "@/lib/i18n/context";
import { ADHKAR_CATEGORIES } from "@/lib/adhkar-utils";

interface CategoryTabsProps {
  selected: DuaCategory | "all";
  onSelect: (category: DuaCategory | "all") => void;
}

export default function CategoryTabs({ selected, onSelect }: CategoryTabsProps) {
  const { t } = useTranslation();

  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      {/* "All" tab */}
      <button
        onClick={() => onSelect("all")}
        className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
          selected === "all"
            ? "bg-gold text-night-blue"
            : "bg-card-lighter text-slate-gray hover:bg-card-lighter/80"
        }`}
      >
        {t("adhkar.categories.all")}
      </button>

      {ADHKAR_CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
            selected === cat
              ? "bg-gold text-night-blue"
              : "bg-card-lighter text-slate-gray hover:bg-card-lighter/80"
          }`}
        >
          {t(`adhkar.categories.${cat}`)}
        </button>
      ))}
    </div>
  );
}
