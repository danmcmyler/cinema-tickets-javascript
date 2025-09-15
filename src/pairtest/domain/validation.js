import InvalidPurchaseException from "../lib/InvalidPurchaseException.js";
import { MAX_TICKETS } from "./constants.js";

export function validateRequest(accountId, ticketTypeRequests) {
	if (!Number.isInteger(accountId) || accountId <= 0) {
		throw new InvalidPurchaseException("Invalid accountId.");
	}

	if (!ticketTypeRequests || ticketTypeRequests.length === 0) {
		throw new InvalidPurchaseException("No tickets requested.");
	}

	for (const req of ticketTypeRequests) {
		if (!req ||
			typeof req.getNoOfTickets !== "function" ||
			!Number.isInteger(req.getNoOfTickets()) ||
			req.getNoOfTickets() < 0
		) {
			throw new InvalidPurchaseException("Invalid ticket quantity or type.");
		}
	}

	let adults = 0;
	let children = 0;
	let infants = 0;

	for (const req of ticketTypeRequests) {
		const type = typeof req.getTicketType === "function" ? req.getTicketType() : undefined;
		const qty = req.getNoOfTickets();

		if (type === "ADULT") {
			adults += qty;
		} else if (type === "CHILD") {
			children += qty;
		} else if (type === "INFANT") {
			infants += qty;
		}
	}

	const totalRequested = adults + children + infants;

	if (totalRequested > MAX_TICKETS) {
		throw new InvalidPurchaseException(`Cannot purchase more than ${MAX_TICKETS} tickets.`);
	}

	if ((children > 0 || infants > 0) && adults === 0) {
		throw new InvalidPurchaseException("Child and Infant tickets require at least one Adult.");
	}

	return {
		adults,
		children,
		infants
	};
}
