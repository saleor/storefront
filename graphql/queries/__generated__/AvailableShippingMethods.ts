import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import { PriceFragmentFragmentDoc } from '../../fragments/__generated__/PriceFragment';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type AvailableShippingMethodsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AvailableShippingMethodsQuery = { __typename?: 'Query', shop: { __typename?: 'Shop', availableShippingMethods?: Array<{ __typename?: 'ShippingMethod', id: string, name: string, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined> | null | undefined } };


export const AvailableShippingMethodsDocument = gql`
    query AvailableShippingMethods {
  shop {
    availableShippingMethods(channel: "default-channel") {
      id
      name
      price {
        ...PriceFragment
      }
    }
  }
}
    ${PriceFragmentFragmentDoc}`;

/**
 * __useAvailableShippingMethodsQuery__
 *
 * To run a query within a React component, call `useAvailableShippingMethodsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAvailableShippingMethodsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAvailableShippingMethodsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAvailableShippingMethodsQuery(baseOptions?: Apollo.QueryHookOptions<AvailableShippingMethodsQuery, AvailableShippingMethodsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AvailableShippingMethodsQuery, AvailableShippingMethodsQueryVariables>(AvailableShippingMethodsDocument, options);
      }
export function useAvailableShippingMethodsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AvailableShippingMethodsQuery, AvailableShippingMethodsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AvailableShippingMethodsQuery, AvailableShippingMethodsQueryVariables>(AvailableShippingMethodsDocument, options);
        }
export type AvailableShippingMethodsQueryHookResult = ReturnType<typeof useAvailableShippingMethodsQuery>;
export type AvailableShippingMethodsLazyQueryHookResult = ReturnType<typeof useAvailableShippingMethodsLazyQuery>;
export type AvailableShippingMethodsQueryResult = Apollo.QueryResult<AvailableShippingMethodsQuery, AvailableShippingMethodsQueryVariables>;