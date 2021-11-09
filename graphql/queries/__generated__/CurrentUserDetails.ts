import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import { ImageFragmentFragmentDoc } from '../../fragments/__generated__/ImageFragment';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CurrentUserDetailsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CurrentUserDetailsQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, lastLogin?: any | null | undefined, dateJoined: any, email: string, firstName: string, lastName: string, avatar?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined, orders?: { __typename?: 'OrderCountableConnection', totalCount?: number | null | undefined } | null | undefined } | null | undefined };


export const CurrentUserDetailsDocument = gql`
    query CurrentUserDetails {
  me {
    id
    lastLogin
    dateJoined
    email
    firstName
    lastName
    avatar {
      ...ImageFragment
    }
    orders {
      totalCount
    }
  }
}
    ${ImageFragmentFragmentDoc}`;

/**
 * __useCurrentUserDetailsQuery__
 *
 * To run a query within a React component, call `useCurrentUserDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserDetailsQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserDetailsQuery(baseOptions?: Apollo.QueryHookOptions<CurrentUserDetailsQuery, CurrentUserDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CurrentUserDetailsQuery, CurrentUserDetailsQueryVariables>(CurrentUserDetailsDocument, options);
      }
export function useCurrentUserDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentUserDetailsQuery, CurrentUserDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CurrentUserDetailsQuery, CurrentUserDetailsQueryVariables>(CurrentUserDetailsDocument, options);
        }
export type CurrentUserDetailsQueryHookResult = ReturnType<typeof useCurrentUserDetailsQuery>;
export type CurrentUserDetailsLazyQueryHookResult = ReturnType<typeof useCurrentUserDetailsLazyQuery>;
export type CurrentUserDetailsQueryResult = Apollo.QueryResult<CurrentUserDetailsQuery, CurrentUserDetailsQueryVariables>;