import { describe, test, expect } from "@jest/globals";
import { validateRequest } from "../src/pairtest/domain/validation.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";

describe("validateRequest", () => {
  test("throws when accountId is not positive", () => {
    expect(() => validateRequest(0, [new TicketTypeRequest("ADULT", 1)])).toThrow(
      InvalidPurchaseException
    );
  });

  test("throws when no tickets are provided", () => {
    expect(() => validateRequest(1, [])).toThrow(InvalidPurchaseException);
  });

  test("throws when ticket quantity is negative", () => {
    const bad = {
      getTicketType: () => "ADULT",
      getNoOfTickets: () => -1,
    };
    expect(() => validateRequest(1, [bad])).toThrow(InvalidPurchaseException);
  });

  test("throws when more than 25 tickets are requested", () => {
    const tooMany = new TicketTypeRequest("ADULT", 26);
    expect(() => validateRequest(1, [tooMany])).toThrow(InvalidPurchaseException);
  });

  test("throws when child tickets are purchased without an adult", () => {
    const childOnly = new TicketTypeRequest("CHILD", 1);
    expect(() => validateRequest(1, [childOnly])).toThrow(InvalidPurchaseException);
  });

  test("throws when infant tickets are purchased without an adult", () => {
    const infantOnly = new TicketTypeRequest("INFANT", 1);
    expect(() => validateRequest(1, [infantOnly])).toThrow(InvalidPurchaseException);
  });

  test("returns ticket counts when request is valid", () => {
    const result = validateRequest(1, [
      new TicketTypeRequest("ADULT", 2),
      new TicketTypeRequest("CHILD", 3),
      new TicketTypeRequest("INFANT", 1),
    ]);
    expect(result).toEqual({ adults: 2, children: 3, infants: 1 });
  });
});