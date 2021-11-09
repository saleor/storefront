import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import { AddressDetailsFragmentFragmentDoc } from '../../fragments/__generated__/AdressDetailsFragment';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CheckoutCompleteMutationVariables = Types.Exact<{
  checkoutToken: Types.Scalars['UUID'];
  paymentData?: Types.Maybe<Types.Scalars['JSONString']>;
}>;


export type CheckoutCompleteMutation = { __typename?: 'Mutation', checkoutComplete?: { __typename?: 'CheckoutComplete', confirmationNeeded: boolean, confirmationData?: any | null | undefined, order?: { __typename?: 'Order', id: string, status: Types.OrderStatus, token: string, billingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined } | null | undefined, errors: Array<{ __typename?: 'CheckoutError', field?: string | null | undefined, message?: string | null | undefined, variants?: Array<string> | null | undefined, addressType?: Types.AddressTypeEnum | null | undefined }> } | null | undefined };


export const CheckoutCompleteDocument = gql`
    mutation checkoutComplete($checkoutToken: UUID!, $paymentData: JSONString) {
  checkoutComplete(token: $checkoutToken, paymentData: $paymentData) {
    order {
      id
      status
      token
      billingAddress {
        id
        ...AddressDetailsFragment
      }
      shippingAddress {
        id
        ...AddressDetailsFragment
      }
    }
    confirmationNeeded
    confirmationData
    errors {
      field
      message
      variants
      addressType
    }
  }
}
    ${AddressDetailsFragmentFragmentDoc}`;
export type CheckoutCompleteMutationFn = Apollo.MutationFunction<CheckoutCompleteMutation, CheckoutCompleteMutationVariables>;

/**
 * __useCheckoutCompleteMutation__
 *
 * To run a mutation, you first call `useCheckoutCompleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCheckoutCompleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [checkoutCompleteMutation, { data, loading, error }] = useCheckoutCompleteMutation({
 *   variables: {
 *      checkoutToken: // value for 'checkoutToken'
 *      paymentData: // value for 'paymentData'
 *   },
 * });
 */
export function useCheckoutCompleteMutation(baseOptions?: Apollo.MutationHookOptions<CheckoutCompleteMutation, CheckoutCompleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CheckoutCompleteMutation, CheckoutCompleteMutationVariables>(CheckoutCompleteDocument, options);
      }
export type CheckoutCompleteMutationHookResult = ReturnType<typeof useCheckoutCompleteMutation>;
export type CheckoutCompleteMutationResult = Apollo.MutationResult<CheckoutCompleteMutation>;
export type CheckoutCompleteMutationOptions = Apollo.BaseMutationOptions<CheckoutCompleteMutation, CheckoutCompleteMutationVariables>;