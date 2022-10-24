import { ORDER_CONFIRMATION } from "../../elements/checkout/order-confirmation";

export function checkIfOrderNumberAndPaymentStatusAreCorrect() {
  cy.wait("@order")
    .its("response.body.data.order.number")
    .then((orderNumber) => {
      cy.get(ORDER_CONFIRMATION.titleWithOrderNumber).should("contain", orderNumber);
      cy.get(ORDER_CONFIRMATION.paymentStatus)
        .children()
        .should("contain", "We've received your payment");
    });
}
