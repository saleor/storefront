import { defineMessages } from "react-intl";

export const errorMessages = defineMessages({
  somethingWentWrong: {
    defaultMessage: "Sorry, something went wrong. Please try again in a moment.",
    id: "useAlerts/messages/7yexjS",
    description: "something went wrong",
  },
  requestPasswordResetEmailNotFoundError: {
    defaultMessage: "User with provided email has not been found",
    id: "useAlerts/messages/FggIw/",
    description: "request password reset - email not found error",
  },
  requestPasswordResetEmailInactiveError: {
    defaultMessage: "User account with provided email is inactive",
    id: "useAlerts/messages/wQ7eb8",
    description: "request password reset email inactive error",
  },
  checkoutShippingUpdateCountryAreaRequiredError: {
    defaultMessage: "Please select country area for shipping address",
    id: "useAlerts/messages/vn9b/m",
    description: "checkout shipping update country area required error",
  },
  checkoutBillingUpdateCountryAreaRequiredError: {
    defaultMessage: "Please select country area for billing address",
    id: "useAlerts/messages/JBUgUT",
    description: "checkout billing update country area required error",
  },
  checkoutFinalizePasswordRequiredError: {
    defaultMessage: "Please set user password before finalizing checkout",
    id: "useAlerts/messages/dCkgOw",
    description: "checkout finalize password required error",
  },
  checkoutEmailUpdateEmailInvalidError: {
    defaultMessage: "Provided email is invalid",
    id: "useAlerts/messages/dKzVev",
    description: "checkout email update email invalid error",
  },
  checkoutFinalizeEmailRequiredError: {
    defaultMessage: "Please provide a valid email before finalizing checkout",
    id: "useAlerts/messages/rVGqj8",
    description: "checkout finalize email required error",
  },
  checkoutFinalizePaymentProviderRequiredError: {
    defaultMessage: "Please select a payment method before finalizing checkout",
    id: "useAlerts/messages/b1SQCj",
    description: "checkout finalize payment provider required error",
  },
  checkoutFinalizeShippingAddressInvalidError: {
    defaultMessage: "Please fill in a valid shipping address before finalizing checkout",
    id: "useAlerts/messages/QtgaSX",
    description: "checkout finalize shipping address invalid error",
  },
  checkoutAddPromoCodePromoCodeInvalidError: {
    defaultMessage: "Invalid promo code provided",
    id: "useAlerts/messages/Bre+gJ",
    description: "checkout Add Promo Code Promo Code Invalid Error",
  },
  userAddressUpdatePostalCodeInvalidError: {
    defaultMessage: "Invalid postal code provided to address form",
    id: "useAlerts/messages/UUg3EN",
    description: "user Address Update Postal Code Invalid Error",
  },
  userRegisterPasswordPasswordTooShortError: {
    defaultMessage: "Provided password is too short",
    id: "useAlerts/messages/nuyNbJ",
    description: "userRegisterPasswordPasswordTooShortError",
  },
  checkoutPayShippingMethodNotSetError: "Please choose delivery method before finalizing checkout",
  checkoutEmailUpdateEmailRequiredError: "Email cannot be empty",
  checkoutPayTotalAmountMismatchError: "Couldn't finalize checkout, please try again",
  checkoutPayEmailNotSetError: "Please fill in email before finalizing checkout",
  userRegisterEmailUniqueError: "Cannot create account with email that is already used",
  loginEmailInactiveError: "Account with provided email is inactive",
  loginEmailNotFoundError: "Account with provided email was not found",
  loginEmailAccountNotConfirmedError: "Account hasn't been confirmed",
  resetPasswordPasswordPasswordTooShortError: "Provided password is too short",
  resetPasswordTokenInvalidError: "Provided reset password token is expired or invalid",
  checkoutLinesUpdateQuantityQuantityGreaterThanLimitError:
    "Couldn't update line - buy limit for this item exceeded",
  checkoutLinesUpdateQuantityInsufficientStockError:
    "Couldn't update line - insufficient stock in warehouse",
  loginEmailInvalidCredentialsError: "Invalid credentials provided to login",
  checkoutShippingUpdatePostalCodeInvalidError:
    "Invalid postal code was provided for shipping address",
  checkoutBillingUpdatePostalCodeInvalidError:
    "Invalid postal code was provided for billing address",
  checkoutFinalizeEmailInvalidError: "Please provide valid email before finalizing checkout",
});
