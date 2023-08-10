import { gql, useMutation } from "urql";

export function useCheckoutPaymentCreateMutation() {
  const mutation = gql`
    mutation checkoutPaymentCreate($checkoutToken: UUID!, $paymentInput: PaymentInput!) {
      checkoutPaymentCreate(token: $checkoutToken, input: $paymentInput) {
        payment {
          id
          total {
            currency
            amount
          }
        }
        errors {
          field
          message
        }
      }
    }
  `;

  return useMutation<any, { checkoutToken: string; paymentInput: any }>(mutation);
}
