import { CHECKOUT_ELEMENTS } from "../../elements/checkout/checkout-page";
import { DUMMY_PAYMENT } from "../../elements/checkout/dummy-payment-page";
import { ORDER_CONFIRMATION } from "../../elements/checkout/order-confirmation";

export function payByDummyPayment() {
  cy.addAliasToGraphRequest("order")
    .get(CHECKOUT_ELEMENTS.paymentMethods)
    .children()
    .find("[value='dummy']")
    .click()
    .wait(2000);
  cy.get(CHECKOUT_ELEMENTS.payButton).click().wait(2000);
  cy.get(DUMMY_PAYMENT.dummyPayButton)
    .click()
    .wait("@order")
    .its("response.body.data.order.number")
    .then((orderNumber) => {
      cy.get(ORDER_CONFIRMATION.titleWithOrderNumber).should("contain", orderNumber);
      cy.get(ORDER_CONFIRMATION.paymentStatus)
        .children()
        .should("contain", "We've received your payment");
    });
}
