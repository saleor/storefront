import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import { AddressDetailsFragmentFragmentDoc } from '../../fragments/__generated__/AdressDetailsFragment';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CurrentUserAddressesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CurrentUserAddressesQuery = { __typename?: 'Query', me?: { __typename?: 'User', addresses?: Array<{ __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined> | null | undefined } | null | undefined };


export const CurrentUserAddressesDocument = gql`
    query CurrentUserAddresses {
  me {
    addresses {
      ...AddressDetailsFragment
    }
  }
}
    ${AddressDetailsFragmentFragmentDoc}`;

/**
 * __useCurrentUserAddressesQuery__
 *
 * To run a query within a React component, call `useCurrentUserAddressesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserAddressesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserAddressesQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserAddressesQuery(baseOptions?: Apollo.QueryHookOptions<CurrentUserAddressesQuery, CurrentUserAddressesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CurrentUserAddressesQuery, CurrentUserAddressesQueryVariables>(CurrentUserAddressesDocument, options);
      }
export function useCurrentUserAddressesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentUserAddressesQuery, CurrentUserAddressesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CurrentUserAddressesQuery, CurrentUserAddressesQueryVariables>(CurrentUserAddressesDocument, options);
        }
export type CurrentUserAddressesQueryHookResult = ReturnType<typeof useCurrentUserAddressesQuery>;
export type CurrentUserAddressesLazyQueryHookResult = ReturnType<typeof useCurrentUserAddressesLazyQuery>;
export type CurrentUserAddressesQueryResult = Apollo.QueryResult<CurrentUserAddressesQuery, CurrentUserAddressesQueryVariables>;