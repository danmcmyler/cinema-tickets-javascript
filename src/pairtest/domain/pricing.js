import { TICKET } from "./constants.js";

export function calculateTotal(adults, children, infants) {
  return (adults   * TICKET.ADULT.price) +
         (children * TICKET.CHILD.price) +
         (infants  * TICKET.INFANT.price);
}