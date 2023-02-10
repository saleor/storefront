import {
  getAuthState,
  getRefreshToken,
  setAuthState,
  setRefreshAuthState,
  setRefreshToken,
} from "./localStorage";
import { isExpiredToken, refreshTokenRequest } from "./utils";
import { Fetch, TokenCreateResponse, TokenRefreshResponse } from "./types";

const TOKEN_CREATE_MUTATION_NAME = "tokenCreate";

export const createFetch = (saleorApiUrl: string): Fetch => {
  let accessToken: string | null = null;
  let tokenRefreshPromise: null | Promise<Response> = null;

  const runAuthorizedRequest: Fetch = (input, init) => {
    // technically we run this only when token is there
    // but just to make typescript happy
    if (!accessToken) {
      return fetch(input, init);
    }

    const headers = init?.headers || {};

    return fetch(input, {
      ...init,
      headers: { ...headers, Authorization: `Bearer ${accessToken}` },
    });
  };

  const handleRequestWithTokenRefresh: Fetch = async (input, init) => {
    // the refresh already, finished, proceed as normal
    if (accessToken) {
      tokenRefreshPromise = null;
      return fetchWithAuth(input, init);
    }

    setRefreshAuthState(true);

    // if the promise is already there, use it
    if (tokenRefreshPromise) {
      const response = await tokenRefreshPromise;

      const res: TokenRefreshResponse = await response.json();

      const {
        data: {
          tokenRefresh: { errors, token },
        },
      } = res;

      setRefreshAuthState(false);

      if (errors.length || !token) {
        setAuthState("fail");
        return fetch(input, init);
      }

      setAuthState("success");
      accessToken = token;
      return runAuthorizedRequest(input, init);
    }

    // this is the first failed request, initialize refresh
    tokenRefreshPromise = refreshTokenRequest(saleorApiUrl, getRefreshToken());
    return fetchWithAuth(input, init);
  };

  const handleSignIn: Fetch = async (input, init) => {
    const tokenCreateResponse = await fetch(input, init);
    // because we need to pass unchanged response
    const requestResponse = tokenCreateResponse.clone();

    const {
      data: {
        tokenCreate: { errors, token, refreshToken },
      },
    }: TokenCreateResponse = await tokenCreateResponse.json();

    if (!token || errors.length) {
      setAuthState("fail");
      return tokenCreateResponse;
    }

    if (token) {
      accessToken = token;
    }

    if (refreshToken) {
      setRefreshToken(refreshToken);
    }

    setAuthState("success");
    return requestResponse;
  };

  const fetchWithAuth: Fetch = (input, init) => {
    const refreshToken: string | null = getRefreshToken();

    const requestBody = init?.body?.toString() || "";

    const isTokenCreateMutation =
      requestBody.includes("mutation") && requestBody.includes(TOKEN_CREATE_MUTATION_NAME);

    // it's a token create mutation so we'll do some special magic
    if (isTokenCreateMutation) {
      return handleSignIn(input, init);
    }

    // access token is fine, add it to the request and proceed
    if (accessToken && !isExpiredToken(accessToken)) {
      // authState is "none" + no refresh token means logout has been run
      if (getAuthState() === "none" && !refreshToken) {
        accessToken = null;
        return fetch(input, init);
      }

      return runAuthorizedRequest(input, init);
    }

    // refresh token exists, try to authenticate if possible
    if (refreshToken) {
      return handleRequestWithTokenRefresh(input, init);
    }

    // any regular mutation, no previous sign in, proceed
    return fetch(input, init);
  };

  return fetchWithAuth;
};
