"use client";

import { Bell, Globe, MapPin, Crown, Palette, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTranslation } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth-utils";
import GlassCard from "@/components/ui/GlassCard";
import ThemePicker from "@/components/settings/ThemePicker";

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  href?: string;
  onClick?: () => void;
}

function SettingItem({ icon, label, description, href, onClick }: SettingItemProps) {
  const Tag = href ? "a" : "button";
  return (
    <Tag
      href={href}
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-3 text-start transition-colors hover:bg-card-lighter/50"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-off-white">{label}</p>
        {description && <p className="text-xs text-slate-gray">{description}</p>}
      </div>
    </Tag>
  );
}

export default function SettingsPage() {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold text-gold">{t("settings.title")}</h1>

      {/* User info */}
      {isAuthenticated && user && (
        <GlassCard className="flex items-center gap-3 p-4">
          {user.image ? (
            <img src={user.image} alt="" className="h-12 w-12 rounded-full border border-gold-dim" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 text-lg font-bold text-gold">
              {user.name?.[0] ?? user.email?.[0] ?? "?"}
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm font-semibold text-off-white">{user.name ?? user.email}</p>
            {user.name && <p className="text-xs text-slate-gray">{user.email}</p>}
          </div>
        </GlassCard>
      )}

      {/* Theme picker */}
      <ThemePicker />

      {/* Settings list */}
      <GlassCard className="divide-y divide-gold-dim/50 overflow-hidden">
        <SettingItem
          icon={<MapPin size={18} />}
          label={t("settings.city")}
          href="/"
        />
        <SettingItem
          icon={<Globe size={18} />}
          label={t("settings.language")}
        />
        <SettingItem
          icon={<Bell size={18} />}
          label={t("settings.notifications")}
          description={t("settings.notificationsDesc")}
          href="/settings/notifications"
        />
        <SettingItem
          icon={<Crown size={18} />}
          label={t("settings.premium")}
          href="/premium"
        />
      </GlassCard>

      {/* Sign out */}
      {isAuthenticated && (
        <GlassCard className="overflow-hidden">
          <SettingItem
            icon={<LogOut size={18} />}
            label={t("auth.signOut")}
            onClick={() => signOut({ callbackUrl: "/" })}
          />
        </GlassCard>
      )}

      {/* Sign in prompt */}
      {!isAuthenticated && (
        <GlassCard className="p-6 text-center">
          <p className="mb-4 text-sm text-slate-gray">{t("auth.signIn")}</p>
          <a
            href="/auth/signin"
            className="inline-block rounded-xl bg-gold px-6 py-2.5 text-sm font-semibold text-night-blue transition-colors hover:bg-gold-light"
          >
            {t("auth.signIn")}
          </a>
        </GlassCard>
      )}
    </div>
  );
}
