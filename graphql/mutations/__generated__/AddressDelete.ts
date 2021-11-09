import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import { AddressDetailsFragmentFragmentDoc } from '../../fragments/__generated__/AdressDetailsFragment';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type AddressDeleteMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type AddressDeleteMutation = { __typename?: 'Mutation', accountAddressDelete?: { __typename?: 'AccountAddressDelete', user?: { __typename?: 'User', addresses?: Array<{ __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined> | null | undefined } | null | undefined } | null | undefined };


export const AddressDeleteDocument = gql`
    mutation AddressDelete($id: ID!) {
  accountAddressDelete(id: $id) {
    user {
      addresses {
        ...AddressDetailsFragment
      }
    }
  }
}
    ${AddressDetailsFragmentFragmentDoc}`;
export type AddressDeleteMutationFn = Apollo.MutationFunction<AddressDeleteMutation, AddressDeleteMutationVariables>;

/**
 * __useAddressDeleteMutation__
 *
 * To run a mutation, you first call `useAddressDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddressDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addressDeleteMutation, { data, loading, error }] = useAddressDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAddressDeleteMutation(baseOptions?: Apollo.MutationHookOptions<AddressDeleteMutation, AddressDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddressDeleteMutation, AddressDeleteMutationVariables>(AddressDeleteDocument, options);
      }
export type AddressDeleteMutationHookResult = ReturnType<typeof useAddressDeleteMutation>;
export type AddressDeleteMutationResult = Apollo.MutationResult<AddressDeleteMutation>;
export type AddressDeleteMutationOptions = Apollo.BaseMutationOptions<AddressDeleteMutation, AddressDeleteMutationVariables>;