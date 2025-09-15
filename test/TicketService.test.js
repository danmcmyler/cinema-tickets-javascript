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

  test("rejects when more than 25 tickets are requested", () => {
    const tooMany = new TicketTypeRequest("ADULT", 26);
    expect(() => svc.purchaseTickets(1, tooMany)).toThrow(InvalidPurchaseException);
  });

  test("rejects when child tickets are purchased without an adult", () => {
    const childOnly = new TicketTypeRequest("CHILD", 1);
    expect(() => svc.purchaseTickets(1, childOnly)).toThrow(InvalidPurchaseException);
  });

  test("rejects when infant tickets are purchased without an adult", () => {
    const infantOnly = new TicketTypeRequest("INFANT", 1);
    expect(() => svc.purchaseTickets(1, infantOnly)).toThrow(InvalidPurchaseException);
  });

  test("processes a mix of adults and children correctly", () => {
    const result = svc.purchaseTickets(
      1,
      new TicketTypeRequest("ADULT", 1),
      new TicketTypeRequest("CHILD", 2)
    );

    expect(result).toEqual({ accountId: 1, totalToPay: 55, seatsToReserve: 3 });
    expect(pay.makePayment).toHaveBeenCalledWith(1, 55);
    expect(seat.reserveSeat).toHaveBeenCalledWith(1, 3);
  });

  test("processes a mix of adults and infants correctly", () => {
    const result = svc.purchaseTickets(
      1,
      new TicketTypeRequest("ADULT", 1),
      new TicketTypeRequest("INFANT", 2)
    );

    expect(result).toEqual({ accountId: 1, totalToPay: 25, seatsToReserve: 1 });
    expect(pay.makePayment).toHaveBeenCalledWith(1, 25);
    expect(seat.reserveSeat).toHaveBeenCalledWith(1, 1);
  });

  test("processes a mix of adults, children and infants", () => {
    const result = svc.purchaseTickets(
      1,
      new TicketTypeRequest("ADULT", 2),
      new TicketTypeRequest("CHILD", 3),
      new TicketTypeRequest("INFANT", 1)
    );

    expect(result).toEqual({ accountId: 1, totalToPay: 95, seatsToReserve: 5 });
    expect(pay.makePayment).toHaveBeenCalledWith(1, 95);
    expect(seat.reserveSeat).toHaveBeenCalledWith(1, 5);
  });
});