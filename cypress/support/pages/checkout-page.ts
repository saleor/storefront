import { CHECKOUT_ELEMENTS } from "../../elements/checkout/checkout-page";
import { DUMMY_PAYMENT } from "../../elements/checkout/dummy-payment-page";
import { ADYEN_PAYMENT } from "../../elements/checkout/adyen-payment-page";

export function payByDummyPayment() {
  cy.addAliasToGraphRequest("order");
  cy.get(CHECKOUT_ELEMENTS.paymentProviders).children().find("[value='dummy']").click().wait(2000);
  cy.get(CHECKOUT_ELEMENTS.payButton).click().wait(2000);
  cy.get(DUMMY_PAYMENT.dummyPayButton).click();
}

export function payByAdyenPayment(card) {
  cy.addAliasToGraphRequest("order");
  cy.intercept("POST", "/saleor-app-checkout/api/drop-in/adyen/sessions/*").as("adyenSession");
  cy.get(CHECKOUT_ELEMENTS.paymentProviders).should("be.visible");
  cy.wait("@adyenSession").then(() => {
    adyenIframeHandler(ADYEN_PAYMENT.iFrameCardNumber, ADYEN_PAYMENT.cardNumber, card.cardNumber);
    adyenIframeHandler(ADYEN_PAYMENT.iFrameExpiryDate, ADYEN_PAYMENT.expiryDate, card.expiryDate);
    adyenIframeHandler(ADYEN_PAYMENT.iFrameCVC, ADYEN_PAYMENT.cVC, card.cvc);
    cy.get(ADYEN_PAYMENT.confirmPreauthorizationButton).click();
  });
}

function adyenIframeHandler(iframeSelector, cardElement, cardValue) {
  cy.get(iframeSelector)
    .should("be.visible")
    .then(($iframe) => {
      const $body = $iframe.contents().find("body");
      cy.wrap($body).find(cardElement).wait(500).should("be.enabled").type(cardValue);
    });
}
