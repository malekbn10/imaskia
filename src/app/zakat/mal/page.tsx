"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import GlassCard from "@/components/ui/GlassCard";

// Gold nisab: 85g × price per gram
// Silver nisab: 595g × price per gram
// Default gold price in Tunisia (~TND)
const DEFAULT_GOLD_PRICE = 350; // TND per gram (approximate)
const GOLD_GRAMS = 85;

export default function ZakatMalPage() {
  const { t } = useTranslation();
  const [wealth, setWealth] = useState("");
  const [goldPrice, setGoldPrice] = useState(DEFAULT_GOLD_PRICE);
  const [calculated, setCalculated] = useState(false);

  const nisab = GOLD_GRAMS * goldPrice;
  const wealthNum = parseFloat(wealth) || 0;
  const isEligible = wealthNum >= nisab;
  const zakatAmount = isEligible ? wealthNum * 0.025 : 0;

  const handleCalculate = () => setCalculated(true);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold text-gold">{t("zakat.malTitle")}</h1>
      <p className="text-sm text-slate-gray">{t("zakat.malDesc")}</p>

      <GlassCard className="space-y-5 p-5">
        {/* Gold price */}
        <div>
          <label className="mb-2 block text-sm text-off-white">{t("zakat.goldPrice")}</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={goldPrice}
              onChange={(e) => {
                setGoldPrice(parseFloat(e.target.value) || 0);
                setCalculated(false);
              }}
              className="w-full rounded-lg border border-gold-dim bg-card-lighter px-4 py-2.5 text-off-white outline-none focus:border-gold"
            />
            <span className="text-sm text-slate-gray">{t("zakat.currency")}/g</span>
          </div>
        </div>

        {/* Nisab indicator */}
        <div className="rounded-lg bg-card-lighter p-3 text-sm">
          <p className="text-slate-gray">
            {t("zakat.nisabGold")}: <span className="text-gold font-semibold">{nisab.toLocaleString()} {t("zakat.currency")}</span>
          </p>
        </div>

        {/* Total wealth */}
        <div>
          <label className="mb-2 block text-sm text-off-white">{t("zakat.wealth")}</label>
          <input
            type="number"
            value={wealth}
            onChange={(e) => {
              setWealth(e.target.value);
              setCalculated(false);
            }}
            placeholder="0"
            className="w-full rounded-lg border border-gold-dim bg-card-lighter px-4 py-2.5 text-off-white outline-none focus:border-gold"
          />
        </div>

        <button
          onClick={handleCalculate}
          className="w-full rounded-xl bg-gold px-6 py-3 font-semibold text-night-blue transition-colors hover:bg-gold-light"
        >
          {t("zakat.calculate")}
        </button>

        {/* Result */}
        {calculated && (
          <div className={`rounded-xl p-4 text-center ${isEligible ? "bg-mint/10" : "bg-card-lighter"}`}>
            <p className={`mb-2 text-sm font-semibold ${isEligible ? "text-mint" : "text-slate-gray"}`}>
              {isEligible ? t("zakat.eligible") : t("zakat.notEligible")}
            </p>
            {isEligible && (
              <p className="text-3xl font-bold text-mint">
                {zakatAmount.toFixed(2)} <span className="text-base">{t("zakat.currency")}</span>
              </p>
            )}
            {isEligible && (
              <p className="mt-1 text-xs text-slate-gray">{t("zakat.percentage")}</p>
            )}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
