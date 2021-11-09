import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type ProductPathsQueryVariables = Types.Exact<{
  after?: Types.Maybe<Types.Scalars['String']>;
}>;


export type ProductPathsQuery = { __typename?: 'Query', products?: { __typename?: 'ProductCountableConnection', edges: Array<{ __typename?: 'ProductCountableEdge', cursor: string, node: { __typename?: 'Product', id: string, slug: string } }> } | null | undefined };


export const ProductPathsDocument = gql`
    query ProductPaths($after: String) {
  products(first: 50, channel: "default-channel", after: $after) {
    edges {
      cursor
      node {
        id
        slug
      }
    }
  }
}
    `;

/**
 * __useProductPathsQuery__
 *
 * To run a query within a React component, call `useProductPathsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductPathsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductPathsQuery({
 *   variables: {
 *      after: // value for 'after'
 *   },
 * });
 */
export function useProductPathsQuery(baseOptions?: Apollo.QueryHookOptions<ProductPathsQuery, ProductPathsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductPathsQuery, ProductPathsQueryVariables>(ProductPathsDocument, options);
      }
export function useProductPathsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductPathsQuery, ProductPathsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductPathsQuery, ProductPathsQueryVariables>(ProductPathsDocument, options);
        }
export type ProductPathsQueryHookResult = ReturnType<typeof useProductPathsQuery>;
export type ProductPathsLazyQueryHookResult = ReturnType<typeof useProductPathsLazyQuery>;
export type ProductPathsQueryResult = Apollo.QueryResult<ProductPathsQuery, ProductPathsQueryVariables>;