import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import { CheckoutDetailsFragmentFragmentDoc } from '../../fragments/__generated__/CheckoutDetailsFragment';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CheckoutBillingAddressUpdateMutationVariables = Types.Exact<{
  token: Types.Scalars['UUID'];
  address: Types.AddressInput;
}>;


export type CheckoutBillingAddressUpdateMutation = { __typename?: 'Mutation', checkoutBillingAddressUpdate?: { __typename?: 'CheckoutBillingAddressUpdate', checkout?: { __typename?: 'Checkout', id: string, token: any, email: string, isShippingRequired: boolean, discountName?: string | null | undefined, billingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingMethod?: { __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined, availableShippingMethods: Array<{ __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined>, availablePaymentGateways: Array<{ __typename?: 'PaymentGateway', id: string, name: string, config: Array<{ __typename?: 'GatewayConfigLine', field: string, value?: string | null | undefined }> }>, lines?: Array<{ __typename?: 'CheckoutLine', id: string, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, variant: { __typename?: 'ProductVariant', id: string, name: string, product: { __typename?: 'Product', id: string, name: string, slug: string, thumbnail?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined }, pricing?: { __typename?: 'VariantPricingInfo', price?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined } } | null | undefined> | null | undefined, discount?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined, subtotalPrice?: { __typename?: 'TaxedMoney', net: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string }, tax: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, shippingPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined, errors: Array<{ __typename?: 'CheckoutError', field?: string | null | undefined, message?: string | null | undefined, code: Types.CheckoutErrorCode }> } | null | undefined };


export const CheckoutBillingAddressUpdateDocument = gql`
    mutation CheckoutBillingAddressUpdate($token: UUID!, $address: AddressInput!) {
  checkoutBillingAddressUpdate(billingAddress: $address, token: $token) {
    checkout {
      ...CheckoutDetailsFragment
    }
    errors {
      field
      message
      code
    }
  }
}
    ${CheckoutDetailsFragmentFragmentDoc}`;
export type CheckoutBillingAddressUpdateMutationFn = Apollo.MutationFunction<CheckoutBillingAddressUpdateMutation, CheckoutBillingAddressUpdateMutationVariables>;

/**
 * __useCheckoutBillingAddressUpdateMutation__
 *
 * To run a mutation, you first call `useCheckoutBillingAddressUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCheckoutBillingAddressUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [checkoutBillingAddressUpdateMutation, { data, loading, error }] = useCheckoutBillingAddressUpdateMutation({
 *   variables: {
 *      token: // value for 'token'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useCheckoutBillingAddressUpdateMutation(baseOptions?: Apollo.MutationHookOptions<CheckoutBillingAddressUpdateMutation, CheckoutBillingAddressUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CheckoutBillingAddressUpdateMutation, CheckoutBillingAddressUpdateMutationVariables>(CheckoutBillingAddressUpdateDocument, options);
      }
export type CheckoutBillingAddressUpdateMutationHookResult = ReturnType<typeof useCheckoutBillingAddressUpdateMutation>;
export type CheckoutBillingAddressUpdateMutationResult = Apollo.MutationResult<CheckoutBillingAddressUpdateMutation>;
export type CheckoutBillingAddressUpdateMutationOptions = Apollo.BaseMutationOptions<CheckoutBillingAddressUpdateMutation, CheckoutBillingAddressUpdateMutationVariables>;