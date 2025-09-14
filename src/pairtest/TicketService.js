import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';

export default class TicketService {
  constructor(
    paymentService = new TicketPaymentService(),
    seatService = new SeatReservationService()
  ) {
    this._paymentService = paymentService;
    this._seatService = seatService;
  }

  /**
   * Should only have private methods other than the one below.
   */
  purchaseTickets(accountId, ...ticketTypeRequests) {
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new InvalidPurchaseException('Invalid accountId.');
    }

    if (!ticketTypeRequests || ticketTypeRequests.length === 0) {
      throw new InvalidPurchaseException('No tickets requested.');
    }

    for (const req of ticketTypeRequests) {
      if (
        !req ||
        typeof req.getNoOfTickets !== 'function' ||
        !Number.isInteger(req.getNoOfTickets()) ||
        req.getNoOfTickets() < 0
      ) {
        throw new InvalidPurchaseException('Invalid ticket quantity or type.');
      }
    }

    let adults = 0;
    let children = 0;
    let infants = 0;

    for (const req of ticketTypeRequests) {
      const type = typeof req.getTicketType === 'function' ? req.getTicketType() : undefined;
      const qty = req.getNoOfTickets();

      if (type === 'ADULT') adults += qty;
      else if (type === 'CHILD') children += qty;
      else if (type === 'INFANT') infants += qty;
    }

    const totalRequested = adults + children + infants;
    if (totalRequested > 25) {
      throw new InvalidPurchaseException('Cannot purchase more than 25 tickets.');
    }

    if ((children > 0 || infants > 0) && adults === 0) {
      throw new InvalidPurchaseException('Child and Infant tickets require at least one Adult.');
    }

    const totalToPay = adults * 25 + children * 15; // Infants are free.
    const seatsToReserve = adults + children;       // Infants do not get seats.

    this._paymentService.makePayment(accountId, totalToPay);
    this._seatService.reserveSeat(accountId, seatsToReserve);

    return { accountId, totalToPay, seatsToReserve };
  }
}