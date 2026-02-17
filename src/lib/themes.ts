export interface ThemeDefinition {
  id: string;
  nameAr: string;
  nameFr: string;
  premium: boolean;
  colors: Record<string, string>;
}

export const THEMES: ThemeDefinition[] = [
  {
    id: "night-gold",
    nameAr: "الذهبي الليلي",
    nameFr: "Night Gold",
    premium: false,
    colors: {
      "--color-night-blue": "#0A0E1A",
      "--color-night-blue-light": "#0F1525",
      "--color-card": "#111827",
      "--color-card-lighter": "#1E293B",
      "--color-gold": "#D4A843",
      "--color-gold-light": "#E8C874",
      "--color-gold-dim": "rgba(212, 168, 67, 0.1)",
    },
  },
  {
    id: "emerald",
    nameAr: "الزمردي",
    nameFr: "Emerald",
    premium: true,
    colors: {
      "--color-night-blue": "#021A0F",
      "--color-night-blue-light": "#03261A",
      "--color-card": "#0A3322",
      "--color-card-lighter": "#134D34",
      "--color-gold": "#34D399",
      "--color-gold-light": "#6EE7B7",
      "--color-gold-dim": "rgba(52, 211, 153, 0.1)",
    },
  },
  {
    id: "light",
    nameAr: "الفاتح",
    nameFr: "Light",
    premium: true,
    colors: {
      "--color-night-blue": "#F8FAFC",
      "--color-night-blue-light": "#F1F5F9",
      "--color-card": "#FFFFFF",
      "--color-card-lighter": "#E2E8F0",
      "--color-gold": "#B45309",
      "--color-gold-light": "#D97706",
      "--color-gold-dim": "rgba(180, 83, 9, 0.1)",
      "--color-off-white": "#0F172A",
      "--color-slate-gray": "#475569",
    },
  },
  {
    id: "midnight-blue",
    nameAr: "الأزرق الداكن",
    nameFr: "Midnight Blue",
    premium: true,
    colors: {
      "--color-night-blue": "#020617",
      "--color-night-blue-light": "#0F172A",
      "--color-card": "#1E293B",
      "--color-card-lighter": "#334155",
      "--color-gold": "#3B82F6",
      "--color-gold-light": "#60A5FA",
      "--color-gold-dim": "rgba(59, 130, 246, 0.1)",
    },
  },
  {
    id: "rose-gold",
    nameAr: "الوردي الذهبي",
    nameFr: "Rose Gold",
    premium: true,
    colors: {
      "--color-night-blue": "#1A0A10",
      "--color-night-blue-light": "#25101A",
      "--color-card": "#2D1520",
      "--color-card-lighter": "#3D1F2E",
      "--color-gold": "#F472B6",
      "--color-gold-light": "#F9A8D4",
      "--color-gold-dim": "rgba(244, 114, 182, 0.1)",
    },
  },
];

export function getThemeById(id: string): ThemeDefinition | undefined {
  return THEMES.find((t) => t.id === id);
}

export const DEFAULT_THEME_ID = "night-gold";
