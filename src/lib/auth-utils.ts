"use client";

import { useSession } from "next-auth/react";

/**
 * Wrapper around useSession for consistent usage across the app.
 * Returns typed session data with convenience booleans.
 */
export function useAuth() {
  const { data: session, status } = useSession();

  return {
    session,
    user: session?.user ?? null,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
}
