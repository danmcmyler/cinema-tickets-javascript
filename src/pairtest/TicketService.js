import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';
import { calculateTotal } from './domain/pricing.js';
import { calculateSeats } from './domain/seating.js';
import { validateRequest } from './domain/validation.js';

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
    const { adults, children, infants } = validateRequest(
      accountId,
      ticketTypeRequests
    );

    const totalToPay = calculateTotal(adults, children, infants);
    const seatsToReserve = calculateSeats(adults, children, infants);

    this._paymentService.makePayment(accountId, totalToPay);
    this._seatService.reserveSeat(accountId, seatsToReserve);

    return { accountId, totalToPay, seatsToReserve };
  }
}