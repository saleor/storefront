import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import { PriceFragmentFragmentDoc } from '../../fragments/__generated__/PriceFragment';
import { ImageFragmentFragmentDoc } from '../../fragments/__generated__/ImageFragment';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type OrderDetailsQueryQueryVariables = Types.Exact<{
  token: Types.Scalars['UUID'];
}>;


export type OrderDetailsQueryQuery = { __typename?: 'Query', orderByToken?: { __typename?: 'Order', id: string, number?: string | null | undefined, created: any, statusDisplay?: string | null | undefined, shippingPrice: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } }, lines: Array<{ __typename?: 'OrderLine', id: string, productName: string, variantName: string, quantity: number, thumbnail?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined, totalPrice: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } } | null | undefined>, total: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } } | null | undefined };


export const OrderDetailsQueryDocument = gql`
    query OrderDetailsQuery($token: UUID!) {
  orderByToken(token: $token) {
    id
    number
    shippingPrice {
      gross {
        ...PriceFragment
      }
    }
    created
    lines {
      id
      thumbnail {
        ...ImageFragment
      }
      totalPrice {
        gross {
          ...PriceFragment
        }
      }
      productName
      variantName
      quantity
    }
    total {
      gross {
        ...PriceFragment
      }
    }
    statusDisplay
  }
}
    ${PriceFragmentFragmentDoc}
${ImageFragmentFragmentDoc}`;

/**
 * __useOrderDetailsQueryQuery__
 *
 * To run a query within a React component, call `useOrderDetailsQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrderDetailsQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrderDetailsQueryQuery({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useOrderDetailsQueryQuery(baseOptions: Apollo.QueryHookOptions<OrderDetailsQueryQuery, OrderDetailsQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrderDetailsQueryQuery, OrderDetailsQueryQueryVariables>(OrderDetailsQueryDocument, options);
      }
export function useOrderDetailsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrderDetailsQueryQuery, OrderDetailsQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrderDetailsQueryQuery, OrderDetailsQueryQueryVariables>(OrderDetailsQueryDocument, options);
        }
export type OrderDetailsQueryQueryHookResult = ReturnType<typeof useOrderDetailsQueryQuery>;
export type OrderDetailsQueryLazyQueryHookResult = ReturnType<typeof useOrderDetailsQueryLazyQuery>;
export type OrderDetailsQueryQueryResult = Apollo.QueryResult<OrderDetailsQueryQuery, OrderDetailsQueryQueryVariables>;