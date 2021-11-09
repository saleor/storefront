import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import { MenuItemFragmentFragmentDoc } from '../../fragments/__generated__/MenuItemFragment';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type MenuQueryQueryVariables = Types.Exact<{
  slug: Types.Scalars['String'];
}>;


export type MenuQueryQuery = { __typename?: 'Query', menu?: { __typename?: 'Menu', id: string, name: string, slug: string, items?: Array<{ __typename?: 'MenuItem', id: string, name: string, category?: { __typename?: 'Category', id: string, slug: string } | null | undefined, collection?: { __typename?: 'Collection', id: string, slug: string } | null | undefined, page?: { __typename?: 'Page', id: string, slug: string, content?: any | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined };


export const MenuQueryDocument = gql`
    query MenuQuery($slug: String!) {
  menu(channel: "default-channel", slug: $slug) {
    id
    name
    slug
    items {
      ...MenuItemFragment
    }
  }
}
    ${MenuItemFragmentFragmentDoc}`;

/**
 * __useMenuQueryQuery__
 *
 * To run a query within a React component, call `useMenuQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useMenuQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMenuQueryQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useMenuQueryQuery(baseOptions: Apollo.QueryHookOptions<MenuQueryQuery, MenuQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MenuQueryQuery, MenuQueryQueryVariables>(MenuQueryDocument, options);
      }
export function useMenuQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MenuQueryQuery, MenuQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MenuQueryQuery, MenuQueryQueryVariables>(MenuQueryDocument, options);
        }
export type MenuQueryQueryHookResult = ReturnType<typeof useMenuQueryQuery>;
export type MenuQueryLazyQueryHookResult = ReturnType<typeof useMenuQueryLazyQuery>;
export type MenuQueryQueryResult = Apollo.QueryResult<MenuQueryQuery, MenuQueryQueryVariables>;