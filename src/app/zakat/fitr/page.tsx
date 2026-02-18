"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import GlassCard from "@/components/ui/GlassCard";

const DEFAULT_PRICE = 1.9; // TND per person (approximate 2026 Tunisia)

export default function ZakatFitrPage() {
  const { t } = useTranslation();
  const [persons, setPersons] = useState(1);
  const [price, setPrice] = useState(DEFAULT_PRICE);

  const total = persons * price;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold text-gold">{t("zakat.fitrTitle")}</h1>
      <p className="text-sm text-slate-gray">{t("zakat.fitrDesc")}</p>

      <GlassCard className="space-y-5 p-5">
        {/* Persons */}
        <div>
          <label className="mb-2 block text-sm text-off-white">{t("zakat.persons")}</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPersons(Math.max(1, persons - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-card-lighter text-lg text-off-white hover:bg-gold-dim"
            >
              −
            </button>
            <span className="min-w-[3rem] text-center text-2xl font-bold text-gold">{persons}</span>
            <button
              onClick={() => setPersons(persons + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-card-lighter text-lg text-off-white hover:bg-gold-dim"
            >
              +
            </button>
          </div>
        </div>

        {/* Price per person */}
        <div>
          <label className="mb-2 block text-sm text-off-white">{t("zakat.pricePerPerson")}</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value) || 0))}
              step="0.1"
              min="0"
              className="w-full rounded-lg border border-gold-dim bg-card-lighter px-4 py-2.5 text-off-white outline-none focus:border-gold"
            />
            <span className="text-sm text-slate-gray">{t("zakat.currency")}</span>
          </div>
        </div>

        {/* Total */}
        <div className="rounded-xl bg-mint/10 p-4 text-center">
          <p className="mb-1 text-sm text-slate-gray">{t("zakat.total")}</p>
          <p className="text-3xl font-bold text-mint">
            {total.toFixed(2)} <span className="text-base">{t("zakat.currency")}</span>
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
