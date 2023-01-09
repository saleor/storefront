export const ADYEN_PAYMENT = {
  cardNumber: "input[name^='adyen-checkout-encryptedCardNumber']",
  expiryDate: "input[name^='adyen-checkout-encryptedExpiryDate']",
  cVC: "input[name^='adyen-checkout-encryptedSecurityCode']",
  nameOnCard: "input^[name='adyen-checkout-holderName']",
  confirmPreauthorizationButton:
    "[data-testid='adyen-checkout__button adyen-checkout__button--pay']",
};
