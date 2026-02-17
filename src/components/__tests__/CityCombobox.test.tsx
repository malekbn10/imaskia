import { describe, it, expect, vi, beforeAll } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithI18n } from "@/test/helpers";
import CityCombobox from "@/components/ui/CityCombobox";

// jsdom doesn't implement scrollIntoView
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

describe("CityCombobox", () => {
  it("renders search input", () => {
    const onSelect = vi.fn();
    renderWithI18n(<CityCombobox onSelect={onSelect} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("has correct ARIA attributes", () => {
    const onSelect = vi.fn();
    renderWithI18n(<CityCombobox onSelect={onSelect} />);
    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("aria-expanded", "false");
  });

  it("shows results on focus", () => {
    const onSelect = vi.fn();
    renderWithI18n(<CityCombobox onSelect={onSelect} />);
    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("filters cities by query", () => {
    const onSelect = vi.fn();
    renderWithI18n(<CityCombobox onSelect={onSelect} />);
    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Tunis" } });
    const options = screen.getAllByRole("option");
    expect(options.length).toBeGreaterThan(0);
    expect(options.length).toBeLessThan(10);
  });

  it("calls onSelect when a city is clicked", () => {
    const onSelect = vi.fn();
    renderWithI18n(<CityCombobox onSelect={onSelect} />);
    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Sfax" } });
    const options = screen.getAllByRole("option");
    fireEvent.click(options[0]);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0][0]).toHaveProperty("id", "sfax");
  });

  it("navigates with keyboard arrows", () => {
    const onSelect = vi.fn();
    renderWithI18n(<CityCombobox onSelect={onSelect} />);
    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "S" } });

    // Press ArrowDown
    fireEvent.keyDown(input, { key: "ArrowDown" });
    const options = screen.getAllByRole("option");
    expect(options[1]).toHaveAttribute("aria-selected", "true");
  });

  it("selects with Enter key", () => {
    const onSelect = vi.fn();
    renderWithI18n(<CityCombobox onSelect={onSelect} />);
    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Sfax" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape", () => {
    const onSelect = vi.fn();
    renderWithI18n(<CityCombobox onSelect={onSelect} />);
    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    fireEvent.keyDown(input, { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
