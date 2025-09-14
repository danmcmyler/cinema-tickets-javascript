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

    for (const req of ticketTypeRequests) {
      if (
        typeof req.getTicketType === 'function' &&
        req.getTicketType() === 'ADULT'
      ) {
        adults += req.getNoOfTickets();
      }
    }

    const totalToPay = adults * 25;
    const seatsToReserve = adults;

    this._paymentService.makePayment(accountId, totalToPay);
    this._seatService.reserveSeat(accountId, seatsToReserve);

    return { accountId, totalToPay, seatsToReserve };
  }
}