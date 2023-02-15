import {
  AuthState,
  SaleorAuthStorageHandler,
  STORAGE_AUTH_STATE_KEY,
} from "./SaleorAuthStorageHandler";
import {
  getCustomerDetachRequest,
  getTokenCreateRequest,
  getTokenRefreshRequest,
  isExpiredToken,
} from "./utils";
import { CustomerDetachResponse, Fetch, TokenCreateResponse, TokenRefreshResponse } from "./types";
import invariant from "ts-invariant";

export interface SaleorAuthClientProps {
  onAuthRefresh?: (isAuthenticating: boolean) => void;
  saleorApiUrl: string;
  storage: Storage;
}

export class SaleorAuthClient {
  private accessToken: string | null = null;
  private tokenRefreshPromise: null | Promise<Response> = null;
  private onAuthRefresh?: (isAuthenticating: boolean) => void;
  private saleorApiUrl: string;
  private storageHandler: SaleorAuthStorageHandler;

  constructor({ saleorApiUrl, storage, onAuthRefresh }: SaleorAuthClientProps) {
    this.storageHandler = new SaleorAuthStorageHandler(storage);
    this.onAuthRefresh = onAuthRefresh;
    this.saleorApiUrl = saleorApiUrl;

    window.addEventListener("storage", this.handleStorageChange);
  }

  private handleStorageChange = (event: StorageEvent) => {
    const { oldValue, newValue, type, key } = event;

    if (oldValue === newValue || type !== "storage" || key !== STORAGE_AUTH_STATE_KEY) {
      return;
    }

    this.storageHandler.sendAuthStateEvent(newValue as AuthState);
  };

  cleanup = () => {
    window.removeEventListener("storage", this.handleStorageChange);
  };

  private runAuthorizedRequest: Fetch = (input, init) => {
    // technically we run this only when token is there
    // but just to make typescript happy
    if (!this.accessToken) {
      return fetch(input, init);
    }

    const headers = init?.headers || {};

    return fetch(input, {
      ...init,
      headers: { ...headers, Authorization: `Bearer ${this.accessToken}` },
    });
  };

  private handleRequestWithTokenRefresh: Fetch = async (input, init) => {
    const refreshToken = this.storageHandler.getRefreshToken();

    invariant(refreshToken, "Missing refresh token in token refresh handler");

    // the refresh already, finished, proceed as normal
    if (this.accessToken) {
      this.tokenRefreshPromise = null;
      return this.fetchWithAuth(input, init);
    }

    typeof this.onAuthRefresh === "function" && this.onAuthRefresh(true);

    // if the promise is already there, use it
    if (this.tokenRefreshPromise) {
      const response = await this.tokenRefreshPromise;

      const res: TokenRefreshResponse = await response.json();

      const {
        data: {
          tokenRefresh: { errors, token },
        },
      } = res;

      typeof this.onAuthRefresh === "function" && this.onAuthRefresh(false);

      if (errors.length || !token) {
        this.storageHandler.setAuthState("signedOut");
        return fetch(input, init);
      }

      this.storageHandler.setAuthState("signedIn");
      this.accessToken = token;
      return this.runAuthorizedRequest(input, init);
    }

    // this is the first failed request, initialize refresh
    this.tokenRefreshPromise = fetch(this.saleorApiUrl, getTokenRefreshRequest(refreshToken));
    return this.fetchWithAuth(input, init);
  };

  fetchWithAuth: Fetch = async (input, init) => {
    const refreshToken: string | null = this.storageHandler.getRefreshToken();

    // access token is fine, add it to the request and proceed
    if (this.accessToken && !isExpiredToken(this.accessToken)) {
      return this.runAuthorizedRequest(input, init);
    }

    // refresh token exists, try to authenticate if possible
    if (refreshToken) {
      return this.handleRequestWithTokenRefresh(input, init);
    }

    // any regular mutation, no previous sign in, proceed
    return fetch(input, init);
  };

  signIn = async ({ email, password }: { email: string; password: string }) => {
    const response = await fetch(this.saleorApiUrl, getTokenCreateRequest(email, password));

    const readResponse: TokenCreateResponse = await response.json();

    const {
      data: {
        tokenCreate: { errors, token, refreshToken },
      },
    } = readResponse;

    if (!token || errors.length) {
      this.storageHandler.setAuthState("signedOut");
      return readResponse;
    }

    if (token) {
      this.accessToken = token;
    }

    if (refreshToken) {
      this.storageHandler.setRefreshToken(refreshToken);
    }

    this.storageHandler.setAuthState("signedIn");
    return readResponse;
  };

  signOut = () => {
    this.accessToken = null;
    this.storageHandler.clearAuthStorage();
  };

  checkoutSignOut = async (checkoutId: string) => {
    // customer detach needs auth so run it and then remove all the tokens
    const response = await this.runAuthorizedRequest(
      this.saleorApiUrl,
      getCustomerDetachRequest(checkoutId)
    );

    const readResponse: CustomerDetachResponse = await response.json();

    const {
      data: {
        checkoutCustomerDetach: { errors },
      },
    } = readResponse;

    if (errors?.length) {
      this.signOut();
    }

    return readResponse;
  };
}
