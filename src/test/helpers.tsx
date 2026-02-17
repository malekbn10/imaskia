import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { I18nProvider } from "@/lib/i18n/context";

function AllProviders({ children }: { children: React.ReactNode }) {
  return <I18nProvider>{children}</I18nProvider>;
}

export function renderWithI18n(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

export { render };
