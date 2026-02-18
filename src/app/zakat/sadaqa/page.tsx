"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { getSadaqa, addSadaqa, clearSadaqa, type SadaqaDonation } from "@/lib/storage";
import GlassCard from "@/components/ui/GlassCard";

const ASSOCIATIONS = [
  { name: "الهلال الأحمر التونسي", nameFr: "Croissant-Rouge tunisien", url: "https://www.croissantrouge.tn" },
  { name: "جمعية إنصاف", nameFr: "Association Insaf", url: "https://www.insaf.tn" },
  { name: "بنك الطعام التونسي", nameFr: "Banque Alimentaire de Tunisie", url: "https://www.bat.org.tn" },
];

export default function SadaqaPage() {
  const { t, lang } = useTranslation();
  const [donations, setDonations] = useState<SadaqaDonation[]>([]);
  const [total, setTotal] = useState(0);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const data = getSadaqa();
    setDonations(data.donations);
    setTotal(data.total);
  }, []);

  const handleAdd = () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) return;
    const data = addSadaqa(num, note);
    setDonations(data.donations);
    setTotal(data.total);
    setAmount("");
    setNote("");
  };

  const handleClear = () => {
    clearSadaqa();
    setDonations([]);
    setTotal(0);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold text-gold">{t("zakat.sadaqaTitle")}</h1>
      <p className="text-sm text-slate-gray">{t("zakat.sadaqaDesc")}</p>

      {/* Total donated */}
      <GlassCard className="p-5 text-center">
        <p className="mb-1 text-sm text-slate-gray">{t("zakat.totalDonated")}</p>
        <p className="text-3xl font-bold text-mint">
          {total.toFixed(2)} <span className="text-base">{t("zakat.currency")}</span>
        </p>
      </GlassCard>

      {/* Add donation form */}
      <GlassCard className="space-y-3 p-5">
        <h2 className="text-sm font-semibold text-off-white">{t("zakat.addDonation")}</h2>
        <div className="flex gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={t("zakat.amount")}
            min="0"
            step="0.5"
            className="flex-1 rounded-lg border border-gold-dim bg-card-lighter px-3 py-2.5 text-sm text-off-white outline-none focus:border-gold"
          />
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("zakat.note")}
            className="flex-1 rounded-lg border border-gold-dim bg-card-lighter px-3 py-2.5 text-sm text-off-white outline-none focus:border-gold"
          />
        </div>
        <button
          onClick={handleAdd}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-4 py-2.5 font-semibold text-night-blue transition-colors hover:bg-gold-light"
        >
          <Plus size={18} />
          {t("zakat.addDonation")}
        </button>
      </GlassCard>

      {/* Donation history */}
      <GlassCard className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-off-white">{t("zakat.history")}</h2>
          {donations.length > 0 && (
            <button onClick={handleClear} className="flex items-center gap-1 text-xs text-danger hover:text-danger/80">
              <Trash2 size={14} />
              {t("zakat.clear")}
            </button>
          )}
        </div>

        {donations.length === 0 ? (
          <p className="py-4 text-center text-sm text-slate-gray">{t("zakat.noDonations")}</p>
        ) : (
          <div className="space-y-2">
            {donations.map((d, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-card-lighter px-3 py-2.5 text-sm">
                <div>
                  <span className="text-off-white">{d.note || "—"}</span>
                  <p className="text-[11px] text-slate-gray">
                    {new Date(d.date).toLocaleDateString(lang === "ar" ? "ar-TN" : "fr-TN")}
                  </p>
                </div>
                <span className="font-semibold text-mint">{d.amount.toFixed(2)} {t("zakat.currency")}</span>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Tunisian associations */}
      <GlassCard className="p-5">
        <h2 className="mb-3 text-sm font-semibold text-off-white">{t("zakat.associations")}</h2>
        <div className="space-y-2">
          {ASSOCIATIONS.map((assoc) => (
            <a
              key={assoc.url}
              href={assoc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg bg-card-lighter px-3 py-2.5 text-sm text-off-white transition-colors hover:bg-gold-dim"
            >
              <span>{lang === "ar" ? assoc.name : assoc.nameFr}</span>
              <ExternalLink size={14} className="text-slate-gray" />
            </a>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
