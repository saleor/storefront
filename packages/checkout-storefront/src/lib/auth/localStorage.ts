/* authentication state */
export const AUTH_STATE_KEY = "saleor_auth_module_auth_state";
export const STORAGE_AUTH_EVENT_KEY = "saleor_storage_auth_change";

export type AuthState = "none" | "fail" | "success";

export const getAuthState = (): AuthState =>
  (window.localStorage.getItem(AUTH_STATE_KEY) as AuthState | undefined) || "none";

export const setAuthState = (state: AuthState) => {
  window.localStorage.setItem(AUTH_STATE_KEY, state);

  const event = new CustomEvent(STORAGE_AUTH_EVENT_KEY, { detail: { newValue: state } });
  window.dispatchEvent(event);
};

export const clearAuthState = () => setAuthState("none");

/* auth refresh state */
export const REFRESH_STATE_KEY = "saleor_auth_module_refreshing_auth";
export const STORAGE_REFRESH_EVENT_KEY = "saleor_storage_refresh_change";

export const setRefreshAuthState = (refreshing: boolean) => {
  window.localStorage.setItem(REFRESH_STATE_KEY, JSON.stringify(refreshing));

  const event = new CustomEvent(STORAGE_REFRESH_EVENT_KEY, { detail: { newValue: refreshing } });
  window.dispatchEvent(event);
};

export const getRefreshAuthState = (): boolean => {
  const refreshState = window.localStorage.getItem(REFRESH_STATE_KEY);
  return refreshState ? JSON.parse(refreshState) : false;
};

/* refresh token */
export const REFRESH_TOKEN_KEY = "saleor_auth_module_refresh_token";

export const getRefreshToken = () => window.localStorage.getItem(REFRESH_TOKEN_KEY) || null;

export const setRefreshToken = (token: string) => {
  window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const clearRefreshToken = () => {
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/* handler for storage changes */
export const handleStorageChange =
  <TValue>(eventType: string, storageKey: string, callback: (value: TValue) => void) =>
  (event: StorageEvent | CustomEvent) => {
    const isCustomAuthEvent = event?.type === eventType;

    const isStorageAuthEvent =
      event?.type === "storage" && (event as StorageEvent)?.key === storageKey;

    if (!isCustomAuthEvent && !isStorageAuthEvent) {
      return;
    }

    const valueToSet = isCustomAuthEvent
      ? (event as CustomEvent).detail.newValue
      : (event as StorageEvent).newValue;

    callback(valueToSet as TValue);
  };
