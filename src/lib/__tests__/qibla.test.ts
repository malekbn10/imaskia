import { describe, it, expect } from "vitest";
import { getQiblaAngle, getDistanceToMecca } from "../qibla";

describe("getQiblaAngle", () => {
  it("returns ~115° for Tunis", () => {
    // Tunis: 36.8065°N, 10.1815°E → Qibla angle ~115° from North
    const angle = getQiblaAngle(36.8065, 10.1815);
    expect(angle).toBeGreaterThan(110);
    expect(angle).toBeLessThan(120);
  });

  it("returns ~180° for a point directly north of Mecca", () => {
    // Point north of Mecca at same longitude
    const angle = getQiblaAngle(50, 39.8262);
    expect(angle).toBeGreaterThan(170);
    expect(angle).toBeLessThan(190);
  });

  it("returns a value between 0 and 360", () => {
    const angle = getQiblaAngle(0, 0);
    expect(angle).toBeGreaterThanOrEqual(0);
    expect(angle).toBeLessThan(360);
  });
});

describe("getDistanceToMecca", () => {
  it("returns ~3300km for Tunis", () => {
    const dist = getDistanceToMecca(36.8065, 10.1815);
    expect(dist).toBeGreaterThan(3100);
    expect(dist).toBeLessThan(3500);
  });

  it("returns 0 for Mecca coordinates", () => {
    const dist = getDistanceToMecca(21.4225, 39.8262);
    expect(dist).toBe(0);
  });

  it("returns a positive number", () => {
    const dist = getDistanceToMecca(48.8566, 2.3522); // Paris
    expect(dist).toBeGreaterThan(0);
  });
});
