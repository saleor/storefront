import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import { CollectionDetailsFragmentFragmentDoc } from '../../fragments/__generated__/CollectionDetailsFragment';
import { ImageFragmentFragmentDoc } from '../../fragments/__generated__/ImageFragment';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CollectionBySlugQueryVariables = Types.Exact<{
  slug: Types.Scalars['String'];
}>;


export type CollectionBySlugQuery = { __typename?: 'Query', collection?: { __typename?: 'Collection', id: string, seoTitle?: string | null | undefined, seoDescription?: string | null | undefined, description?: any | null | undefined, name: string, slug: string, backgroundImage?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined } | null | undefined };


export const CollectionBySlugDocument = gql`
    query CollectionBySlug($slug: String!) {
  collection(slug: $slug, channel: "default-channel") {
    id
    ...CollectionDetailsFragment
    seoTitle
    seoDescription
    description
    backgroundImage {
      ...ImageFragment
    }
  }
}
    ${CollectionDetailsFragmentFragmentDoc}
${ImageFragmentFragmentDoc}`;

/**
 * __useCollectionBySlugQuery__
 *
 * To run a query within a React component, call `useCollectionBySlugQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionBySlugQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionBySlugQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useCollectionBySlugQuery(baseOptions: Apollo.QueryHookOptions<CollectionBySlugQuery, CollectionBySlugQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CollectionBySlugQuery, CollectionBySlugQueryVariables>(CollectionBySlugDocument, options);
      }
export function useCollectionBySlugLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionBySlugQuery, CollectionBySlugQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CollectionBySlugQuery, CollectionBySlugQueryVariables>(CollectionBySlugDocument, options);
        }
export type CollectionBySlugQueryHookResult = ReturnType<typeof useCollectionBySlugQuery>;
export type CollectionBySlugLazyQueryHookResult = ReturnType<typeof useCollectionBySlugLazyQuery>;
export type CollectionBySlugQueryResult = Apollo.QueryResult<CollectionBySlugQuery, CollectionBySlugQueryVariables>;