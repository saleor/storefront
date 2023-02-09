export const REFRESH_TOKEN_KEY = "saleor_auth_module_refresh_token";
export const AUTH_STATE_KEY = "saleor_auth_module_state";
export const STORAGE_EVENT_KEY = "saleor_storage_auth_change";

export type AuthState = "none" | "fail" | "fetching" | "success";

export const setAuthState = (state: AuthState) => {
  const event = new CustomEvent(STORAGE_EVENT_KEY, { detail: { state } });
  window.dispatchEvent(event);
  window.localStorage.setItem(AUTH_STATE_KEY, state);
};

export const clearAuthState = () => setAuthState("none");

export const getAuthState = (): AuthState =>
  (window.localStorage.getItem(AUTH_STATE_KEY) as AuthState | undefined) || "none";

export const setRefreshToken = (token: string) => {
  window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const clearRefreshToken = () => {
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const getRefreshToken = () => window.localStorage.getItem(REFRESH_TOKEN_KEY) || null;
