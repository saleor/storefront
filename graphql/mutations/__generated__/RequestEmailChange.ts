import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type RequestEmailChangeMutationVariables = Types.Exact<{
  newEmail: Types.Scalars['String'];
  password: Types.Scalars['String'];
  redirectUrl: Types.Scalars['String'];
}>;


export type RequestEmailChangeMutation = { __typename?: 'Mutation', requestEmailChange?: { __typename?: 'RequestEmailChange', user?: { __typename?: 'User', email: string } | null | undefined, errors: Array<{ __typename?: 'AccountError', field?: string | null | undefined, message?: string | null | undefined, code: Types.AccountErrorCode }> } | null | undefined };


export const RequestEmailChangeDocument = gql`
    mutation RequestEmailChange($newEmail: String!, $password: String!, $redirectUrl: String!) {
  requestEmailChange(
    channel: "default-channel"
    newEmail: $newEmail
    password: $password
    redirectUrl: $redirectUrl
  ) {
    user {
      email
    }
    errors {
      field
      message
      code
    }
  }
}
    `;
export type RequestEmailChangeMutationFn = Apollo.MutationFunction<RequestEmailChangeMutation, RequestEmailChangeMutationVariables>;

/**
 * __useRequestEmailChangeMutation__
 *
 * To run a mutation, you first call `useRequestEmailChangeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestEmailChangeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestEmailChangeMutation, { data, loading, error }] = useRequestEmailChangeMutation({
 *   variables: {
 *      newEmail: // value for 'newEmail'
 *      password: // value for 'password'
 *      redirectUrl: // value for 'redirectUrl'
 *   },
 * });
 */
export function useRequestEmailChangeMutation(baseOptions?: Apollo.MutationHookOptions<RequestEmailChangeMutation, RequestEmailChangeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RequestEmailChangeMutation, RequestEmailChangeMutationVariables>(RequestEmailChangeDocument, options);
      }
export type RequestEmailChangeMutationHookResult = ReturnType<typeof useRequestEmailChangeMutation>;
export type RequestEmailChangeMutationResult = Apollo.MutationResult<RequestEmailChangeMutation>;
export type RequestEmailChangeMutationOptions = Apollo.BaseMutationOptions<RequestEmailChangeMutation, RequestEmailChangeMutationVariables>;