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

    let adults = 0;

    for (const req of ticketTypeRequests) {
      if (
        req &&
        typeof req.getTicketType === 'function' &&
        typeof req.getNoOfTickets === 'function' &&
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
