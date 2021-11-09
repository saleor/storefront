import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import { CheckoutDetailsFragmentFragmentDoc } from '../../fragments/__generated__/CheckoutDetailsFragment';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CheckoutByTokenQueryVariables = Types.Exact<{
  checkoutToken: Types.Scalars['UUID'];
}>;


export type CheckoutByTokenQuery = { __typename?: 'Query', checkout?: { __typename?: 'Checkout', id: string, token: any, email: string, isShippingRequired: boolean, discountName?: string | null | undefined, billingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingMethod?: { __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined, availableShippingMethods: Array<{ __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined>, availablePaymentGateways: Array<{ __typename?: 'PaymentGateway', id: string, name: string, config: Array<{ __typename?: 'GatewayConfigLine', field: string, value?: string | null | undefined }> }>, lines?: Array<{ __typename?: 'CheckoutLine', id: string, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, variant: { __typename?: 'ProductVariant', id: string, name: string, product: { __typename?: 'Product', id: string, name: string, slug: string, thumbnail?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined }, pricing?: { __typename?: 'VariantPricingInfo', price?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined } } | null | undefined> | null | undefined, discount?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined, subtotalPrice?: { __typename?: 'TaxedMoney', net: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string }, tax: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, shippingPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined };


export const CheckoutByTokenDocument = gql`
    query CheckoutByToken($checkoutToken: UUID!) {
  checkout(token: $checkoutToken) {
    ...CheckoutDetailsFragment
  }
}
    ${CheckoutDetailsFragmentFragmentDoc}`;

/**
 * __useCheckoutByTokenQuery__
 *
 * To run a query within a React component, call `useCheckoutByTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckoutByTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCheckoutByTokenQuery({
 *   variables: {
 *      checkoutToken: // value for 'checkoutToken'
 *   },
 * });
 */
export function useCheckoutByTokenQuery(baseOptions: Apollo.QueryHookOptions<CheckoutByTokenQuery, CheckoutByTokenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CheckoutByTokenQuery, CheckoutByTokenQueryVariables>(CheckoutByTokenDocument, options);
      }
export function useCheckoutByTokenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CheckoutByTokenQuery, CheckoutByTokenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CheckoutByTokenQuery, CheckoutByTokenQueryVariables>(CheckoutByTokenDocument, options);
        }
export type CheckoutByTokenQueryHookResult = ReturnType<typeof useCheckoutByTokenQuery>;
export type CheckoutByTokenLazyQueryHookResult = ReturnType<typeof useCheckoutByTokenLazyQuery>;
export type CheckoutByTokenQueryResult = Apollo.QueryResult<CheckoutByTokenQuery, CheckoutByTokenQueryVariables>;