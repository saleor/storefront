import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import { OrderDetailsFragmentFragmentDoc } from '../../fragments/__generated__/OrderDetailsFragment';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type OrdersQueryVariables = Types.Exact<{
  before?: Types.Maybe<Types.Scalars['String']>;
  after?: Types.Maybe<Types.Scalars['String']>;
}>;


export type OrdersQuery = { __typename?: 'Query', me?: { __typename?: 'User', orders?: { __typename?: 'OrderCountableConnection', totalCount?: number | null | undefined, edges: Array<{ __typename?: 'OrderCountableEdge', cursor: string, node: { __typename?: 'Order', id: string, token: string, created: any, number?: string | null | undefined, status: Types.OrderStatus, total: { __typename?: 'TaxedMoney', currency: string, gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string }, net: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } | null | undefined } | null | undefined };


export const OrdersDocument = gql`
    query Orders($before: String, $after: String) {
  me {
    orders(first: 10, before: $before, after: $after) {
      edges {
        cursor
        node {
          ...OrderDetailsFragment
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
}
    ${OrderDetailsFragmentFragmentDoc}`;

/**
 * __useOrdersQuery__
 *
 * To run a query within a React component, call `useOrdersQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrdersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrdersQuery({
 *   variables: {
 *      before: // value for 'before'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useOrdersQuery(baseOptions?: Apollo.QueryHookOptions<OrdersQuery, OrdersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrdersQuery, OrdersQueryVariables>(OrdersDocument, options);
      }
export function useOrdersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrdersQuery, OrdersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrdersQuery, OrdersQueryVariables>(OrdersDocument, options);
        }
export type OrdersQueryHookResult = ReturnType<typeof useOrdersQuery>;
export type OrdersLazyQueryHookResult = ReturnType<typeof useOrdersLazyQuery>;
export type OrdersQueryResult = Apollo.QueryResult<OrdersQuery, OrdersQueryVariables>;