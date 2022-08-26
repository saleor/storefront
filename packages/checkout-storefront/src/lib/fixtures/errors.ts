import { CheckoutError } from "@/checkout-storefront/graphql";

export const checkoutErrors: CheckoutError[] = [
  {
    message: "This value is required for the address",
    field: "streetAddress1",
    code: "REQUIRED",
    __typename: "CheckoutError",
  },
  {
    message: "This value is not valid for the address.",
    field: "postalCode",
    code: "INVALID",
    __typename: "CheckoutError",
  },
];

export const urqlError = {
  message:
    "You need one of the following permissions: AUTHENTICATED_STAFF_USER, AUTHENTICATED_APP]",
  name: "authError",
  graphQLErrors: [],
  __typename: "CheckoutError",
};
