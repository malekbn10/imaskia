"use client";

import { DayInfo } from "@/types";
import { parseTime, getFastingDuration } from "@/lib/prayer-utils";
import { useTranslation } from "@/lib/i18n/context";

interface RamadanTableProps {
  days: DayInfo[];
}

export default function RamadanTable({ days }: RamadanTableProps) {
  const { t } = useTranslation();
  const today = new Date();
  const todayStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

  return (
    <div className="overflow-x-auto rounded-xl border border-gold-dim">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gold-dim bg-card/80 text-slate-gray">
            <th className="px-3 py-2 text-start font-medium">{t("calendar.hijriDay")}</th>
            <th className="px-3 py-2 text-start font-medium">{t("calendar.gregorianDate")}</th>
            <th className="px-3 py-2 text-center font-medium">{t("calendar.imsakTime")}</th>
            <th className="px-3 py-2 text-center font-medium">{t("calendar.maghribTime")}</th>
            <th className="px-3 py-2 text-center font-medium">{t("calendar.fastingDuration")}</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day, idx) => {
            const hijriDay = parseInt(day.date.hijri.day, 10);
            const gregDate = day.date.gregorian.date;
            const isToday = gregDate === todayStr;
            const isLastTen = hijriDay >= 21;
            const isNight27 = hijriDay === 27;

            const imsakTime = parseTime(day.timings.Imsak);
            const maghribTime = parseTime(day.timings.Maghrib);
            const { duration } = getFastingDuration(day.timings.Imsak, day.timings.Maghrib);

            const rowClasses = isToday
              ? "bg-gold/10 border-l-2 border-l-gold"
              : isLastTen
              ? "bg-islamic-green/5"
              : idx % 2 === 0
              ? "bg-transparent"
              : "bg-card/20";

            return (
              <tr
                key={idx}
                className={`border-b border-gold-dim/50 transition-colors ${rowClasses}`}
              >
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-off-white">{hijriDay}</span>
                    {isToday && (
                      <span className="rounded-full bg-gold px-1.5 py-0.5 text-[10px] font-bold text-night-blue">
                        {t("calendar.today")}
                      </span>
                    )}
                    {isNight27 && (
                      <span className="text-xs" title={t("calendar.laylatAlQadr")}>
                        ✨
                      </span>
                    )}
                    {isLastTen && !isNight27 && (
                      <span className="h-1.5 w-1.5 rounded-full bg-islamic-green" />
                    )}
                  </div>
                </td>
                <td className="px-3 py-2.5 text-slate-gray" dir="ltr">
                  {day.date.gregorian.day}/{day.date.gregorian.month.number}
                </td>
                <td className="px-3 py-2.5 text-center font-mono text-danger" dir="ltr">
                  {String(imsakTime.hours).padStart(2, "0")}:{String(imsakTime.minutes).padStart(2, "0")}
                </td>
                <td className="px-3 py-2.5 text-center font-mono text-warning" dir="ltr">
                  {String(maghribTime.hours).padStart(2, "0")}:{String(maghribTime.minutes).padStart(2, "0")}
                </td>
                <td className="px-3 py-2.5 text-center font-mono text-gold" dir="ltr">
                  {duration}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
