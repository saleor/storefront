/* auth state when user signs in / out */
export const STORAGE_AUTH_STATE_KEY = "saleor_auth_module_auth_state";
export const STORAGE_AUTH_EVENT_KEY = "saleor_storage_auth_change";

export type AuthState = "signedIn" | "signedOut";

export type SaleorAuthEvent = CustomEvent<{ authState: AuthState }>;

export const sendAuthStateEvent = (authState: AuthState) => {
  const event = new CustomEvent(STORAGE_AUTH_EVENT_KEY, { detail: { authState } });
  window.dispatchEvent(event);
};

export const getAuthState = (): AuthState =>
  (window.localStorage.getItem(STORAGE_AUTH_STATE_KEY) as AuthState | undefined) || "signedOut";

export const setAuthState = (authState: AuthState) => {
  window.localStorage.setItem(STORAGE_AUTH_STATE_KEY, authState);
  sendAuthStateEvent(authState);
};

/* refresh token */
export const REFRESH_TOKEN_KEY = "saleor_auth_module_refresh_token";

export const getRefreshToken = () => window.localStorage.getItem(REFRESH_TOKEN_KEY) || null;

export const setRefreshToken = (token: string) => {
  window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

/* performed on logout */
export const clearAuthStorage = () => {
  setAuthState("signedOut");
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/* handler for storage changes */
