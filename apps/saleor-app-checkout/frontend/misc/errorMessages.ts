import { defineMessages } from "react-intl";

export const commonErrorMessages = defineMessages({
  somethingWentWrong: {
    defaultMessage: "Something went wrong",
    description: "error message",
  },
  unknownError: {
    defaultMessage: "Unknown error",
    description: "error message",
  },
  graphqlError: {
    defaultMessage: "GraphQL error",
    description: "error message",
  },
  unknown: {
    defaultMessage: "Unknown error",
    description: "error message",
  },
  invalid: {
    defaultMessage: "Invalid",
    description: "error message",
  },
  required: {
    defaultMessage: "Required",
    description: "error message",
  },
  notFound: {
    defaultMessage: "Not found",
    description: "error message",
  },
  notUpdated: {
    defaultMessage: "Not updated",
    description: "error message",
  },
});

export const notFoundMessages = defineMessages({
  paymentProviderNotFound: {
    defaultMessage: "Payment provider not found.",
    description: "error message",
  },
  channelPaymentOptionsNotFound: {
    defaultMessage: "Channel payment options not found.",
    description: "error message",
  },
});
