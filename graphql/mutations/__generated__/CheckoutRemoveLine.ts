import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import { CheckoutDetailsFragmentFragmentDoc } from '../../fragments/__generated__/CheckoutDetailsFragment';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type RemoveProductFromCheckoutMutationVariables = Types.Exact<{
  checkoutToken: Types.Scalars['UUID'];
  lineId: Types.Scalars['ID'];
}>;


export type RemoveProductFromCheckoutMutation = { __typename?: 'Mutation', checkoutLineDelete?: { __typename?: 'CheckoutLineDelete', checkout?: { __typename?: 'Checkout', id: string, token: any, email: string, isShippingRequired: boolean, discountName?: string | null | undefined, billingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingMethod?: { __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined, availableShippingMethods: Array<{ __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined>, availablePaymentGateways: Array<{ __typename?: 'PaymentGateway', id: string, name: string, config: Array<{ __typename?: 'GatewayConfigLine', field: string, value?: string | null | undefined }> }>, lines?: Array<{ __typename?: 'CheckoutLine', id: string, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, variant: { __typename?: 'ProductVariant', id: string, name: string, product: { __typename?: 'Product', id: string, name: string, slug: string, thumbnail?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined }, pricing?: { __typename?: 'VariantPricingInfo', price?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined } } | null | undefined> | null | undefined, discount?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined, subtotalPrice?: { __typename?: 'TaxedMoney', net: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string }, tax: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, shippingPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined, errors: Array<{ __typename?: 'CheckoutError', field?: string | null | undefined, message?: string | null | undefined }> } | null | undefined };


export const RemoveProductFromCheckoutDocument = gql`
    mutation RemoveProductFromCheckout($checkoutToken: UUID!, $lineId: ID!) {
  checkoutLineDelete(token: $checkoutToken, lineId: $lineId) {
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
export type RemoveProductFromCheckoutMutationFn = Apollo.MutationFunction<RemoveProductFromCheckoutMutation, RemoveProductFromCheckoutMutationVariables>;

/**
 * __useRemoveProductFromCheckoutMutation__
 *
 * To run a mutation, you first call `useRemoveProductFromCheckoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveProductFromCheckoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeProductFromCheckoutMutation, { data, loading, error }] = useRemoveProductFromCheckoutMutation({
 *   variables: {
 *      checkoutToken: // value for 'checkoutToken'
 *      lineId: // value for 'lineId'
 *   },
 * });
 */
export function useRemoveProductFromCheckoutMutation(baseOptions?: Apollo.MutationHookOptions<RemoveProductFromCheckoutMutation, RemoveProductFromCheckoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveProductFromCheckoutMutation, RemoveProductFromCheckoutMutationVariables>(RemoveProductFromCheckoutDocument, options);
      }
export type RemoveProductFromCheckoutMutationHookResult = ReturnType<typeof useRemoveProductFromCheckoutMutation>;
export type RemoveProductFromCheckoutMutationResult = Apollo.MutationResult<RemoveProductFromCheckoutMutation>;
export type RemoveProductFromCheckoutMutationOptions = Apollo.BaseMutationOptions<RemoveProductFromCheckoutMutation, RemoveProductFromCheckoutMutationVariables>;