import { describe, test, expect } from "@jest/globals";
import { calculateSeats } from "../src/pairtest/domain/seating.js";

describe("calculateSeats", () => {
  test("returns 0 when no tickets are requested", () => {
    expect(calculateSeats(0, 0, 0)).toBe(0);
  });

  test("counts adults as seats", () => {
    expect(calculateSeats(2, 0, 0)).toBe(2);
  });

  test("counts children as seats", () => {
    expect(calculateSeats(0, 3, 0)).toBe(3);
  });

  test("does not count infants as seats", () => {
    expect(calculateSeats(0, 0, 4)).toBe(0);
  });

  test("returns combined total for adults and children", () => {
    expect(calculateSeats(1, 2, 3)).toBe(3);
  });
});