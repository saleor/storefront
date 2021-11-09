import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import { AddressDetailsFragmentFragmentDoc } from '../../fragments/__generated__/AdressDetailsFragment';
import { PriceFragmentFragmentDoc } from '../../fragments/__generated__/PriceFragment';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type OrderDetailsByTokenQueryVariables = Types.Exact<{
  token: Types.Scalars['UUID'];
}>;


export type OrderDetailsByTokenQuery = { __typename?: 'Query', orderByToken?: { __typename?: 'Order', id: string, status: Types.OrderStatus, number?: string | null | undefined, shippingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, billingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, subtotal: { __typename?: 'TaxedMoney', net: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string }, tax: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } }, total: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } }, lines: Array<{ __typename?: 'OrderLine', id: string, productName: string, variantName: string, quantity: number, thumbnail?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined, unitPrice: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } }, totalPrice: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } } | null | undefined>, shippingPrice: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } } | null | undefined };


export const OrderDetailsByTokenDocument = gql`
    query OrderDetailsByToken($token: UUID!) {
  orderByToken(token: $token) {
    id
    status
    number
    shippingAddress {
      ...AddressDetailsFragment
    }
    billingAddress {
      ...AddressDetailsFragment
    }
    subtotal {
      net {
        ...PriceFragment
      }
      tax {
        ...PriceFragment
      }
    }
    total {
      gross {
        ...PriceFragment
      }
    }
    lines {
      id
      productName
      variantName
      quantity
      thumbnail {
        url
        alt
      }
      unitPrice {
        gross {
          ...PriceFragment
        }
      }
      totalPrice {
        gross {
          ...PriceFragment
        }
      }
    }
    shippingPrice {
      gross {
        ...PriceFragment
      }
    }
  }
}
    ${AddressDetailsFragmentFragmentDoc}
${PriceFragmentFragmentDoc}`;

/**
 * __useOrderDetailsByTokenQuery__
 *
 * To run a query within a React component, call `useOrderDetailsByTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrderDetailsByTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrderDetailsByTokenQuery({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useOrderDetailsByTokenQuery(baseOptions: Apollo.QueryHookOptions<OrderDetailsByTokenQuery, OrderDetailsByTokenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrderDetailsByTokenQuery, OrderDetailsByTokenQueryVariables>(OrderDetailsByTokenDocument, options);
      }
export function useOrderDetailsByTokenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrderDetailsByTokenQuery, OrderDetailsByTokenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrderDetailsByTokenQuery, OrderDetailsByTokenQueryVariables>(OrderDetailsByTokenDocument, options);
        }
export type OrderDetailsByTokenQueryHookResult = ReturnType<typeof useOrderDetailsByTokenQuery>;
export type OrderDetailsByTokenLazyQueryHookResult = ReturnType<typeof useOrderDetailsByTokenLazyQuery>;
export type OrderDetailsByTokenQueryResult = Apollo.QueryResult<OrderDetailsByTokenQuery, OrderDetailsByTokenQueryVariables>;