# cinema-tickets

A Node.js service for calculating ticket payments and seat reservations for a cinema ticket service. Applies pricing and business rules based on ticket type and enforces constraints such as maximum ticket limits and adult supervision.


## Requirements

- Node.js 20+

## Quick Start

```bash
npm install
npm test
npm run coverage
```

## Business Rules

- Maximum of 25 tickets per purchase
- Ticket prices:
  - Adult: £25
  - Child: £15
  - Infant: £0 (no seat allocated)
- Infants sit on an Adult’s lap (no seat reserved for them)  
- Child and Infant tickets require at least one Adult ticket
- Seats are allocated to Adult and Child tickets only

## Constraints

- `TicketService` interface cannot be changed  
- `TicketTypeRequest` is immutable and must be used as provided
- `thirdparty` services cannot be changed  


## Assumptions

- All accounts with ID > 0 are considered valid 
- `TicketPaymentService` always succeeds  
- `SeatReservationService` always succeeds

## Project Structure

- `src/pairtest/TicketService.js` – Service entry point
- `src/pairtest/domain/` – Contains business logic for pricing, seating, validation and constants
- `src/pairtest/lib/` – Provided `TicketTypeRequest` and `InvalidPurchaseException` 
- `src/thirdparty/` – Provided payment and seat reservation services

## Tests

Tests are located in the `test/` directory:

- `TicketService.test.js` – End-to-end tests for ticket purchasing
- `validation.test.js` – Input validation and business rules tests
- `pricing.test.js` – Pricing logic tests 
- `seating.test.js` – Seating allocation logic tests
- `TicketTypeRequest.test.js` – Tests for the provided `TicketTypeRequest` Dto