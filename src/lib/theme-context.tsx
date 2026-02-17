"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { THEMES, getThemeById, DEFAULT_THEME_ID, ThemeDefinition } from "./themes";
import { getTheme, setTheme as storeTheme } from "./storage";

interface ThemeContextType {
  themeId: string;
  theme: ThemeDefinition;
  setTheme: (id: string) => void;
  themes: ThemeDefinition[];
}

const ThemeContext = createContext<ThemeContextType | null>(null);

function applyTheme(theme: ThemeDefinition) {
  const root = document.documentElement;
  // Reset to defaults first by removing overrides
  for (const t of THEMES) {
    for (const key of Object.keys(t.colors)) {
      root.style.removeProperty(key);
    }
  }
  // Apply new theme colors
  for (const [key, value] of Object.entries(theme.colors)) {
    root.style.setProperty(key, value);
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState(DEFAULT_THEME_ID);

  useEffect(() => {
    const stored = getTheme();
    if (stored) {
      setThemeId(stored);
      const theme = getThemeById(stored);
      if (theme) applyTheme(theme);
    }
  }, []);

  const setTheme = useCallback((id: string) => {
    const theme = getThemeById(id);
    if (!theme) return;
    setThemeId(id);
    storeTheme(id);
    applyTheme(theme);
  }, []);

  const theme = getThemeById(themeId) ?? THEMES[0];

  return (
    <ThemeContext.Provider value={{ themeId, theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
