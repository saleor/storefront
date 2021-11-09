import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import { CheckoutDetailsFragmentFragmentDoc } from '../../fragments/__generated__/CheckoutDetailsFragment';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CheckoutEmailUpdateMutationVariables = Types.Exact<{
  token: Types.Scalars['UUID'];
  email: Types.Scalars['String'];
}>;


export type CheckoutEmailUpdateMutation = { __typename?: 'Mutation', checkoutEmailUpdate?: { __typename?: 'CheckoutEmailUpdate', checkout?: { __typename?: 'Checkout', id: string, token: any, email: string, isShippingRequired: boolean, discountName?: string | null | undefined, billingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingMethod?: { __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined, availableShippingMethods: Array<{ __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined>, availablePaymentGateways: Array<{ __typename?: 'PaymentGateway', id: string, name: string, config: Array<{ __typename?: 'GatewayConfigLine', field: string, value?: string | null | undefined }> }>, lines?: Array<{ __typename?: 'CheckoutLine', id: string, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, variant: { __typename?: 'ProductVariant', id: string, name: string, product: { __typename?: 'Product', id: string, name: string, slug: string, thumbnail?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined }, pricing?: { __typename?: 'VariantPricingInfo', price?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined } } | null | undefined> | null | undefined, discount?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined, subtotalPrice?: { __typename?: 'TaxedMoney', net: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string }, tax: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, shippingPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined, errors: Array<{ __typename?: 'CheckoutError', field?: string | null | undefined, message?: string | null | undefined }> } | null | undefined };


export const CheckoutEmailUpdateDocument = gql`
    mutation CheckoutEmailUpdate($token: UUID!, $email: String!) {
  checkoutEmailUpdate(email: $email, token: $token) {
    checkout {
      ...CheckoutDetailsFragment
    }
    errors {
      field
      message
    }
  }
}
    ${CheckoutDetailsFragmentFragmentDoc}`;
export type CheckoutEmailUpdateMutationFn = Apollo.MutationFunction<CheckoutEmailUpdateMutation, CheckoutEmailUpdateMutationVariables>;

/**
 * __useCheckoutEmailUpdateMutation__
 *
 * To run a mutation, you first call `useCheckoutEmailUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCheckoutEmailUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [checkoutEmailUpdateMutation, { data, loading, error }] = useCheckoutEmailUpdateMutation({
 *   variables: {
 *      token: // value for 'token'
 *      email: // value for 'email'
 *   },
 * });
 */
export function useCheckoutEmailUpdateMutation(baseOptions?: Apollo.MutationHookOptions<CheckoutEmailUpdateMutation, CheckoutEmailUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CheckoutEmailUpdateMutation, CheckoutEmailUpdateMutationVariables>(CheckoutEmailUpdateDocument, options);
      }
export type CheckoutEmailUpdateMutationHookResult = ReturnType<typeof useCheckoutEmailUpdateMutation>;
export type CheckoutEmailUpdateMutationResult = Apollo.MutationResult<CheckoutEmailUpdateMutation>;
export type CheckoutEmailUpdateMutationOptions = Apollo.BaseMutationOptions<CheckoutEmailUpdateMutation, CheckoutEmailUpdateMutationVariables>;