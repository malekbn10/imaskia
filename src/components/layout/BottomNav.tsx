"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Compass, BookOpen, MoreHorizontal } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";

const navItems = [
  { href: "/", icon: Home, labelKey: "nav.home" },
  { href: "/calendar", icon: Calendar, labelKey: "nav.calendar" },
  { href: "/qibla", icon: Compass, labelKey: "nav.qibla" },
  { href: "/adhkar", icon: BookOpen, labelKey: "nav.adhkar" },
  { href: "/about", icon: MoreHorizontal, labelKey: "nav.more" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gold-dim bg-night-blue/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-lg items-center justify-around pb-[env(safe-area-inset-bottom,0px)]">
        {navItems.map(({ href, icon: Icon, labelKey }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-colors ${
                isActive
                  ? "text-gold"
                  : "text-slate-gray hover:text-off-white"
              }`}
            >
              <Icon
                size={22}
                className={isActive ? "text-gold" : ""}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span className="leading-tight">{t(labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
