import { describe, test, expect } from "@jest/globals";
import { calculateTotal } from "../src/pairtest/domain/pricing.js";

describe("calculateTotal", () => {
  test("returns 0 when no tickets are requested", () => {
    expect(calculateTotal(0, 0, 0)).toBe(0);
  });

  test("returns 25 per adult", () => {
    expect(calculateTotal(2, 0, 0)).toBe(50);
  });

  test("returns 15 per child", () => {
    expect(calculateTotal(0, 3, 0)).toBe(45);
  });

  test("returns 0 for infants", () => {
    expect(calculateTotal(0, 0, 4)).toBe(0);
  });

  test("returns combined total for adults, children, and infants", () => {
    expect(calculateTotal(1, 2, 1)).toBe(55);
  });
});