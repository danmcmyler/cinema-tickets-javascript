import { jest, describe, test, expect, beforeEach } from "@jest/globals";
import TicketService from "../src/pairtest/TicketService.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";

class FakePayment {
  makePayment = jest.fn();
}
class FakeSeats {
  reserveSeat = jest.fn();
}

describe("TicketService", () => {
  let pay, seat, svc;

  beforeEach(() => {
    pay = new FakePayment();
    seat = new FakeSeats();
    svc = new TicketService(pay, seat);
  });

  test("processes a single adult ticket", () => {
    const result = svc.purchaseTickets(1, new TicketTypeRequest("ADULT", 1));

    expect(result).toEqual({ accountId: 1, totalToPay: 25, seatsToReserve: 1 });
    expect(pay.makePayment).toHaveBeenCalledTimes(1);
    expect(pay.makePayment).toHaveBeenCalledWith(1, 25);
    expect(seat.reserveSeat).toHaveBeenCalledTimes(1);
    expect(seat.reserveSeat).toHaveBeenCalledWith(1, 1);
  });

  test("rejects when accountId is not an integer", () => {
    expect(() =>
      svc.purchaseTickets(1.5, new TicketTypeRequest("ADULT", 1))
    ).toThrow(InvalidPurchaseException);
  });

  test("rejects when accountId is not positive", () => {
    expect(() =>
      svc.purchaseTickets(0, new TicketTypeRequest("ADULT", 1))
    ).toThrow(InvalidPurchaseException);
  });

  test("rejects when no ticket requests are provided", () => {
    expect(() => svc.purchaseTickets(1)).toThrow(InvalidPurchaseException);
  });

  test("rejects when ticket quantity is negative", () => {
    const bad = {
      getTicketType: () => "ADULT",
      getNoOfTickets: () => -1,
    };
    expect(() => svc.purchaseTickets(1, bad)).toThrow(InvalidPurchaseException);
  });
});