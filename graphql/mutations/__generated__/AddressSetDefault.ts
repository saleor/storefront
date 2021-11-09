import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type AddressSetDefaultMutationVariables = Types.Exact<{
  addressID: Types.Scalars['ID'];
  userID: Types.Scalars['ID'];
  addressType: Types.AddressTypeEnum;
}>;


export type AddressSetDefaultMutation = { __typename?: 'Mutation', addressSetDefault?: { __typename?: 'AddressSetDefault', errors: Array<{ __typename?: 'AccountError', field?: string | null | undefined, message?: string | null | undefined, code: Types.AccountErrorCode }> } | null | undefined };


export const AddressSetDefaultDocument = gql`
    mutation AddressSetDefault($addressID: ID!, $userID: ID!, $addressType: AddressTypeEnum!) {
  addressSetDefault(addressId: $addressID, type: $addressType, userId: $userID) {
    errors {
      field
      message
      code
    }
  }
}
    `;
export type AddressSetDefaultMutationFn = Apollo.MutationFunction<AddressSetDefaultMutation, AddressSetDefaultMutationVariables>;

/**
 * __useAddressSetDefaultMutation__
 *
 * To run a mutation, you first call `useAddressSetDefaultMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddressSetDefaultMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addressSetDefaultMutation, { data, loading, error }] = useAddressSetDefaultMutation({
 *   variables: {
 *      addressID: // value for 'addressID'
 *      userID: // value for 'userID'
 *      addressType: // value for 'addressType'
 *   },
 * });
 */
export function useAddressSetDefaultMutation(baseOptions?: Apollo.MutationHookOptions<AddressSetDefaultMutation, AddressSetDefaultMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddressSetDefaultMutation, AddressSetDefaultMutationVariables>(AddressSetDefaultDocument, options);
      }
export type AddressSetDefaultMutationHookResult = ReturnType<typeof useAddressSetDefaultMutation>;
export type AddressSetDefaultMutationResult = Apollo.MutationResult<AddressSetDefaultMutation>;
export type AddressSetDefaultMutationOptions = Apollo.BaseMutationOptions<AddressSetDefaultMutation, AddressSetDefaultMutationVariables>;