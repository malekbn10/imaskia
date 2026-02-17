import { describe, it, expect } from "vitest";
import { findNearestCity, searchCities, getCityById, euclideanDistance, getCityCoords } from "../geo";

describe("euclideanDistance", () => {
  it("returns 0 for same point", () => {
    expect(euclideanDistance(36.8, 10.2, 36.8, 10.2)).toBe(0);
  });

  it("calculates distance between two points", () => {
    const dist = euclideanDistance(36.8, 10.2, 34.7, 10.8);
    expect(dist).toBeGreaterThan(0);
    expect(dist).toBeLessThan(5);
  });
});

describe("findNearestCity", () => {
  it("finds Tunis for Tunis coordinates", () => {
    const city = findNearestCity(36.8065, 10.1815);
    expect(city.id).toBe("tunis");
  });

  it("finds Sfax for Sfax coordinates", () => {
    const city = findNearestCity(34.74, 10.76);
    expect(city.id).toBe("sfax");
  });

  it("finds nearest city for approximate coordinates", () => {
    // Close to Sousse
    const city = findNearestCity(35.83, 10.64);
    expect(city.id).toBe("sousse");
  });

  it("always returns a city (never undefined)", () => {
    const city = findNearestCity(0, 0);
    expect(city).toBeDefined();
    expect(city.id).toBeTruthy();
  });
});

describe("searchCities", () => {
  it("returns all cities for empty query", () => {
    const results = searchCities("");
    expect(results.length).toBeGreaterThan(20);
  });

  it("searches by French name", () => {
    const results = searchCities("tunis");
    expect(results.some((c) => c.id === "tunis")).toBe(true);
  });

  it("searches by Arabic name", () => {
    const results = searchCities("تونس");
    expect(results.some((c) => c.id === "tunis")).toBe(true);
  });

  it("searches case-insensitively", () => {
    const results = searchCities("SFAX");
    expect(results.some((c) => c.id === "sfax")).toBe(true);
  });

  it("returns empty for non-matching query", () => {
    const results = searchCities("xyz123nonexistent");
    expect(results.length).toBe(0);
  });
});

describe("getCityById", () => {
  it("finds Tunis by ID", () => {
    const city = getCityById("tunis");
    expect(city).toBeDefined();
    expect(city!.nameFr).toBe("Tunis");
  });

  it("returns undefined for invalid ID", () => {
    expect(getCityById("nonexistent")).toBeUndefined();
  });
});

describe("getCityCoords", () => {
  it("extracts coordinates from city", () => {
    const city = getCityById("tunis")!;
    const coords = getCityCoords(city);
    expect(coords.lat).toBeCloseTo(36.8065, 3);
    expect(coords.lng).toBeCloseTo(10.1815, 3);
  });
});
