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
  checkoutAddPromoCodePromoCodeInvalidError: {
    defaultMessage: "Invalid promo code provided",
    id: "useAlerts/messages/yGh+vi",
    description: "checkout add promo code - promo code invalid error",
  },
  userAddressUpdatePostalCodeInvalidError: {
    defaultMessage: "Invalid postal code provided to address form",
    id: "useAlerts/messages/uc7gzX",
    description: "user address update - postal code invalid error",
  },
  userAddressCreatePostalCodeInvalidError: {
    defaultMessage: "Invalid postal code provided to address form",
    id: "useAlerts/messages/wLQO7F",
    description: "user address create - postal code invalid error",
  },
  userRegisterPasswordPasswordTooShortError: {
    defaultMessage: "Provided password is too short",
    id: "useAlerts/messages/mJ81Pa",
    description: "user register - password too short error",
  },
  checkoutPayShippingMethodNotSetError: {
    defaultMessage: "Please choose delivery method before finalizing checkout",
    id: "useAlerts/messages/k0+Kez",
    description: "checkout pay - shipping method not set error",
  },
  checkoutEmailUpdateEmailRequiredError: {
    defaultMessage: "Email cannot be empty",
    id: "useAlerts/messages/a77ZZO",
    description: "checkout email update - email required error",
  },
  checkoutPayTotalAmountMismatchError: {
    defaultMessage: "Couldn't finalize checkout, please try again",
    id: "useAlerts/messages/glpqLA",
    description: "checkout pay - total amount mismatch error",
  },
  checkoutPayEmailNotSetError: {
    defaultMessage: "Please fill in email before finalizing checkout",
    id: "useAlerts/messages/7/Bo7+",
    description: "checkout pay - email not set error",
  },
  userRegisterEmailUniqueError: {
    defaultMessage: "Cannot create account with email that is already used",
    id: "useAlerts/messages/Vx4W5S",
    description: "user register - email unique error",
  },
  loginEmailInactiveError: {
    defaultMessage: "Account with provided email is inactive",
    id: "useAlerts/messages/ESuR0A",
    description: "login - email inactive error",
  },
  loginEmailNotFoundError: {
    defaultMessage: "Account with provided email was not found",
    id: "useAlerts/messages/LrYpGU",
    description: "login - email not found error",
  },
  loginEmailAccountNotConfirmedError: {
    defaultMessage: "Account hasn't been confirmed",
    id: "useAlerts/messages/iTl+Qz",
    description: "login - account not confirmed error",
  },
  resetPasswordPasswordPasswordTooShortError: {
    defaultMessage: "Provided password is too short",
    id: "useAlerts/messages/Xd2N1c",
    description: "reset password - password too short error",
  },
  resetPasswordTokenInvalidError: {
    defaultMessage: "Provided reset password token is expired or invalid",
    id: "useAlerts/messages/EwTHLm",
    description: "reset password - token invalid error",
  },
  checkoutLinesUpdateQuantityQuantityGreaterThanLimitError: {
    defaultMessage: "Couldn't update line - buy limit for this item exceeded",
    id: "useAlerts/messages/KXWHsh",
    description: "checkout lines update - quantity greater than limit error",
  },
  checkoutLinesUpdateQuantityInsufficientStockError: {
    defaultMessage: "Couldn't update line - insufficient stock in warehouse",
    id: "useAlerts/messages/oyFho2",
    description: "checkout lines update - insufficient stock error",
  },
  loginEmailInvalidCredentialsError: {
    defaultMessage: "Invalid credentials provided to login",
    id: "useAlerts/messages/nX71XF",
    description: "login - invalid credentials error",
  },
  checkoutShippingUpdatePostalCodeInvalidError: {
    defaultMessage: "Invalid postal code was provided for shipping address",
    id: "useAlerts/messages/2leXNc",
    description: "checkout shipping update - postal code invalid error",
  },
  checkoutShippingUpdatePhoneInvalidError: {
    defaultMessage: "Invalid phone number was provided for shipping address",
    id: "useAlerts/messages/jxRMRZ",
    description: "checkout shipping update - postal code invalid error",
  },
  checkoutBillingUpdatePostalCodeInvalidError: {
    defaultMessage: "Invalid postal code was provided for billing address",
    id: "useAlerts/messages/8fk/m5",
    description: "checkout billing update - postal code invalid error",
  },
});
