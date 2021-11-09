import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import { PriceFragmentFragmentDoc } from '../../fragments/__generated__/PriceFragment';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CheckoutPaymentCreateMutationVariables = Types.Exact<{
  checkoutToken: Types.Scalars['UUID'];
  paymentInput: Types.PaymentInput;
}>;


export type CheckoutPaymentCreateMutation = { __typename?: 'Mutation', checkoutPaymentCreate?: { __typename?: 'CheckoutPaymentCreate', payment?: { __typename?: 'Payment', id: string, total?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined, errors: Array<{ __typename?: 'PaymentError', field?: string | null | undefined, message?: string | null | undefined }> } | null | undefined };


export const CheckoutPaymentCreateDocument = gql`
    mutation checkoutPaymentCreate($checkoutToken: UUID!, $paymentInput: PaymentInput!) {
  checkoutPaymentCreate(token: $checkoutToken, input: $paymentInput) {
    payment {
      id
      total {
        ...PriceFragment
      }
    }
    errors {
      field
      message
    }
  }
}
    ${PriceFragmentFragmentDoc}`;
export type CheckoutPaymentCreateMutationFn = Apollo.MutationFunction<CheckoutPaymentCreateMutation, CheckoutPaymentCreateMutationVariables>;

/**
 * __useCheckoutPaymentCreateMutation__
 *
 * To run a mutation, you first call `useCheckoutPaymentCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCheckoutPaymentCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [checkoutPaymentCreateMutation, { data, loading, error }] = useCheckoutPaymentCreateMutation({
 *   variables: {
 *      checkoutToken: // value for 'checkoutToken'
 *      paymentInput: // value for 'paymentInput'
 *   },
 * });
 */
export function useCheckoutPaymentCreateMutation(baseOptions?: Apollo.MutationHookOptions<CheckoutPaymentCreateMutation, CheckoutPaymentCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CheckoutPaymentCreateMutation, CheckoutPaymentCreateMutationVariables>(CheckoutPaymentCreateDocument, options);
      }
export type CheckoutPaymentCreateMutationHookResult = ReturnType<typeof useCheckoutPaymentCreateMutation>;
export type CheckoutPaymentCreateMutationResult = Apollo.MutationResult<CheckoutPaymentCreateMutation>;
export type CheckoutPaymentCreateMutationOptions = Apollo.BaseMutationOptions<CheckoutPaymentCreateMutation, CheckoutPaymentCreateMutationVariables>;