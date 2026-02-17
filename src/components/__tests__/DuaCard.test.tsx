import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithI18n } from "@/test/helpers";
import DuaCard from "@/components/adhkar/DuaCard";
import { Dua } from "@/types";

const mockDua: Dua = {
  id: "test-1",
  titleAr: "دعاء الإفطار",
  titleFr: "Dua de l'Iftar",
  textAr: "اللهم إني لك صمت وعلى رزقك أفطرت",
  transliteration: "Allahumma inni laka sumtu wa ala rizqika aftartu",
  translationFr: "O Allah, j'ai jeûné pour Toi et j'ai rompu le jeûne avec Ta provision",
  source: "Abu Dawud",
  category: "iftar",
  repeatCount: 3,
  premium: false,
};

describe("DuaCard", () => {
  it("renders the title", () => {
    renderWithI18n(<DuaCard dua={mockDua} />);
    // Default language is Arabic
    expect(screen.getByText("دعاء الإفطار")).toBeInTheDocument();
  });

  it("is collapsed by default", () => {
    renderWithI18n(<DuaCard dua={mockDua} />);
    // Arabic text should not be visible when collapsed
    expect(screen.queryByText(mockDua.textAr)).not.toBeInTheDocument();
  });

  it("expands on click", () => {
    renderWithI18n(<DuaCard dua={mockDua} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(screen.getByText(mockDua.textAr)).toBeInTheDocument();
  });

  it("shows transliteration when expanded", () => {
    renderWithI18n(<DuaCard dua={mockDua} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText(mockDua.transliteration)).toBeInTheDocument();
  });

  it("shows source when expanded", () => {
    renderWithI18n(<DuaCard dua={mockDua} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Abu Dawud")).toBeInTheDocument();
  });

  it("collapses on second click", () => {
    renderWithI18n(<DuaCard dua={mockDua} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(screen.getByText(mockDua.textAr)).toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.queryByText(mockDua.textAr)).not.toBeInTheDocument();
  });

  it("does not expand when locked", () => {
    renderWithI18n(<DuaCard dua={mockDua} locked />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.queryByText(mockDua.textAr)).not.toBeInTheDocument();
  });

  it("shows lock icon when locked", () => {
    const { container } = renderWithI18n(<DuaCard dua={mockDua} locked />);
    // Lock icon rendered as SVG
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
