import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import { MainMenuItemFragmentFragmentDoc } from '../../fragments/__generated__/MainMenuItemFragment';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type MainMenuQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type MainMenuQuery = { __typename?: 'Query', menu?: { __typename?: 'Menu', items?: Array<{ __typename?: 'MenuItem', name: string, children?: Array<{ __typename?: 'MenuItem', name: string, category?: { __typename?: 'Category', slug: string } | null | undefined, collection?: { __typename?: 'Collection', slug: string } | null | undefined, page?: { __typename?: 'Page', id: string, title: string, seoTitle?: string | null | undefined, seoDescription?: string | null | undefined, slug: string, created: any, content?: any | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined } | null | undefined };


export const MainMenuDocument = gql`
    query MainMenu {
  menu(slug: "navbar") {
    items {
      ...MainMenuItemFragment
    }
  }
}
    ${MainMenuItemFragmentFragmentDoc}`;

/**
 * __useMainMenuQuery__
 *
 * To run a query within a React component, call `useMainMenuQuery` and pass it any options that fit your needs.
 * When your component renders, `useMainMenuQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMainMenuQuery({
 *   variables: {
 *   },
 * });
 */
export function useMainMenuQuery(baseOptions?: Apollo.QueryHookOptions<MainMenuQuery, MainMenuQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MainMenuQuery, MainMenuQueryVariables>(MainMenuDocument, options);
      }
export function useMainMenuLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MainMenuQuery, MainMenuQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MainMenuQuery, MainMenuQueryVariables>(MainMenuDocument, options);
        }
export type MainMenuQueryHookResult = ReturnType<typeof useMainMenuQuery>;
export type MainMenuLazyQueryHookResult = ReturnType<typeof useMainMenuLazyQuery>;
export type MainMenuQueryResult = Apollo.QueryResult<MainMenuQuery, MainMenuQueryVariables>;