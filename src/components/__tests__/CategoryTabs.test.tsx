import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithI18n } from "@/test/helpers";
import CategoryTabs from "@/components/adhkar/CategoryTabs";

describe("CategoryTabs", () => {
  it("renders the All tab", () => {
    const onSelect = vi.fn();
    renderWithI18n(<CategoryTabs selected="all" onSelect={onSelect} />);
    // In Arabic, "الكل" is the "all" label
    expect(screen.getByText("الكل")).toBeInTheDocument();
  });

  it("renders all category buttons", () => {
    const onSelect = vi.fn();
    renderWithI18n(<CategoryTabs selected="all" onSelect={onSelect} />);
    const buttons = screen.getAllByRole("button");
    // 1 (All) + 8 categories = 9
    expect(buttons.length).toBe(9);
  });

  it("calls onSelect when a category is clicked", () => {
    const onSelect = vi.fn();
    renderWithI18n(<CategoryTabs selected="all" onSelect={onSelect} />);
    // Click the second button (first category after "All")
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[1]);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("calls onSelect('all') when All tab clicked", () => {
    const onSelect = vi.fn();
    renderWithI18n(<CategoryTabs selected="iftar" onSelect={onSelect} />);
    fireEvent.click(screen.getByText("الكل"));
    expect(onSelect).toHaveBeenCalledWith("all");
  });

  it("highlights selected category", () => {
    const onSelect = vi.fn();
    renderWithI18n(<CategoryTabs selected="all" onSelect={onSelect} />);
    const allButton = screen.getByText("الكل");
    expect(allButton.className).toContain("bg-gold");
  });
});
