"use client";

import { User } from "lucide-react";
import { useAuth } from "@/lib/auth-utils";
import LanguageToggle from "@/components/ui/LanguageToggle";

export default function Header() {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-gold-dim bg-night-blue/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌙</span>
          <span className="text-lg font-bold text-gold">إمساكية</span>
        </div>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          {isAuthenticated ? (
            <a href="/settings" className="shrink-0">
              {user?.image ? (
                <img
                  src={user.image}
                  alt=""
                  className="h-8 w-8 rounded-full border border-gold-dim"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/20 text-gold">
                  <User size={16} />
                </div>
              )}
            </a>
          ) : (
            <a
              href="/auth/signin"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-card-lighter text-slate-gray transition-colors hover:text-gold"
            >
              <User size={16} />
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
