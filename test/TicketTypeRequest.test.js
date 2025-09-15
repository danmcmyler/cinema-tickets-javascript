import { describe, test, expect } from "@jest/globals";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";

describe("TicketTypeRequest", () => {
  test("constructs with valid type and integer quantity", () => {
    const r = new TicketTypeRequest("ADULT", 2);
    const type = typeof r.getTicketType === "function" ? r.getTicketType() : r.ticketType || r.type;
    const qty = typeof r.getNoOfTickets === "function" ? r.getNoOfTickets() : r.noOfTickets || r.quantity;

    expect(type).toBe("ADULT");
    expect(qty).toBe(2);
  });

  test("rejects invalid type", () => {
    expect(() => new TicketTypeRequest("SENIOR", 1)).toThrow(TypeError);
  });

  test("rejects non-integer quantity", () => {
    expect(() => new TicketTypeRequest("ADULT", 1.2)).toThrow(TypeError);
  });
});