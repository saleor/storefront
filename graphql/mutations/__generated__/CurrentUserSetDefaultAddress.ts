import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import { AddressDetailsFragmentFragmentDoc } from '../../fragments/__generated__/AdressDetailsFragment';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type SetAddressDefaultMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  type: Types.AddressTypeEnum;
}>;


export type SetAddressDefaultMutation = { __typename?: 'Mutation', accountSetDefaultAddress?: { __typename?: 'AccountSetDefaultAddress', user?: { __typename?: 'User', addresses?: Array<{ __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined> | null | undefined } | null | undefined, errors: Array<{ __typename?: 'AccountError', code: Types.AccountErrorCode, message?: string | null | undefined }> } | null | undefined };


export const SetAddressDefaultDocument = gql`
    mutation SetAddressDefault($id: ID!, $type: AddressTypeEnum!) {
  accountSetDefaultAddress(id: $id, type: $type) {
    user {
      addresses {
        ...AddressDetailsFragment
      }
    }
    errors {
      code
      message
    }
  }
}
    ${AddressDetailsFragmentFragmentDoc}`;
export type SetAddressDefaultMutationFn = Apollo.MutationFunction<SetAddressDefaultMutation, SetAddressDefaultMutationVariables>;

/**
 * __useSetAddressDefaultMutation__
 *
 * To run a mutation, you first call `useSetAddressDefaultMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetAddressDefaultMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setAddressDefaultMutation, { data, loading, error }] = useSetAddressDefaultMutation({
 *   variables: {
 *      id: // value for 'id'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useSetAddressDefaultMutation(baseOptions?: Apollo.MutationHookOptions<SetAddressDefaultMutation, SetAddressDefaultMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetAddressDefaultMutation, SetAddressDefaultMutationVariables>(SetAddressDefaultDocument, options);
      }
export type SetAddressDefaultMutationHookResult = ReturnType<typeof useSetAddressDefaultMutation>;
export type SetAddressDefaultMutationResult = Apollo.MutationResult<SetAddressDefaultMutation>;
export type SetAddressDefaultMutationOptions = Apollo.BaseMutationOptions<SetAddressDefaultMutation, SetAddressDefaultMutationVariables>;