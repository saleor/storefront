import { CHECKOUT_ELEMENTS } from "../../elements/checkout/checkout-page";
import { DUMMY_PAYMENT } from "../../elements/checkout/dummy-payment-page";

export function payByDummyPayment() {
  cy.addAliasToGraphRequest("order")
    .get(CHECKOUT_ELEMENTS.paymentMethods)
    .children()
    .find("[value='dummy']")
    .click()
    .wait(2000);
  cy.get(CHECKOUT_ELEMENTS.payButton).click().wait(2000);
  cy.get(DUMMY_PAYMENT.dummyPayButton).click();
}
