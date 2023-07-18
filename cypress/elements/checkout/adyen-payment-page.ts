export const ADYEN_PAYMENT = {
  cardNumber: "input[id^='adyen-checkout-encryptedCardNumber']",
  expiryDate: "input[id^='adyen-checkout-encryptedExpiryDate']",
  cVC: "input[id^='adyen-checkout-encryptedSecurityCode']",
  nameOnCard: "[name='holderName']",
  confirmPreauthorizationButton: ".adyen-checkout__button",
  iFrameCardNumber: "iframe[title='Iframe for secured card number']",
  iFrameExpiryDate: "iframe[title='Iframe for secured card expiry date']",
  iFrameCVC: "iframe[title='Iframe for secured card security code']",
};
