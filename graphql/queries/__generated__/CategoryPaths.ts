import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CategoryPathsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CategoryPathsQuery = { __typename?: 'Query', categories?: { __typename?: 'CategoryCountableConnection', edges: Array<{ __typename?: 'CategoryCountableEdge', cursor: string, node: { __typename?: 'Category', id: string, slug: string } }> } | null | undefined };


export const CategoryPathsDocument = gql`
    query CategoryPaths {
  categories(first: 20) {
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
 * __useCategoryPathsQuery__
 *
 * To run a query within a React component, call `useCategoryPathsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCategoryPathsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoryPathsQuery({
 *   variables: {
 *   },
 * });
 */
export function useCategoryPathsQuery(baseOptions?: Apollo.QueryHookOptions<CategoryPathsQuery, CategoryPathsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CategoryPathsQuery, CategoryPathsQueryVariables>(CategoryPathsDocument, options);
      }
export function useCategoryPathsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CategoryPathsQuery, CategoryPathsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CategoryPathsQuery, CategoryPathsQueryVariables>(CategoryPathsDocument, options);
        }
export type CategoryPathsQueryHookResult = ReturnType<typeof useCategoryPathsQuery>;
export type CategoryPathsLazyQueryHookResult = ReturnType<typeof useCategoryPathsLazyQuery>;
export type CategoryPathsQueryResult = Apollo.QueryResult<CategoryPathsQuery, CategoryPathsQueryVariables>;