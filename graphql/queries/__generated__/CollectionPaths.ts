import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CollectionPathsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CollectionPathsQuery = { __typename?: 'Query', collections?: { __typename?: 'CollectionCountableConnection', edges: Array<{ __typename?: 'CollectionCountableEdge', node: { __typename?: 'Collection', slug: string } }> } | null | undefined };


export const CollectionPathsDocument = gql`
    query CollectionPaths {
  collections(channel: "default-channel", first: 20) {
    edges {
      node {
        slug
      }
    }
  }
}
    `;

/**
 * __useCollectionPathsQuery__
 *
 * To run a query within a React component, call `useCollectionPathsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionPathsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionPathsQuery({
 *   variables: {
 *   },
 * });
 */
export function useCollectionPathsQuery(baseOptions?: Apollo.QueryHookOptions<CollectionPathsQuery, CollectionPathsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CollectionPathsQuery, CollectionPathsQueryVariables>(CollectionPathsDocument, options);
      }
export function useCollectionPathsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionPathsQuery, CollectionPathsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CollectionPathsQuery, CollectionPathsQueryVariables>(CollectionPathsDocument, options);
        }
export type CollectionPathsQueryHookResult = ReturnType<typeof useCollectionPathsQuery>;
export type CollectionPathsLazyQueryHookResult = ReturnType<typeof useCollectionPathsLazyQuery>;
export type CollectionPathsQueryResult = Apollo.QueryResult<CollectionPathsQuery, CollectionPathsQueryVariables>;