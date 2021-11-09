import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import { CategoryDetailsFragmentFragmentDoc } from '../../fragments/__generated__/CategoryDetailsFragment';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CategoryBySlugQueryVariables = Types.Exact<{
  slug: Types.Scalars['String'];
}>;


export type CategoryBySlugQuery = { __typename?: 'Query', category?: { __typename?: 'Category', id: string, seoTitle?: string | null | undefined, seoDescription?: string | null | undefined, description?: any | null | undefined, name: string, slug: string, backgroundImage?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined, ancestors?: { __typename?: 'CategoryCountableConnection', edges: Array<{ __typename?: 'CategoryCountableEdge', node: { __typename?: 'Category', id: string, name: string, slug: string } }> } | null | undefined } | null | undefined };


export const CategoryBySlugDocument = gql`
    query CategoryBySlug($slug: String!) {
  category(slug: $slug) {
    ...CategoryDetailsFragment
  }
}
    ${CategoryDetailsFragmentFragmentDoc}`;

/**
 * __useCategoryBySlugQuery__
 *
 * To run a query within a React component, call `useCategoryBySlugQuery` and pass it any options that fit your needs.
 * When your component renders, `useCategoryBySlugQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoryBySlugQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useCategoryBySlugQuery(baseOptions: Apollo.QueryHookOptions<CategoryBySlugQuery, CategoryBySlugQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CategoryBySlugQuery, CategoryBySlugQueryVariables>(CategoryBySlugDocument, options);
      }
export function useCategoryBySlugLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CategoryBySlugQuery, CategoryBySlugQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CategoryBySlugQuery, CategoryBySlugQueryVariables>(CategoryBySlugDocument, options);
        }
export type CategoryBySlugQueryHookResult = ReturnType<typeof useCategoryBySlugQuery>;
export type CategoryBySlugLazyQueryHookResult = ReturnType<typeof useCategoryBySlugLazyQuery>;
export type CategoryBySlugQueryResult = Apollo.QueryResult<CategoryBySlugQuery, CategoryBySlugQueryVariables>;