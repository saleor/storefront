import gql from "graphql-tag";

export const accountErrorFragment = gql`
  fragment AccountErrorFragment on AccountError {
    code
    field
    message
  }
`;

export const REFRESH_TOKEN = gql`
  ${accountErrorFragment}
  mutation refreshToken($refreshToken: String!) {
    tokenRefresh(refreshToken: $refreshToken) {
      token
      errors {
        ...AccountErrorFragment
      }
    }
  }
`;

export const VERIFY_TOKEN = gql`
  ${accountErrorFragment}
  mutation verifyToken($token: String!) {
    tokenVerify(token: $token) {
      isValid
      payload

      errors {
        ...AccountErrorFragment
      }
    }
  }
`;
