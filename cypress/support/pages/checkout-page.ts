import { CHECKOUT_ELEMENTS } from "../../elements/checkout/checkout-page";
import { DUMMY_PAYMENT } from "../../elements/checkout/dummy-payment-page";
import { ADYEN_PAYMENT } from "../../elements/checkout/adyen-payment-page";

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

export function payByAdyenPayment(card) {
  cy.addAliasToGraphRequest("order")
    .get(CHECKOUT_ELEMENTS.paymentMethods)
    .get(ADYEN_PAYMENT.cardNumber)
    .type(card.cardNumber)
    .get(ADYEN_PAYMENT.expiryDate)
    .type(card.expiryDate)
    .get(ADYEN_PAYMENT.cVC)
    .type(card.cvc)
    .get(ADYEN_PAYMENT.nameOnCard)
    .type(card.nameOnCard)
    .get(ADYEN_PAYMENT.confirmPreauthorizationButton)
    .click();
}
