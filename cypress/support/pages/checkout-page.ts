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
  cy.get(CHECKOUT_ELEMENTS.paymentProviders).should("be.visible");
  adyenIframeHandler(ADYEN_PAYMENT.iFrameCardNumber, ADYEN_PAYMENT.cardNumber, card.cardNumber);
  adyenIframeHandler(ADYEN_PAYMENT.iFrameExpiryDate, ADYEN_PAYMENT.expiryDate, card.expiryDate);
  adyenIframeHandler(ADYEN_PAYMENT.iFrameCVC, ADYEN_PAYMENT.cVC, card.cvc);
  // condition is required because sometimes Adyen is configured with card holder name
  cy.get("body").then(($body) => {
    if ($body.find(ADYEN_PAYMENT.nameOnCard).length > 0) {
      cy.get(ADYEN_PAYMENT.nameOnCard).type(card.nameOnCard);
    }
  });
  cy.get(ADYEN_PAYMENT.confirmPreauthorizationButton).click();
}

function adyenIframeHandler(iframeSelector, cardElement, cardValue) {
  cy.get(iframeSelector)
    .should("be.visible")
    .then(($iframe) => {
      const $body = $iframe.contents().find("body");
      cy.wrap($body).find(cardElement).wait(500).should("be.enabled").type(cardValue);
    });
}
